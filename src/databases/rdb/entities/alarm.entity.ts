import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class Alarm {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    comment: "시",
    length: 2,
    type: "varchar",
  })
  hour!: string;

  @Column({
    comment: "분",
    length: 2,
    type: "varchar",
  })
  minute!: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    default: null,
    type: "timestamp",
  })
  updatedAt!: Date;
}
