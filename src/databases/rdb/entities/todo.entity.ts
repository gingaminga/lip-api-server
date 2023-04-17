import Alarm from "@/databases/rdb/entities/alarm.entity";
import Routine from "@/databases/rdb/entities/routine.entity";
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
    type: "date",
  })
  date!: Date;

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

  @ManyToOne(() => User, (user) => user.todos)
  user!: User;

  @OneToOne(() => Routine)
  @JoinColumn()
  routine!: Routine;

  @OneToOne(() => Alarm)
  @JoinColumn()
  alarm!: Alarm;
}
