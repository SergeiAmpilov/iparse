import { User } from "./user.entity";
import { UsersModel } from "./users.model";
import { IUsersRepository } from "./users.repository.interface";



export class UsersRepositiry implements IUsersRepository {

  async create(user: User) {
    const newUser = UsersModel.create(user);
    return newUser;
  };

  async find(email: string) {
    const userFound = UsersModel.findOne({ email }).exec();
    return userFound;
  };

}