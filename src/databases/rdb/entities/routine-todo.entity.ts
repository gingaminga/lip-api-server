import User from "@/databases/rdb/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class RoutineTodo {
  @PrimaryGeneratedColumn()
  id!: number;

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

  @ManyToOne(() => User, (user) => user.todos, {
    onDelete: "CASCADE",
  })
  user!: User;
}
