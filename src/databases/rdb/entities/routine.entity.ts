import Alarm from "@/databases/rdb/entities/alarm.entity";
import User from "@/databases/rdb/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export default class Routine {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    comment: "요일",
    length: 7,
    type: "varchar",
  })
  days!: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    default: null,
    type: "timestamp",
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    default: null,
    type: "timestamp",
  })
  deletedAt!: Date;

  @ManyToOne(() => User, (user) => user.routines)
  user!: User;

  @OneToOne(() => Alarm)
  @JoinColumn()
  alarm!: Alarm;
}
