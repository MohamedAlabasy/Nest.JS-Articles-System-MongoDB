import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { ForgotPassword } from './schema/forgot-password.entity';
@Injectable()
export class ForgotPasswordService {
    constructor(@InjectModel(ForgotPassword.name) private forgotPasswordModel: Model<ForgotPassword>) { }
    // #=======================================================================================#
    // #                          send User email code to rest password                        #
    // #=======================================================================================#
    async sendEmailCodeToRestPassword(code, expire_at, user): Promise<ForgotPassword> {
        return this.forgotPasswordModel.create({
            _id: uuidv4(),
            code,
            created_at: new Date(Date.now()),
            expire_at: new Date(Date.now() + expire_at),
            user
        })
    }

    // #=======================================================================================#
    // #			                        check code                                         #
    // #=======================================================================================#
    async checkCode(code: number, user: number): Promise<ForgotPassword> {
        return await this.forgotPasswordModel.findOne({ code, user })
    }
}
