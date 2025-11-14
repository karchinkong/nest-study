import { BaseException, ExceptionInfo } from './base.exception';
import { UserExceptionCode, UserExceptionMap } from './modules/user.exception';
import { AuthExceptionCode, AuthExceptionMap } from './modules/auth.exception';
import { FriendShipsExceptionCode, FriendShipsExceptionMap } from './modules/friendships.exception';

/**
 * 错误码
 * 命名规则：MMSNN 模块代码 + 状态码类别 + 序列号
 * @example INVALID_CREDENTIALS (401): Auth(10) + 4xx(4) + 01 => '10401'
 */
export const ErrorExceptionCode = {
  ...UserExceptionCode,
  ...AuthExceptionCode,
  ...FriendShipsExceptionCode,
} as const;

export type ErrorExceptionCode =
  (typeof ErrorExceptionCode)[keyof typeof ErrorExceptionCode];

export const ErrorExceptionMap: Record<ErrorExceptionCode, ExceptionInfo> = {
  ...UserExceptionMap,
  ...AuthExceptionMap,
  ...FriendShipsExceptionMap,
};

export class ErrorException extends BaseException {
  constructor(errorCode: ErrorExceptionCode) {
    const exception = ErrorExceptionMap[errorCode];
    super(exception);
  }
}
