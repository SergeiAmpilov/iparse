import { User } from "./user.entity";
import { UsersModel } from "./users.model";

export interface IUsersRepository {
  create: (user: User) => any;
  find: (email: string) => any;
}