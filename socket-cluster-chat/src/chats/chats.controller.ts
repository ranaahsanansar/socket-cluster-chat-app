import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post('create-group')
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.chatsService.createGroup(createGroupDto);
  }

  @Get('get-groups')
  async getGroups() {
    return this.chatsService.getGroups();
  }

  @Get('messages')
  async getMessages() {
    console.log('Hiting ');
    return this.chatsService.getMessages();
  }
}
