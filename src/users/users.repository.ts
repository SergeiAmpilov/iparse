import { inject, injectable } from "inversify";
import { User } from "./user.entity";
import { UsersModel } from "./users.model";
import { IUsersRepository } from "./users.repository.interface";


@injectable()
export class UsersRepositiry implements IUsersRepository {

  async create(user: User) {
    const newUser = await UsersModel.create({
      name: user.name,
      email: user.email,
      password: user.password
    });

    return newUser;
  };

  async find(email: string) {
    const userFound = await UsersModel.findOne({ email }).exec();
    console.log('userFound', userFound);
    return userFound;
  };

}