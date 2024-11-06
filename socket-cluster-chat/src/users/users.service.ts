import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { access } from 'fs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async crateUser(body: CreateUserDto) {
    try {
      // create Ueser in DB
      console.log('Hit ');
      await this.usersRepository.save(body);

      return { message: 'Ho gya' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async loginUser(body: LoginUserDto) {
    try {
      console.log('Hit', process.env.JWT_SECRET);
      // check availability of user in DB
      const userObj = await this.usersRepository.findOne({
        where: { username: body.username },
      });
      if (!userObj) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (userObj.password !== body.password) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const pyaload = {
        preferred_username: userObj.username,
      };
      //  create JWT Token

      const token = await this.jwtService.signAsync(pyaload);
      return {
        message: 'Success',
        data: { access_token: token },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
