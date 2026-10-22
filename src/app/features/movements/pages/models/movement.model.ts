export type MovementType = 'ingreso' | 'gasto';

export interface Movement {
  id: number;
  descripcion: string;
  cantidad: number;
  fecha: string;
  tipo: MovementType;
}
export type CreateMovement = Omit<Movement, 'id'>;

export const MOCK_MOVEMENTS: Movement[] = [
  {
    id: 1,
    descripcion: 'Compra en Mercadona',
    cantidad: 48.75,
    fecha: '2026-10-20',
    tipo: 'gasto',
  },
  {
    id: 2,
    descripcion: 'Nómina octubre',
    cantidad: 1850,
    fecha: '2026-10-21',
    tipo: 'ingreso',
  },
];