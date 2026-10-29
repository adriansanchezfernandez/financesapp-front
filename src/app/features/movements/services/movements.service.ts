import { computed, inject, Injectable, signal } from "@angular/core";
import { CreateMovement, MOCK_MOVEMENTS, Movement } from "../pages/models/movement.model";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  private readonly _movements = signal<Movement[]>([]);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/movements';
  readonly movements = this._movements.asReadonly();

  readonly totalIngresos = computed(() =>
  this._movements()
    .filter(movement => movement.tipo === 'ingreso')
    .reduce((total, movement) => total + movement.cantidad, 0)
);

readonly totalGastos = computed(() =>
  this._movements()
    .filter(movement => movement.tipo === 'gasto')
    .reduce((total, movement) => total + movement.cantidad, 0)
);

readonly saldo = computed(() =>
  this.totalIngresos() - this.totalGastos()
);

loadMovements(): void {
  this.http.get<Movement[]>(this.apiUrl).subscribe({
    next: (movements) => {
      this._movements.set(movements);
    },
    error: (error) => {
      console.error('Error al cargar movimientos:', error);
    }
  });
}

  addMovement(movement: CreateMovement): Observable<Movement> {
    return this.http.post<Movement>(this.apiUrl, movement).pipe(
    tap((newMovement) => {
      this._movements.update(current => [
        ...current,
        newMovement
      ]);
    })
  );
  }

deleteMovement(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
    tap(() => {
      this._movements.update(movements =>
        movements.filter(movement => movement.id !== id)
      );
    })
  );
}

getMovementById(id: number): Movement | undefined {
  return this._movements().find(movement => movement.id === id);
}

updateMovement(id: number, changes: CreateMovement): Observable<Movement> {
  return this.http.put<Movement>(`${this.apiUrl}/${id}`, changes).pipe(
    tap(updatedMovement => {
      this._movements.update(movements =>
        movements.map(movement =>
          movement.id === id ? updatedMovement : movement
        )
      );
    })
  );
}

}