import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class Alarm {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    comment: "시간",
    type: "time",
  })
  time!: Date;

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
