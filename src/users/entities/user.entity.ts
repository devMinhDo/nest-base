import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({})
  address: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  age: number;
}
