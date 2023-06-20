import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class Alarm {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    comment: "시",
    type: "int",
  })
  hour!: number;

  @Column({
    comment: "분",
    type: "int",
  })
  minute!: number;

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
