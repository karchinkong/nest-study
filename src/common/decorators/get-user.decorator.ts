import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found in request. Make sure AuthGuard is applied.');
    }

    // 支持嵌套属性访问，例如 @GetUser('profile.avatar')
    if (data) {
      const properties = data.split('.');
      let result = user;

      for (const prop of properties) {
        if (result && typeof result === 'object' && prop in result) {
          result = result[prop];
        } else {
          return undefined;
        }
      }

      return result;
    }

    return user;
  },
);