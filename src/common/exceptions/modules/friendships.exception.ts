import { HttpStatus } from '@nestjs/common';
import { ExceptionInfo } from '@/common/exceptions/base.exception';

/**
 * 验证模块 (12)
 */
export const FriendShipsExceptionCode = {
  EXIST: '12401',
  NOT_EXIST: '12402',
} as const;

export type FriendShipsExceptionCode =
  (typeof FriendShipsExceptionCode)[keyof typeof FriendShipsExceptionCode];

export const FriendShipsExceptionMap: Record<FriendShipsExceptionCode, ExceptionInfo> = {
  [FriendShipsExceptionCode.EXIST]: {
    message: '存在好友关系',
    status: HttpStatus.BAD_REQUEST,
    code: FriendShipsExceptionCode.EXIST,
  },
  [FriendShipsExceptionCode.NOT_EXIST]: {
    message: '数据不存在',
    status: HttpStatus.BAD_REQUEST,
    code: FriendShipsExceptionCode.NOT_EXIST,
  },
};
