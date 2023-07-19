// src/csv/csv-planificado.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'csvplanificado',
})
export class CsvPlanificado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  Fecha: string;

  @Column({ type: 'text' })
  Rajo: string;

  @Column({ type: 'text' })
  Mineral: string;

  @Column({ type: 'text' })
  Lastre: string;

  @Column({ type: 'text' })
  Extraccion: string;

  @Column({ type: 'text' })
  Remanejo: string;

  @Column({ type: 'text' }) 
  TotalM: string;

  @Column({ type: 'text' })
  MineralC: string;
}
