// 生成Redis Key 通过用户ID
export const generateRedisKeyByUserId = (userId: string) => {
  return `auth:token:${userId}`;
};
