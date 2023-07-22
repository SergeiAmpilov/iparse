import { hash, compare } from 'bcrypt';

export class User {

  private _password: string;
  
  constructor(
    private readonly _email: string,
    private readonly _name: string
  ) {  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  public async setPassword(pass: string, salt: number): Promise<void> {
    this._password = await hash(pass, salt);
  }

  get password(): string {
    return this._password;
  }

  public async checkPassword(pass: string, hash: string): Promise<boolean> {
    const resCompare = await compare(pass, hash);
    return resCompare;
  }
}