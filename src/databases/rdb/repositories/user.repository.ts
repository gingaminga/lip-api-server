import User from "@/databases/rdb/entities/user.entity";
import BaseRepository from "@/databases/rdb/repositories/base.repository";
import { Service } from "typedi";

@Service()
export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super();
    this.setTarget(User);
  }

  get queryBuilder() {
    return this.getQueryBuilder("user");
  }
}
