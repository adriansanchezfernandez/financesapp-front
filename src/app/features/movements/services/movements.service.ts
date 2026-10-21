import { Injectable, signal } from "@angular/core";
import { CreateMovement, Movement } from "../pages/models/movement.model";

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  private readonly _movements = signal<Movement[]>([]);

  readonly movements = this._movements.asReadonly();

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
}