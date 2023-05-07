import Routine from "@/databases/rdb/entities/routine.entity";
import Todo from "@/databases/rdb/entities/todo.entity";
import { TOAuthType } from "@/types/oauth";
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
    comment: "oauth 종류",
    length: 16,
    type: "varchar",
  })
  oauthType!: TOAuthType;

  @Column({
    comment: "oauth id",
    type: "int",
    unsigned: true,
  })
  oauthKey!: number;

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
