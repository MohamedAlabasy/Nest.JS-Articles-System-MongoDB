import { Module } from '@nestjs/common';
import { User, UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose'
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailVerification, EmailVerificationSchema } from '../email-verification/schema/email-verification.schema';
import { CaslModule } from 'src/casl/casl.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: EmailVerification.name, schema: EmailVerificationSchema }]),
    // CaslModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, EmailVerificationService],
  exports: [UsersService],
})
export class UsersModule { }
