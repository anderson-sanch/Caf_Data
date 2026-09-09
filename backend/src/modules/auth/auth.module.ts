import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';

const jwtSecret =
  process.env.JWT_SECRET ??
  (process.env.NODE_ENV === 'production'
    ? (() => {
        throw new Error('JWT_SECRET is required in production');
      })()
    : 'cafdata-development-secret-change-me');

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
