import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MovementsService } from '../../services/movements.service';
import { MaterialModule } from '../../../../shared/material/material-module';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialog } from '../../components/delete-confirm-dialog/delete-confirm-dialog';
import { MovementType } from '../models/movement.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, EMPTY } from 'rxjs';
import dayjs from 'dayjs';

@Component({
  imports: [MaterialModule, RouterLink, DecimalPipe],
  selector: 'app-movements',
  styleUrl: './movements.scss',
  templateUrl: './movements.html',
})
export class Movements implements OnInit{

  private readonly movementsService = inject(MovementsService);
private readonly dialog = inject(MatDialog);
private readonly snackBar = inject(MatSnackBar);
  readonly movements = this.movementsService.movements;

  readonly totalIngresos = this.movementsService.totalIngresos;
readonly totalGastos = this.movementsService.totalGastos;
readonly saldo = this.movementsService.saldo;

readonly filtroDescripcion = signal('');
readonly filtroTipo = signal<'todos' | MovementType>('todos');
readonly selectedMonth = signal<string | null>(null);

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
  const month = this.selectedMonth();

  return this.movements().filter(movement => {
    const coincideDescripcion = movement.descripcion
      .toLowerCase()
      .includes(descripcion);

    const coincideTipo =
      tipo === 'todos' || movement.tipo === tipo;

    const coincideMes =
      !month || movement.fecha.startsWith(month);

    return coincideDescripcion && coincideTipo && coincideMes;
  });
});

readonly availableMonths = computed(() => {
  const months = new Set(
    this.movements().map(movement => movement.fecha.slice(0, 7))
  );

  return [...months]
    .sort((a, b) => b.localeCompare(a))
    .map(month => ({
      value: month,
      label: dayjs(`${month}-01`)
        .locale('es')
        .format('MMMM YYYY')
    }));
});

  ngOnInit(): void {
   this.movementsService.loadMovements();
  }


eliminarMovimiento(id: number): void {
  const dialogRef = this.dialog.open(DeleteConfirmDialog, {
    width: '400px',
  });

  dialogRef.afterClosed().subscribe(confirmado => {
this.movementsService.deleteMovement(id).pipe(
  catchError(error => {
    console.error('Error al eliminar movimiento:', error);

    this.snackBar.open('Error al eliminar el movimiento', 'Cerrar', {
      duration: 3000,
    });

    return EMPTY;
  })
).subscribe(() => {
  this.snackBar.open('Movimiento eliminado correctamente', 'Cerrar', {
    duration: 3000,
  });
});
  });
}

}
