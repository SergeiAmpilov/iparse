import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { IUsersService } from "./users.service.interface";
import 'reflect-metadata';
import { inject, injectable } from "inversify";

@injectable()
export class UserService implements IUsersService {
  
  async createUser({ name, email, password}: UserRegisterDto):  Promise<User | null> {
    
    const newUser = new User(email, name);
    await newUser.setPassword(password);

    return new User(name, email)
  };

  async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
    return true;
  };

}