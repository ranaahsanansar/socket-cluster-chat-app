import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  email: string;

  password: string;

  confirm_password: string;
}
