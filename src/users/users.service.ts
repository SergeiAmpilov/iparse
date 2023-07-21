import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { IUsersService } from "./users.service.interface";
import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { TYPES } from "../types";

@injectable()
export class UserService implements IUsersService {

  constructor(
    @inject(TYPES.IConfigService) private readonly configService: IConfigService,
  ) {}
  
  async createUser({ name, email, password}: UserRegisterDto):  Promise<User | null> {
    const salt = Number(this.configService.get<string>('SALT'));
    const newUser = new User(email, name);
    await newUser.setPassword(password, salt);

    return new User(name, email)
  };

  async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
    return true;
  };

}