import { computed, Injectable, signal } from "@angular/core";
import { CreateMovement, MOCK_MOVEMENTS, Movement } from "../pages/models/movement.model";

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  private readonly _movements = signal<Movement[]>([...MOCK_MOVEMENTS]);

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

  addMovement(movement: CreateMovement): void {
    const newMovement: Movement = {
      ...movement,
      id: Date.now(),
    };

    this._movements.update(current => [
      ...current,
      newMovement,
    ]);

    console.log(this._movements());
  }

  deleteMovement(id: number): void {
  this._movements.update(movements =>
    movements.filter(movement => movement.id !== id)
  );

}

getMovementById(id: number): Movement | undefined {
  return this._movements().find(movement => movement.id === id);
}

updateMovement(id: number, changes: CreateMovement): void {
  this._movements.update(movements =>
    movements.map(movement =>
      movement.id === id
        ? { ...movement, ...changes }
        : movement
    )
  );
}

}