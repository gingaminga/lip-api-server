import Alarm from "@/databases/rdb/entities/alarm.entity";
import RoutineTodo from "@/databases/rdb/entities/routine-todo.entity";
import User from "@/databases/rdb/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export default class Routine {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    comment: "내용",
    length: 100,
    type: "varchar",
  })
  content!: string;

  @Column({
    comment: "월요일",
    type: "boolean",
  })
  monday!: boolean;

  @Column({
    comment: "화요일",
    type: "boolean",
  })
  tuesday!: boolean;

  @Column({
    comment: "수요일",
    type: "boolean",
  })
  wednesday!: boolean;

  @Column({
    comment: "목요일",
    type: "boolean",
  })
  thursday!: boolean;

  @Column({
    comment: "금요일",
    type: "boolean",
  })
  friday!: boolean;

  @Column({
    comment: "토요일",
    type: "boolean",
  })
  saturday!: boolean;

  @Column({
    comment: "일요일",
    type: "boolean",
  })
  sunday!: boolean;

  @Column({
    comment: "테마 색상",
    length: 20,
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

  @DeleteDateColumn({
    default: null,
    type: "timestamp",
  })
  deletedAt!: Date;

  @OneToMany(() => RoutineTodo, (routineToDo) => routineToDo.routine)
  routineTodos!: RoutineTodo[];

  @ManyToOne(() => User, (user) => user.routines, {
    onDelete: "CASCADE",
  })
  user!: User;

  @ManyToOne(() => Alarm, (alarm) => alarm.routines)
  alarm!: Alarm;
}
