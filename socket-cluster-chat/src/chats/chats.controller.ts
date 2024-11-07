import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserGuard } from 'src/users/users.guard';
import { GetUser } from 'utils/get-user-decoder';
import { UserPayload } from 'utils/types';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(UserGuard)
  @Post('create-group')
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @GetUser() user: UserPayload,
  ) {
    return this.chatsService.createGroup(createGroupDto, user);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(UserGuard)
  @Get('get-groups')
  async getGroups(@GetUser() user: UserPayload) {
    return this.chatsService.getGroups(user);
  }

  @Get('messages')
  async getMessages() {
    console.log('Hiting ');
    return this.chatsService.getMessages();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(UserGuard)
  @Get('delete-group/:id')
  async deleteGroup(@Param('id') id: string, @GetUser() user: UserPayload) {
    return this.chatsService.deleteGroup(id, user);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(UserGuard)
  @Get('add-member/:id/:username')
  async addMember(
    @GetUser() user: UserPayload,
    @Param('id') id: string,
    @Param('username') username: string,
  ) {
    return this.chatsService.addMember(id, username, user);
  }

  @Get('get-group-info/:id')
  async getGroupInfo(@Param('id') id: string) {
    return this.chatsService.getGroupInfo(id);
  }
}
