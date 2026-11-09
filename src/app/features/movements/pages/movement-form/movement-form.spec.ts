import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { MovementForm } from './movement-form';

describe('MovementForm', () => {
  let component: MovementForm;
  let fixture: ComponentFixture<MovementForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementForm],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovementForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar con el formulario inválido', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('debería validar descripción y cantidad', () => {
  const descripcion = component.form.controls.descripcion;
  const cantidad = component.form.controls.cantidad;

  descripcion.setValue('');
  expect(descripcion.hasError('required')).toBeTrue();

  descripcion.setValue('A'.repeat(101));
  expect(descripcion.hasError('maxlength')).toBeTrue();

  descripcion.setValue('Supermercado');
  expect(descripcion.valid).toBeTrue();

  cantidad.setValue(0);
  expect(cantidad.hasError('min')).toBeTrue();

  cantidad.setValue(25);
  expect(cantidad.valid).toBeTrue();

  expect(component.form.valid).toBeTrue();
});


it('debería limpiar el formulario y restaurar los valores iniciales', () => {
  // ARRANGE: rellenamos el formulario
  component.form.patchValue({
    descripcion: 'Supermercado',
    cantidad: 50,
    tipo: 'ingreso'
  });

  expect(component.form.valid).toBeTrue();

  // ACT: ejecutamos el método
  component.limpiar();

  // ASSERT: comprobamos los resultados
  expect(component.form.controls.descripcion.value).toBeNull();
  expect(component.form.controls.cantidad.value).toBeNull();
  expect(component.form.controls.tipo.value).toBe('gasto');
  expect(component.form.controls.fecha.value).toEqual(jasmine.any(Date));
  expect(component.form.invalid).toBeTrue();
});

it('debería deshabilitar Guardar si el formulario es inválido', () => {
const boton: HTMLButtonElement =
  fixture.nativeElement.querySelector(
    '[data-testid="guardar-movimiento"]'
  );

  expect(boton).not.toBeNull();
  expect(boton.disabled).toBeTrue();

  component.form.patchValue({
    descripcion: 'Supermercado',
    cantidad: 50
  });

  fixture.detectChanges();

  expect(boton.disabled).toBeFalse();
});

it('debería navegar a movimientos después de guardar', () => {
  const router = TestBed.inject(Router);
  const navigateSpy = spyOn(router, 'navigate');

  component.form.patchValue({
    descripcion: 'Supermercado',
    cantidad: 50
  });

  component.guardarMovimiento();

  expect(navigateSpy).toHaveBeenCalledWith(['/movements']);
});
});