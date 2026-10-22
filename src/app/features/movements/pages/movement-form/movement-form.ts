import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material/material-module';
import dayjs from 'dayjs';
import { CreateMovement, Movement, MovementType } from '../models/movement.model';
import { MovementsService } from '../../services/movements.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  imports: [ReactiveFormsModule, MaterialModule],
  selector: 'app-movement-form',
  styleUrl: './movement-form.scss',
  templateUrl: './movement-form.html',
})
export class MovementForm implements OnInit {
  private readonly movementsService = inject(MovementsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly editingId = this.route.snapshot.paramMap.has('id')
    ? Number(this.route.snapshot.paramMap.get('id'))
    : null;
private readonly snackBar = inject(MatSnackBar);

  form = new FormGroup({
    descripcion: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    cantidad: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    fecha: new FormControl(new Date(), [Validators.required]),
    tipo: new FormControl<MovementType>('gasto', [Validators.required]),
  });

  limpiar() {
    this.form.reset();
    this.form.controls.tipo.setValue('gasto');
    this.form.controls.fecha.setValue(new Date());
  }

  guardarMovimiento() {
    console.log(this.form.getRawValue());
    let aux = this.form.getRawValue();
    let movimiento: CreateMovement = {
      descripcion: aux.descripcion!,
      cantidad: aux.cantidad!,
      fecha: dayjs(aux.fecha).format('YYYY-MM-DD'),
      tipo: aux.tipo!,
    };


    if (this.editingId !== null) {
  this.movementsService.updateMovement(this.editingId, movimiento);
   this.snackBar.open('Movimiento actualizado correctamente', 'Cerrar', {
    duration: 3000,
  });
} else {
  this.movementsService.addMovement(movimiento);
    this.snackBar.open('Movimiento creado correctamente', 'Cerrar', {
    duration: 3000,
  });
}

this.router.navigate(['/movements']);


  }
  ngOnInit(): void {
    if (this.editingId === null) {
      return;
    }

    const movement = this.movementsService.getMovementById(this.editingId);

    if (!movement) {
      this.router.navigate(['/movements']);
      return;
    }

    this.form.patchValue({
      descripcion: movement.descripcion,
      cantidad: movement.cantidad,
      fecha: dayjs(movement.fecha).toDate(),
      tipo: movement.tipo,
    });

  }
}
