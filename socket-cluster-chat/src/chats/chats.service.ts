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
import { JwtService } from '@nestjs/jwt';
import {
  GroupInfoResponse,
  MessageSocketResponse,
  UserPayload,
} from 'utils/types';
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
    private jwtService: JwtService,
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

      this.handleLogin(socket, agServer);
      this.handleDisconnection(socket, userId);
      this.handleJoinRoom(socket, agServer);
      this.handleLeftRoom(socket);
      this.handleSendMessage(socket, agServer);
      this.handleTypingEvent(socket, agServer);
    }
  }

  private async handleLogin(socket: AGServerSocket, agServer: AGServer) {
    for await (let req of socket.procedure('login')) {
      try {
        const { token } = req.data;

        if (!token) {
          socket.disconnect(401, 'You Can Not Login Without Token');
          return;
        }

        socket.setAuthToken({ data: { token: token } });
        req.end('User Login Successful');
      } catch (error) {
        req.end(error.message);
      }
    }
  }

  private async handleJoinRoom(socket: AGServerSocket, agServer: AGServer) {
    for await (const data of socket.listener('subscribe')) {
      try {
        // Check User can Join this Channel Or not
        // socket.disconnect();

        console.log('User Subscribe: ', data);

        if (!socket.authToken?.data?.token) {
          socket.disconnect();
          continue;
        }

        // decode token
        const user = await this.jwtService.verifyAsync(
          socket.authToken.data.token,
          {
            secret: process.env.JWT_SECRET,
          },
        );

        if (!user.preferred_username) {
          socket.disconnect();
          continue;
        }

        const userDetails = await this.userRepository.findOne({
          where: { username: user.preferred_username },
        });

        if (data.channel === `${userDetails.username}-notification`) {
          continue;
        }

        //  check user is member of the group on not
        const groupDetails: GroupEntity[] = await this.groupMembersRepository
          .query(`SELECT * FROM public.group_members
WHERE user_id = '${userDetails.id}' AND group_id = '${data.channel}'`);

        if (groupDetails.length === 0) {
          socket.disconnect();
          continue;
        }
      } catch (error) {
        this.logger.error(error.message);
      }
    }
  }

  private async handleLeftRoom(socket: AGServerSocket) {
    for await (const data of socket.listener('unsubscribe')) {
      this.logger.log(`User unsubscribe.`, data);
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
        const { content, token, roomId } = req.data;
        console.log('Content and Token ', content, token);

        if (!token) {
          continue;
        }

        // decode token and get user details
        const user = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
        if (!user) {
          continue;
        }
        console.log('Yah User ha', user);

        const messageData: MessageSocketResponse = {
          content: content,
          roomId,
          username: user.preferred_username,
        };
        await agServer.exchange.invokePublish(roomId, messageData);

        const room = await this.roomModel.findOne({ roomId: roomId });
        const message = new this.messageModel({
          senderName: user.preferred_username,
          content: content,
          room: roomId,
          timestamp: new Date(),
        });

        room.messages.push(message);
        room.save();
        message.save();

        req.end('Message received, saved, and delivered');
        this.sendNotificationToAll(agServer, roomId, user.preferred_username);
      } catch (error) {
        this.logger.error('Error processing message:', error);
        req.error(error);
      }
    }
  }

  private async handleTypingEvent(socket: AGServerSocket, agServer: AGServer) {
    for await (let data of socket.receiver('typing')) {
      this.logger.log('Typing event received:', data);
      // agServer.exchange.transmitPublish('typing', data);
    }
  }

  async sendNotificationToAll(
    agServer: AGServer,
    channelId: string,
    userName: string,
  ) {
    try {
      const rooms = await this.groupMembersRepository.find({
        where: { groupId: { id: Number(channelId) } as GroupEntity },
        select: ['user'],
        relations: ['user', 'groupId'],
      });

      rooms.forEach((element) => {
        if (userName === element.user.username) return;

        let channel = element.user.username + '-notification';
        console.log('Notification Channel', channel);
        agServer.exchange.transmitPublish(channel, {
          message: `New message in ${element.groupId.groupName}`,
        });
      });
    } catch (error) {
      console.log('Error in sending notification', error);
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

      // add user as a member

      const userDetails = await this.userRepository.findOne({
        where: { username: user.preferred_username },
      });

      const groupMember = new GroupMembersEntity();
      groupMember.groupId = { id: newGroup.id } as GroupEntity;
      groupMember.user = userDetails;
      await this.groupMembersRepository.save(groupMember);

      return { message: 'Group Created' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getGroups(user: UserPayload) {
    try {
      const getUserDetails = await this.userRepository.findOne({
        where: { username: user.preferred_username },
      });

      const groups = await this.groupRepository
        .query(`SELECT DISTINCT ON (gs.id) gs.* , public.group_members.* , CASE WHEN gs.created_by = '${user.preferred_username}' THEN true ELSE false END AS is_delete_able
FROM public.group_members
LEFT JOIN public.groups AS gs
ON gs.id = public.group_members.group_id
WHERE public.group_members.user_id = '${getUserDetails.id}'`);

      const result = [];
      groups.forEach((element) => {
        result.push({
          name: element.group_name,
          group_id: element.group_id,
          is_delete_able: true,
        });
      });

      console.log('Result : ', result);

      return { message: 'Group Fetched', data: { groups: result } };
    } catch (error) {
      console.log(error);
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
