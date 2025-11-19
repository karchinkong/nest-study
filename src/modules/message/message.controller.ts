import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { User } from '@/modules/users/entities';
import { MessageService } from '@/modules/message/message.service';
import { SendMsgDto } from '@/modules/message/dto/send-msg.dto';
import { ApiOperation } from '@nestjs/swagger';

/**
 * 消息控制器
 * 处理用户消息发送和会话管理相关的HTTP请求
 */
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: '发送消息' })
  @Post('send')
  sendMessage(@GetUser() user: User, @Body() sendMsgDto: SendMsgDto) {
    return this.messageService.sendMessage(user.id, sendMsgDto);
  }

  @ApiOperation({ summary: '获取用户的所有会话' })
  @Get('conversations')
  getUserConversations(@GetUser() user: User) {
    return this.messageService.getUserMessages(user.id);
  }

  @ApiOperation({ summary: '获取指定会话的消息列表' })
  @Get('conversations/:conversationId')
  getUserConversationById(@Param('conversationId') conversationId: string) {
    return this.messageService.getConversationMessages(conversationId);
  }

  @ApiOperation({ summary: '删除会话' })
  @Delete('conversations/:conversationId')
  deleteConversation(
    @GetUser() user: User,
    @Param('conversationId') conversationId: string,
  ) {
    return this.messageService.deleteConversation(user.id, conversationId);
  }
}
