import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerification } from 'src/database/entities/email-verification.entity';
import { Repository } from 'typeorm';
import { CreateEmailActivateDto } from './dto/create-email-activate.dto';

@Injectable()
export class EmailVerificationService {

    constructor(@InjectRepository(EmailVerification) private emailVerificationRepository: Repository<EmailVerification>) { }

    // #=======================================================================================#
    // #			                   create new email verification                           #
    // #=======================================================================================#
    async createNewEmailVerification(code, expire_at, user): Promise<EmailVerification> {
        const data = this.emailVerificationRepository.create({
            code,
            created_at: new Date(Date.now()),
            expire_at: new Date(Date.now() + expire_at),
            user
        });
        return await this.emailVerificationRepository.save(data);
    }

    // #=======================================================================================#
    // #			                        check code                                         #
    // #=======================================================================================#
    async checkCode(_emailActivateData: CreateEmailActivateDto): Promise<EmailVerification> {
        // this.data = await this.emailVerificationRepository.find({relations:['user'],where:{ user: _emailActivateData.user} })
        return await this.emailVerificationRepository.query(`select * from email_verification where code = ${_emailActivateData.code} and userId = ${_emailActivateData.user}`)
    }
}
