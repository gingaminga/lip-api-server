import Routine from "@/databases/rdb/entities/routine.entity";
import Todo from "@/databases/rdb/entities/todo.entity";
import { TSocialType } from "@/types/social";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    comment: "닉네임",
    length: 16,
    type: "varchar",
    unique: true,
  })
  nickname!: string;

  @Column({
    comment: "소셜 종류",
    length: 16,
    type: "varchar",
  })
  socialType!: TSocialType;

  @Column({
    comment: "소셜 unique id",
    length: 64,
    type: "varchar",
  })
  socialKey!: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    default: null,
    type: "timestamp",
  })
  updatedAt!: Date;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos!: Todo[];

  @OneToMany(() => Routine, (routine) => routine.user)
  routines!: Routine[];
}
