import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailVerification, EmailVerificationSchema } from './schema/email-verification.schema';
import { EmailVerificationService } from './email-verification.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: EmailVerification.name, schema: EmailVerificationSchema }])],
    providers: [EmailVerificationService],
})
export class EmailVerificationModule { }
