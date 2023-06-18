import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Routine from "./routine.entity";

@Entity()
export default class RoutineTodo {
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
    comment: "할 일 날짜",
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

  @OneToOne(() => Routine)
  @JoinColumn()
  routine!: Routine;
}
