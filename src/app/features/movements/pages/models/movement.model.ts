export type MovementType = 'ingreso' | 'gasto';

export interface Movement {
  id: number;
  descripcion: string;
  cantidad: number;
  fecha: string;
  tipo: MovementType;
}
export type CreateMovement = Omit<Movement, 'id'>;