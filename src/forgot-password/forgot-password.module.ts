import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { CaslModule } from 'src/casl/casl.module';
import { User, UserSchema } from '../users/schema/user.schema';
import { UsersService } from '../users/users.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPassword, ForgotPasswordSchema } from './schema/forgot-password.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ForgotPassword.name, schema: ForgotPasswordSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        // CaslModule
    ],
    controllers: [ForgotPasswordController],
    providers: [ForgotPasswordService, UsersService]
})
export class ForgotPasswordModule { }
