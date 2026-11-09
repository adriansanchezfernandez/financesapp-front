import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { MovementsService } from './movements.service';
import { CreateMovement, Movement } from '../pages/models/movement.model';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
describe('MovementsService', () => {
  let service: MovementsService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovementsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(MovementsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería comenzar con un saldo de 0', () => {
    expect(service.saldo()).toBe(0);
  });

  it('debería calcular ingresos, gastos y saldo al cargar movimientos', () => {
    const movimientos: Movement[] = [
      {
        id: 1,
        descripcion: 'Nómina',
        cantidad: 1500,
        fecha: '2026-11-01',
        tipo: 'ingreso',
      },
      {
        id: 2,
        descripcion: 'Supermercado',
        cantidad: 200,
        fecha: '2026-11-02',
        tipo: 'gasto',
      },
      {
        id: 3,
        descripcion: 'Alquiler',
        cantidad: 600,
        fecha: '2026-11-03',
        tipo: 'gasto',
      },
    ];

    service.loadMovements();

    const request = httpMock.expectOne('http://localhost:8080/api/movements');

    request.flush(movimientos);

    expect(service.movements()).toEqual(movimientos);
    expect(service.totalIngresos()).toBe(1500);
    expect(service.totalGastos()).toBe(800);
    expect(service.saldo()).toBe(700);
  });

  it('debería crear un movimiento y actualizar el Signal', () => {
    const nuevoMovimiento: CreateMovement = {
      descripcion: 'Nómina',
      cantidad: 1500,
      fecha: '2026-11-06',
      tipo: 'ingreso',
    };

    const movimientoCreado: Movement = {
      id: 1,
      ...nuevoMovimiento,
    };

    service.addMovement(nuevoMovimiento).subscribe();

    const request = httpMock.expectOne('http://localhost:8080/api/movements');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(nuevoMovimiento);

    request.flush(movimientoCreado);

    expect(service.movements()).toEqual([movimientoCreado]);
    expect(service.totalIngresos()).toBe(1500);
    expect(service.saldo()).toBe(1500);
  });

  it('no debería añadir un movimiento si el POST falla', () => {
    const nuevoMovimiento: CreateMovement = {
      descripcion: 'Nómina',
      cantidad: 1500,
      fecha: '2026-11-06',
      tipo: 'ingreso',
    };

    let errorRecibido: unknown;

    service.addMovement(nuevoMovimiento).subscribe({
      error: (error) => (errorRecibido = error),
    });

    const request = httpMock.expectOne('http://localhost:8080/api/movements');

    // Simulamos un error del servidor
    request.flush(
      { message: 'Error interno' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(errorRecibido).toEqual(expect.any(HttpErrorResponse));
    expect(service.movements()).toEqual([]);
    expect(service.saldo()).toBe(0);
  });

  it('debería actualizar un movimiento sin modificar los demás', () => {
    const movimientos: Movement[] = [
      {
        id: 1,
        descripcion: 'Nómina',
        cantidad: 1500,
        fecha: '2026-11-01',
        tipo: 'ingreso',
      },
      {
        id: 2,
        descripcion: 'Supermercado',
        cantidad: 200,
        fecha: '2026-11-02',
        tipo: 'gasto',
      },
    ];

    // 1. Cargamos dos movimientos ficticios
    service.loadMovements();

    const getRequest = httpMock.expectOne('http://localhost:8080/api/movements');

    getRequest.flush(movimientos);

    // 2. Preparamos los cambios
    const cambios: CreateMovement = {
      descripcion: 'Compra semanal',
      cantidad: 250,
      fecha: '2026-11-02',
      tipo: 'gasto',
    };

    const movimientoActualizado: Movement = {
      id: 2,
      ...cambios,
    };

    // 3. Ejecutamos el PUT
    service.updateMovement(2, cambios).subscribe();

    const putRequest = httpMock.expectOne('http://localhost:8080/api/movements/2');

    expect(putRequest.request.method).toBe('PUT');
    expect(putRequest.request.body).toEqual(cambios);

    putRequest.flush(movimientoActualizado);

    // 4. Comprobamos el resultado
    expect(service.movements()).toEqual([movimientos[0], movimientoActualizado]);

    expect(service.totalGastos()).toBe(250);
    expect(service.saldo()).toBe(1250);
  });

  it('debería eliminar un movimiento del Signal', () => {
    const movimientos: Movement[] = [
      {
        id: 1,
        descripcion: 'Nómina',
        cantidad: 1500,
        fecha: '2026-11-01',
        tipo: 'ingreso',
      },
      {
        id: 2,
        descripcion: 'Supermercado',
        cantidad: 200,
        fecha: '2026-11-02',
        tipo: 'gasto',
      },
    ];

    // Cargamos los movimientos
    service.loadMovements();

    const getRequest = httpMock.expectOne('http://localhost:8080/api/movements');

    getRequest.flush(movimientos);

    // Eliminamos el movimiento 2
    service.deleteMovement(2).subscribe();

    const deleteRequest = httpMock.expectOne('http://localhost:8080/api/movements/2');

    expect(deleteRequest.request.method).toBe('DELETE');

    // Simulamos la respuesta 204 No Content
    deleteRequest.flush(null, {
      status: 204,
      statusText: 'No Content',
    });

    expect(service.movements()).toEqual([movimientos[0]]);
    expect(service.totalGastos()).toBe(0);
    expect(service.saldo()).toBe(1500);
  });
});
