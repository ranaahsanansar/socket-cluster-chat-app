import {
  HttpException,
  HttpStatus,
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupEntity } from './entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as http from 'http';
import { AGServer, AGServerSocket } from 'socketcluster-server';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/messages.schema';
import { Model } from 'mongoose';
import { Room } from './schemas/rooms.schema';
import { GroupInfoResponse, UserPayload } from 'utils/types';
import { GroupMembersEntity } from './entities/group-members.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChatsService implements OnModuleInit {
  app: INestApplication;
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GroupMembersEntity)
    private readonly groupMembersRepository: Repository<GroupMembersEntity>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) {}

  private logger = new Logger(ChatsService.name);
  private agServer: AGServer;

  onModuleInit() {
    this.initializeSocketCluster();
  }

  async initializeSocketCluster() {
    const httpServer = this.app.getHttpServer();
    this.agServer = new AGServer({ httpServer });

    this.handleSocketConnection(this.agServer);
  }

  private async handleSocketConnection(agServer: AGServer) {
    for await (const { socket } of agServer.listener('connection')) {
      // socket.disconnect();
      const userId = socket.id;
      this.logger.log(`User ${userId} connected.`);

      // Yaha py ham authentication apply kr skty hain

      this.handleDisconnection(socket, userId);
      this.handleJoinRoom(socket, agServer);

      this.handleSendMessage(socket, agServer);
      this.handleTypingEvent(socket, agServer);
    }
  }

  private async handleJoinRoom(socket: AGServerSocket, agServer: AGServer) {
    for await (const data of socket.listener('subscribe')) {
      // Check User can Join this Channel Or not
      this.logger.log(`User subscribe.`, data);
    }
  }

  private async handleDisconnection(socket: AGServerSocket, userId: string) {
    for await (const _ of socket.listener('close')) {
      this.logger.log(`User ${userId} disconnected.`);
    }
  }

  private async handleSendMessage(socket: AGServerSocket, agServer: AGServer) {
    for await (let req of socket.procedure('sendMessage')) {
      try {
        this.logger.log('Message received:', req.data);
        const { email, name, content } = req.data;
        // const message = new Message({ email, name, content });
        // await message.save();

        const message = new this.messageModel({
          senderName: name,
          text: content,
          timestamp: new Date(),
        });

        message.save();

        agServer.exchange.transmitPublish('messageReceived', 'message');

        agServer.exchange.transmitPublish('messageDelivered', 'message');
        req.end('Message received, saved, and delivered');
      } catch (error) {
        this.logger.error('Error processing message:', error);
        req.error(error);
      }
    }
  }

  private async handleTypingEvent(socket: AGServerSocket, agServer: AGServer) {
    for await (let data of socket.receiver('typing')) {
      this.logger.log('Typing event received:', data);
      agServer.exchange.transmitPublish('typing', data);
    }
  }

  async createGroup(body: CreateGroupDto, user: UserPayload) {
    try {
      // crate group in DB

      const newGroup = new GroupEntity();
      newGroup.groupName = body.name;
      newGroup.created_by = user.preferred_username;
      await this.groupRepository.save(newGroup);

      // also create  room in MongoDB

      const room = new this.roomModel({ name: body.name, roomId: newGroup.id });
      await room.save();

      return { message: 'Group Created' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getGroups(user: UserPayload) {
    try {
      const groups = await this.groupRepository.find({
        where: { created_by: user.preferred_username },
      });
      const result = [];
      groups.forEach((element) => {
        result.push({
          name: element.groupName,
          group_id: element.id,
          is_delete_able: true,
        });
      });
      return { message: 'Group Fetched', data: { groups: result } };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMessages() {
    try {
      const messages = await this.messageModel.find();
      const result = [];
      messages.forEach((element) => {
        result.push({
          email: element.senderName,
          name: element.senderName,
          content: element.content,
          timestamp: element.timestamp,
          status: 'sent',
        });
      });
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteGroup(id: string, user: UserPayload) {
    try {
      //  delete form postgres db
      const group = await this.groupRepository.findOne({
        where: { id: Number(id) },
      });

      if (group.created_by !== user.preferred_username) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      await this.groupRepository.delete({ id: Number(id) } as GroupEntity);

      // delete form mongo db
      await this.roomModel.deleteMany({ roomId: group.id });

      return { message: 'Group Deleted' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addMember(id: string, username: string, user: UserPayload) {
    try {
      // check user is creator or not

      const group = await this.groupRepository.findOne({
        where: { id: Number(id) },
      });

      if (group === undefined) {
        throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
      }

      if (group.created_by !== user.preferred_username) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      // add user in room

      const userDetails = await this.userRepository.findOne({
        where: { username: username },
      });

      const groupMember = new GroupMembersEntity();
      groupMember.groupId = group;
      groupMember.user = userDetails;

      await this.groupMembersRepository.save(groupMember);

      return { message: 'Member Added' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getGroupInfo(id: string) {
    try {
      const result: GroupInfoResponse = {
        created_by: null,
        name: null,
      };

      const groupDetails = await this.groupRepository.findOne({
        where: { id: Number(id) },
      });

      result.created_by = groupDetails.created_by;
      result.name = groupDetails.groupName;

      return {
        data: {
          group: result,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
