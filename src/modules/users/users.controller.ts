import { Body, Controller, HttpException, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { CreateUsersDto } from './dto/create-users.dto';
import { UsersService } from './users.service';
import { RegisterPipe } from '../../pipes/register.pipe';
import { LoginDto } from './dto/login.dto';
import { ACCESS_TOKEN_SECRET } from '../../config/token.config';
import { emailVerification } from '../../utilities/email/emailVerification';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { CreateEmailActivateDto } from '../email-verification/dto/create-email-activate.dto';
import { REGISTER_CODE, EXPIRE_CODE_TIME } from '../../utilities/common'
import { EmailLowerCasePipe } from 'src/pipes/email-lower-case.pipe';
import { User } from './schema/user.schema';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly emailVerificationService: EmailVerificationService
    ) { }

    // #=======================================================================================#
    // #			                            Register                                       #
    // #=======================================================================================#
    @Post('register')
    @UsePipes(ValidationPipe)
    async createNewUser(@Body(RegisterPipe) _userData: CreateUsersDto) {
        let data: User;
        data = await this.usersService.getUserByEmail(_userData.email)
        if (data) throw new Error('already exists')


        data = await this.usersService.createNewUser(_userData)
        // use create and wanna send email code
        if (data) {
            // auto generate code = 6 numbers
            const registerCode = REGISTER_CODE
            const storeEmailCode = await this.emailVerificationService.createNewEmailVerification(registerCode, EXPIRE_CODE_TIME, data._id)

            if (storeEmailCode)
                emailVerification(_userData, registerCode);
            else
                throw new Error(`can't send email code to this email = ${_userData.email}`)
        }

        // to remove password from object before retune data to user 
        delete data.password
        console.log(delete data.password);
        console.log(data);

        return {
            statusCode: 200,
            message: `The code has been sent to your email = ${_userData.email}`,
            // data: {
            //     _id: data._id,
            //     name: data.name,
            //     email: data.email,
            //     is_verification: data.is_verification,
            // }
            data
        }
    }

    // #=======================================================================================#
    // #			                        activate email                                     #
    // #=======================================================================================#
    @Post('activate')
    @UsePipes(ValidationPipe)
    async activateEmail(@Body() _emailActivateData: CreateEmailActivateDto) {
        try {

            if (_emailActivateData.code.toString().length !== 6) {
                throw new Error('the code must be 6 number')
            }
            let data: any;
            data = await this.emailVerificationService.checkCode(_emailActivateData)

            if (!data) {
                throw new Error(`Not send code to user with id = ${_emailActivateData.user}`)
            } else if (_emailActivateData.code != data[0].code) {
                throw new Error('invalid code');
            } else if (new Date() >= data[0].expire_at) {
                // If the code exceeds a certain time and it has not been used in this application for 24 hours
                throw new Error('This code has expired');
            }

            // update user data is_verification = true
            data = await this.usersService.activateUserAccount(_emailActivateData.user)

            if (!data) throw new Error('can\'t activate this email');

            return {
                statusCode: 200,
                message: 'email activation successfully'
            }
        } catch (error) {
            return new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }
    // #=======================================================================================#
    // #			                            login                                          #
    // #=======================================================================================#
    @Post('login')
    @UsePipes(ValidationPipe)
    async login(@Body(EmailLowerCasePipe) _userData: LoginDto) {
        try {
            let data: any;
            data = await this.usersService.login(_userData);


            if (!data) {
                throw new Error(`there is no user with this email = ${_userData.email}`)
            }

            const IsValidPassword: boolean = bcrypt.compareSync(_userData.password, data.password);
            if (!IsValidPassword) {
                throw new Error('invalid password')
            }

            // to add token
            const token: string = 'Bearer ' + jwt.sign({ id: data.id, is_verification: data.is_verification }, ACCESS_TOKEN_SECRET as string, {
                expiresIn: 86400 //for 24 hour
            });

            // to remove password from object before retune data to user 
            delete data.password

            return {
                statusCode: 200,
                token,
                data
            }
        } catch (error) {
            return new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }
}
