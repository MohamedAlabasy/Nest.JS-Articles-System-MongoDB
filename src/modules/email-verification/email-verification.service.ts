import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailVerification } from './schema/email-verification.schema';
import { CreateEmailActivateDto } from './dto/create-email-activate.dto';

@Injectable()
export class EmailVerificationService {

    constructor(@InjectModel(EmailVerification.name) private emailVerificationModel: Model<EmailVerification>) { }

    // #=======================================================================================#
    // #			                   create new email verification                           #
    // #=======================================================================================#
    async createNewEmailVerification(code, expire_at, user): Promise<EmailVerification> {
        return this.emailVerificationModel.create({
            _id: (Math.random() * 1000).toString(),
            code,
            created_at: new Date(Date.now()),
            expire_at: new Date(Date.now() + expire_at),
            user
        });
    }

    // #=======================================================================================#
    // #			                        check code                                         #
    // #=======================================================================================#
    async checkCode(_emailActivateData: CreateEmailActivateDto): Promise<EmailVerification> {

        // this.data = await this.emailVerificationRepository.find({relations:['user'],where:{ user: _emailActivateData.user} })
        // return await this.emailVerificationModel.query(`select * from email_verification where code = ${_emailActivateData.code} and userId = ${_emailActivateData.user}`)
        return await this.emailVerificationModel.findOne({
            code: _emailActivateData.code,
            user: _emailActivateData.user
        })
    }
}