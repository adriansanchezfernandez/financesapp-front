import { Component, computed, inject, signal } from '@angular/core';
import { MovementsService } from '../../services/movements.service';
import { MaterialModule } from '../../../../shared/material/material-module';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialog } from '../../components/delete-confirm-dialog/delete-confirm-dialog';
import { MovementType } from '../models/movement.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  imports: [MaterialModule, RouterLink, DecimalPipe],
  selector: 'app-movements',
  styleUrl: './movements.scss',
  templateUrl: './movements.html',
})
export class Movements {
  private readonly movementsService = inject(MovementsService);
private readonly dialog = inject(MatDialog);
private readonly snackBar = inject(MatSnackBar);
  readonly movements = this.movementsService.movements;

  readonly totalIngresos = this.movementsService.totalIngresos;
readonly totalGastos = this.movementsService.totalGastos;
readonly saldo = this.movementsService.saldo;

readonly filtroDescripcion = signal('');
readonly filtroTipo = signal<'todos' | MovementType>('todos');

  readonly displayedColumns: string[] = [
  'fecha',
  'descripcion',
  'tipo',
  'cantidad',
  'acciones'
];

readonly movimientosFiltrados = computed(() => {
  const descripcion = this.filtroDescripcion().trim().toLowerCase();
  const tipo = this.filtroTipo();

  return this.movements().filter(movement => {
    const coincideDescripcion = movement.descripcion
      .toLowerCase()
      .includes(descripcion);

    const coincideTipo =
      tipo === 'todos' || movement.tipo === tipo;

    return coincideDescripcion && coincideTipo;
  });
});

eliminarMovimiento(id: number): void {
  const dialogRef = this.dialog.open(DeleteConfirmDialog, {
    width: '400px',
  });

  dialogRef.afterClosed().subscribe(confirmado => {
    if (confirmado === true) {
      this.movementsService.deleteMovement(id);
         this.snackBar.open('Movimiento eliminado correctamente', 'Cerrar', {
      duration: 3000,
    });
    }
  });
}

}
