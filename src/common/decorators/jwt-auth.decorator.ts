import { SetMetadata, } from '@nestjs/common';

/**
 * 访问权限的元数据的key
 */
export const JWT_META_KEY = 'JWT_META_KEY' as const;

/**
 * jwt元数据
 */
export enum JwtMetaEnum {
  PUBLIC,
}

/**
 * 跳过jwt检查
 */
export const Public = () => SetMetadata(JWT_META_KEY, JwtMetaEnum.PUBLIC);
