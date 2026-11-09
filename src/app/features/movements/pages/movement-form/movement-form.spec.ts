import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import {
  describe,
  it,
  expect,
  beforeEach,
  vi
} from 'vitest';

import { MovementForm } from './movement-form';
import { MovementsService } from '../../services/movements.service';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('MovementForm', () => {
  let component: MovementForm;
  let fixture: ComponentFixture<MovementForm>;

  const movementsServiceMock = {
    addMovement: vi.fn(),
    updateMovement: vi.fn(),
    getMovementById: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [MovementForm],
      providers: [
        provideRouter([]),
        {
          provide: MovementsService,
          useValue: movementsServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovementForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar con el formulario inválido', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('debería validar descripción y cantidad', () => {
    const descripcion = component.form.controls.descripcion;
    const cantidad = component.form.controls.cantidad;

    descripcion.setValue('');
    expect(descripcion.hasError('required')).toBe(true);

    descripcion.setValue('A'.repeat(101));
    expect(descripcion.hasError('maxlength')).toBe(true);

    descripcion.setValue('Supermercado');
    expect(descripcion.valid).toBe(true);

    cantidad.setValue(0);
    expect(cantidad.hasError('min')).toBe(true);

    cantidad.setValue(25);
    expect(cantidad.valid).toBe(true);

    expect(component.form.valid).toBe(true);
  });

  it('debería limpiar el formulario y restaurar los valores iniciales', () => {
    // ARRANGE: rellenamos el formulario
    component.form.patchValue({
      descripcion: 'Supermercado',
      cantidad: 50,
      tipo: 'ingreso',
    });

    expect(component.form.valid).toBe(true);

    // ACT: ejecutamos el método
    component.limpiar();

    // ASSERT: comprobamos los resultados
    expect(component.form.controls.descripcion.value).toBeNull();
    expect(component.form.controls.cantidad.value).toBeNull();
    expect(component.form.controls.tipo.value).toBe('gasto');
    expect(component.form.controls.fecha.value).toEqual(expect.any(Date));
    expect(component.form.invalid).toBe(true);
  });

  it('debería deshabilitar Guardar si el formulario es inválido', () => {
    const boton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-testid="guardar-movimiento"]',
    );

    expect(boton).not.toBeNull();
    expect(boton.disabled).toBe(true);

    component.form.patchValue({
      descripcion: 'Supermercado',
      cantidad: 50,
    });

    fixture.detectChanges();

    expect(boton.disabled).toBe(false);
  });

it('debería navegar a movimientos después de guardar', () => {
  const router = TestBed.inject(Router);
  const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

  movementsServiceMock.addMovement.mockReturnValue(
    of({
      id: 1,
      descripcion: 'Supermercado',
      cantidad: 50,
      fecha: '2026-11-09',
      tipo: 'gasto',
    })
  );

  component.form.patchValue({
    descripcion: 'Supermercado',
    cantidad: 50,
  });

  component.guardarMovimiento();

  expect(movementsServiceMock.addMovement).toHaveBeenCalledOnce();
  expect(navigateSpy).toHaveBeenCalledWith(['/movements']);
});


it('debería gestionar un error al guardar un movimiento', () => {
  const snackBar = TestBed.inject(MatSnackBar);
  const snackSpy = vi.spyOn(snackBar, 'open');

  movementsServiceMock.addMovement.mockReturnValue(
    throwError(() => new Error('Error del servidor'))
  );

  component.form.patchValue({
    descripcion: 'Supermercado',
    cantidad: 50
  });

  component.guardarMovimiento();

  expect(movementsServiceMock.addMovement).toHaveBeenCalledOnce();

  expect(snackSpy).not.toHaveBeenCalledWith(
    expect.stringContaining('correctamente'),
    expect.anything(),
    expect.anything()
  );
});

it('no debería navegar si falla el guardado', () => {
  const router = TestBed.inject(Router);

  const navigateSpy = vi.spyOn(router, 'navigate')
    .mockResolvedValue(true);

  movementsServiceMock.addMovement.mockReturnValue(
    throwError(() => new Error('Error del servidor'))
  );

  component.form.patchValue({
    descripcion: 'Supermercado',
    cantidad: 50
  });

  component.guardarMovimiento();

  expect(movementsServiceMock.addMovement).toHaveBeenCalledOnce();
  expect(navigateSpy).not.toHaveBeenCalled();
});


});
