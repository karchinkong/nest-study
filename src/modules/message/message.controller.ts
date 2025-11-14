import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { User } from '@/modules/users/entities';
import { MessageService } from '@/modules/message/message.service';
import { SendMsgDto } from '@/modules/message/dto/send-msg.dto';

@Controller('message')
export class MessageController {

  constructor(private readonly messageService: MessageService) {
  }

  @Post('send')
  sendMessage(@GetUser() user: User,@Body() sendMsgDto: SendMsgDto) {
    return this.messageService.sendMessage(user.id, sendMsgDto);
  }

  @Get('conversations')
  getUserConversations(@GetUser() user: User) {
    return this.messageService.getUserMessages(user.id);
  }

  @Get('conversations/:conversationId')
  getUserConversationById(@Param('conversationId') conversationId: string) {
    return this.messageService.getConversationMessages(conversationId);
  }

  @Delete('conversations/:conversationId')
  deleteConversation(@GetUser() user: User, @Param('conversationId') conversationId: string) {
    return this.messageService.deleteConversation(user.id, conversationId);
  }

}
