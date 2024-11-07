import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { ChatsModule } from './chats/chats.module';
import { GroupEntity } from './chats/entities/group.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupMembersEntity } from './chats/entities/group-members.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 23797,
      username: 'postgres',
      password: 'postgres',
      database: 'chat',
      entities: [User, GroupEntity, GroupMembersEntity],
      synchronize: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/socket-cluster'),
    UsersModule,
    ChatsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
