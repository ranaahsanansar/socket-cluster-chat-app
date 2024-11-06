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

@Injectable()
export class ChatsService implements OnModuleInit {
  app: INestApplication;
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
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
      const userId = socket.id;
      this.logger.log(`User ${userId} connected.`);

      // Yaha py ham authentication apply kr skty hain

      this.handleDisconnection(socket, userId);

      this.handleSendMessage(socket, agServer);
      this.handleTypingEvent(socket, agServer);
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

  async createGroup(body: CreateGroupDto) {
    try {
      // crate group in DB

      const newGroup = new GroupEntity();
      newGroup.groupName = body.name;
      newGroup.created_by = 'ahsan_dev';
      await this.groupRepository.save(newGroup);

      return { message: 'Group Created' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getGroups() {
    try {
      const groups = await this.groupRepository.find();
      const result = [];
      groups.forEach((element) => {
        result.push({ name: element.groupName, created_by: 'ahsan_dev' });
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
          content: element.text,
          timestamp: element.timestamp,
          status: 'sent',
        });
      });
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
