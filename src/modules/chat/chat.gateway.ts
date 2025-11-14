import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '@/modules/users/entities';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*', // 在生产环境中应更严格地设置
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    // 从客户端握手查询参数中获取用户ID（假设认证后已附加）
    const userId = client.handshake.query.userId as string;
    if (userId) {
      // 用户加入以其自身ID命名的房间，用于接收私聊消息
      client.join(userId);
      console.log(`用户 ${userId} 已连接, Socket ID: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`客户端断开连接: ${client.id}`);
  }

  @SubscribeMessage('chatData')
  async getAllData(@ConnectedSocket() client: Socket,  @MessageBody() user: User) {
    // client.emit('chatData');
  }
}
