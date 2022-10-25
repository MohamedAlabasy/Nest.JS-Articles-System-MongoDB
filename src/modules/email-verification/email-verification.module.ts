import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification } from 'src/database/entities/email-verification.entity';
import { EmailVerificationService } from './email-verification.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerification])],
  exports: [TypeOrmModule],
  providers: [EmailVerificationService],

})
export class EmailVerificationModule { }
