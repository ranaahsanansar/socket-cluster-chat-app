import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ default: 'test' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ default: 'test@gmail.com' })
  email: string;

  @ApiProperty({ default: '12345' })
  password: string;

  @ApiProperty({ default: '12345' })
  confirm_password: string;
}
