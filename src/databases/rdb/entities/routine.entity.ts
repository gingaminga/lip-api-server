import Alarm from "@/databases/rdb/entities/alarm.entity";
import User from "@/databases/rdb/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class Routine {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    comment: "내용",
    length: 100,
    type: "varchar",
  })
  title!: string;

  @Column({
    comment: "요일",
    length: 7,
    type: "varchar",
  })
  days!: string;

  @Column({
    comment: "테마 색상",
    length: 10,
    type: "varchar",
  })
  color!: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    default: null,
    type: "timestamp",
  })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.routines)
  user!: User;

  @ManyToOne(() => Alarm, (alarm) => alarm.routines)
  alarm!: Alarm;
}
