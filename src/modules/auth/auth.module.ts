import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from '@/config/config.module';
import { getConfig } from '@/config';
import { AuthController } from './auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { UsersModule } from '@/modules/users/users.module';
import { RefreshTokenService } from '@/modules/auth/refresh-token.service';
import { JwtStrategy } from '@/modules/auth/strategies/jwt-auth.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: (configService: ConfigService) => {
        const { jwt } = getConfig(configService);
        return {
          secret: jwt.secret,
          signOptions: {
            expiresIn: `${jwt.expiresIn}s`,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, RefreshTokenService, JwtStrategy],
  exports: [RefreshTokenService],
})
export class AuthModule {}
