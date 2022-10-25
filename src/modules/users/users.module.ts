import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification } from 'src/database/entities/email-verification.entity';
import { Users } from 'src/database/entities/users.entity';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, EmailVerification])],
  exports: [TypeOrmModule],

  controllers: [UsersController],
  providers: [UsersService,EmailVerificationService]
})
export class UsersModule { }
