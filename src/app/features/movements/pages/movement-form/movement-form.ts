import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material/material-module';
import dayjs from 'dayjs';
import { CreateMovement, Movement, MovementType } from '../models/movement.model';
import { MovementsService } from '../../services/movements.service';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
@Component({
  imports: [ReactiveFormsModule, MaterialModule],
  selector: 'app-movement-form',
  styleUrl: './movement-form.scss',
  templateUrl: './movement-form.html',
})
export class MovementForm {

  private readonly movementsService = inject(MovementsService);

  form = new FormGroup({
    descripcion: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    cantidad: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
    ]),
    fecha: new FormControl(new Date(), [Validators.required]),
    tipo: new FormControl<MovementType>('gasto', [Validators.required])
  });

  limpiar(){
    this.form.reset();
    this.form.controls.tipo.setValue('gasto');
    this.form.controls.fecha.setValue(new Date());
  }
guardarMovimiento(){
  console.log(this.form.getRawValue())
  let aux = this.form.getRawValue();
  let movimiento: CreateMovement = {
       descripcion: aux.descripcion!,
    cantidad: aux.cantidad!,
    fecha: dayjs(aux.fecha).format('YYYY-MM-DD'),
    tipo: aux.tipo!,
  }

  this.movementsService.addMovement(movimiento);
this.limpiar();
}

}
