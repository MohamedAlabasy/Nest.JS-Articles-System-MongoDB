import { Body, Controller, Get, HttpException, HttpStatus, Param, Headers, ParseIntPipe, Post, UsePipes, ValidationPipe, PipeTransform, HttpCode } from '@nestjs/common';
import { emailVerification } from '../../utilities/email/emailVerification'
import { REGISTER_CODE, EXPIRE_CODE_TIME } from '../../utilities/common'
import { CheckEmailDto } from './dto/check-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from '../users/users.service';
import { ForgotPasswordService } from './forgot-password.service';
import { EmailLowerCasePipe } from 'src/pipes/email-lower-case.pipe';
import { HashPasswordPipe } from 'src/pipes/hash-password.pipe';

@Controller('forgotPassword')
export class ForgotPasswordController {
    constructor(
        private readonly forgotPasswordService: ForgotPasswordService,
        private readonly usersService: UsersService) { }
    // #=======================================================================================#
    // #                          send User email code to rest password                        #
    // #=======================================================================================#
    @Post('checkEmail')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(ValidationPipe)
    async sendEmailCodeToRestPassword(@Body(EmailLowerCasePipe) _emailData: CheckEmailDto) {
        let data: any;
        data = await this.usersService.getUserByEmail(_emailData.email)
        if (!data) throw new HttpException(`Not user with this email = ${_emailData.email}`, HttpStatus.NOT_FOUND)

        const registerCode = REGISTER_CODE;
        data = await this.forgotPasswordService.sendEmailCodeToRestPassword(registerCode, EXPIRE_CODE_TIME, data._id)

        if (data) emailVerification({ email: _emailData.email, name: data.name }, registerCode, true);
        else throw new HttpException(`can't send email code to this email = ${_emailData.email}`, HttpStatus.BAD_REQUEST)

        return { message: `The code has been sent to your email = ${_emailData.email}` }

    }

    // #=======================================================================================#
    // #                                  reset User password                                  #
    // #=======================================================================================#
    @Post('resetPassword')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async resetUserPassword(@Body(HashPasswordPipe) _resetData: ResetPasswordDto) {
        let data: any;
        data = await this.usersService.getUserByEmail(_resetData.email)
        const userID = data.id;
        if (!data) throw new HttpException(`Not user with this email = ${_resetData.email}`, HttpStatus.NOT_FOUND)


        data = await this.forgotPasswordService.checkCode(_resetData.code, data._id)
        if (!data) {
            throw new HttpException(`No code send to user with this email = ${_resetData.email}`, HttpStatus.BAD_REQUEST)
        } else if (_resetData.code != data.code) {
            throw new HttpException('invalid code', HttpStatus.BAD_REQUEST);
        } else if (new Date() >= data.expire_at) {
            // If the code exceeds a certain time and it has not been used in this application for 24 hours
            throw new HttpException('This code has expired', HttpStatus.BAD_REQUEST);
        }

        data = await this.usersService.resetUserPassword(userID, _resetData.password)
        if (data.affected === 0) throw new HttpException('an error occurred while changing the password, please try again', HttpStatus.BAD_REQUEST);

        return { message: 'Password has been successfully restored' }
    }
}
