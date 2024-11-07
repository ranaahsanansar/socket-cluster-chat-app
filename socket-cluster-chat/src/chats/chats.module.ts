import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/messages.schema';
import { Room, RoomSchema } from './schemas/rooms.schema';
import { GroupMembersEntity } from './entities/group-members.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEntity, GroupMembersEntity, User]),
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Room.name, schema: RoomSchema },
    ]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
