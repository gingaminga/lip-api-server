import Alarm from "@/databases/rdb/entities/alarm.entity";
import User from "@/databases/rdb/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export default class Todo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    comment: "할 일 내용",
    length: 100,
    type: "varchar",
  })
  content!: string;

  @Column({
    comment: "할 일 체크 여부",
    type: "boolean",
  })
  checked!: boolean;

  @Column({
    comment: "할 일 체크 여부",
    length: 8,
    type: "varchar",
  })
  date!: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    default: null,
    type: "timestamp",
  })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.todos, {
    onDelete: "CASCADE",
  })
  user!: User;

  @OneToOne(() => Alarm)
  @JoinColumn()
  alarm!: Alarm;
}
