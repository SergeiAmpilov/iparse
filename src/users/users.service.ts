import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { IUsersService } from "./users.service.interface";
import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { TYPES } from "../types";
import { IUsersRepository } from "./users.repository.interface";
import { UsersModel } from "./users.model";

@injectable()
export class UserService implements IUsersService {

  constructor(
    @inject(TYPES.IConfigService) private readonly configService: IConfigService,
    @inject(TYPES.IUsersRepository) private readonly usersRepository: IUsersRepository,
  ) {}
  
  async createUser({ name, email, password}: UserRegisterDto):  Promise<User | null> {
    const salt = Number(this.configService.get<string>('SALT'));
    const newUser = new User(email, name);
    await newUser.setPassword(password, salt);

    const existedUser = await this.usersRepository.find( email );
    
    if (existedUser !== null) {
      return null;
    }

    return await this.usersRepository.create(newUser);  

  };

  async validateUser({ email, password }: UserLoginDto): Promise<boolean> {

    const existedUser = await this.usersRepository.find(email);

    if (existedUser === null) {
      return false;
    }

    const newUser = new User(existedUser.email, existedUser.name);
    return newUser.checkPassword(password, existedUser.password);
  };


  async getUserInfo(email: string): Promise<User | null> {
    const userFound = await UsersModel.findOne({ email }).exec();
    if (userFound) {

      return new User(userFound.email, userFound.name);

    }

    return null;


  }

}