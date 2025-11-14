import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { User } from '@/modules/users/entities';
import { JwtMetaEnum, JWT_META_KEY } from '@/common/decorators/jwt-auth.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwtMeta = this.reflector.get<JwtMetaEnum>(
      JWT_META_KEY,
      context.getHandler(),
    );

    if (jwtMeta === JwtMetaEnum.PUBLIC) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = User>(err: any, user: TUser) {
    if (err) {
      throw err || new UnauthorizedException('Token失效');
    }

    return user;
  }
}
