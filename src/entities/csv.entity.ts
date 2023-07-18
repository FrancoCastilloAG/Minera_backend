import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'csv',
})
export class Csv {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  Fecha: string;

  @Column({ type: 'text' })
  Carguio: string;

  @Column({ type: 'text' })
  Camión: string;

  @Column({ type: 'text' })
  Flota: string;

  @Column({ type: 'text' })
  Material: string;

  @Column({ type: 'text' })
  Origen: string;

  @Column({ type: 'text'}) 
  Zona: string;

  @Column({ type: 'text' })
  Destino: string;

  @Column({ type: 'numeric'})
  Tonelaje: number;

  @Column()
  Ciclos: number;

  @Column({ type: 'text' })
  Rajo: string;
}
