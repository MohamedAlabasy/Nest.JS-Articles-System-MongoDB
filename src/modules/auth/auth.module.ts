import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from '../../strategies/local.strategy';
import { JwtStrategy } from '../../strategies/jwt.strategy';
// import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ACCESS_TOKEN_SECRET } from '../../config/token.config';
import { User, UserSchema } from '../users/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: ACCESS_TOKEN_SECRET,
      // signOptions: { expiresIn: '60s' },
      signOptions: { expiresIn: '3d' },
    }),
  ],
  providers: [AuthService, UsersService, LocalStrategy],
  controllers: [AuthController],
  // exports: [AuthService],
})
export class AuthModule { }