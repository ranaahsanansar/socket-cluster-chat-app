import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ default: 'test' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ default: '12345' })
  @IsNotEmpty()
  password: string;
}
