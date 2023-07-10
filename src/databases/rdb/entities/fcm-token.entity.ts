import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import User from "@/databases/rdb/entities/user.entity";

@Entity()
export default class FcmToken {
  @PrimaryColumn({
    comment: "기기 토큰",
    length: 200,
    type: "varchar",
  })
  deviceToken!: string;

  @Column({
    comment: "사용 횟수",
    default: 1,
    type: "int",
  })
  count!: number;

  @ManyToOne(() => User, (user) => user.routineTodos, {
    onDelete: "CASCADE",
  })
  user!: User;

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
