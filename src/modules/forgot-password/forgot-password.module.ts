import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForgotPassword } from 'src/database/entities/forgot-password.entity';
import { Users } from 'src/database/entities/users.entity';
import { UsersService } from '../users/users.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';

@Module({
  imports: [TypeOrmModule.forFeature([ForgotPassword, Users])],
  exports: [TypeOrmModule],
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordService, UsersService]
})
export class ForgotPasswordModule { }
