import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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
            _id: uuidv4(),
            code,
            created_at: new Date(Date.now()),
            expire_at: new Date(Date.now() + expire_at),
            user
        });
    }

    // #=======================================================================================#
    // #			                        check code                                         #
    // #=======================================================================================#
    async checkCode(emailActivateData: CreateEmailActivateDto): Promise<EmailVerification> {
        return await this.emailVerificationModel.findOne({
            code: emailActivateData.code,
            user: emailActivateData.user
        })
    }
}