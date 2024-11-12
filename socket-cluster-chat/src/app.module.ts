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
      port: 23781,
      username: 'postgres',
      password: 'postgres',
      database: 'chat',
      entities: [User, GroupEntity, GroupMembersEntity],
      synchronize: true,
    }),
    MongooseModule.forRoot('mongodb://root:admin123@localhost:23780'),
    UsersModule,
    ChatsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
