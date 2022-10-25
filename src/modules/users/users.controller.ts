import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { EmailVerification } from '../email-verification/schema/email-verification.schema';

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
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(ValidationPipe)
    async createNewUser(@Body(RegisterPipe) _userData: CreateUsersDto) {
        let userData: User;

        userData = await this.usersService.getUserByEmail(_userData.email)
        if (userData) throw new HttpException('this email already used', HttpStatus.CONFLICT)

        userData = await this.usersService.createNewUser(_userData)
        // use create then wanna send email code
        if (userData) {
            // auto generate code = 6 numbers
            const registerCode = REGISTER_CODE
            const storeEmailCode = await this.emailVerificationService.createNewEmailVerification(registerCode, EXPIRE_CODE_TIME, userData._id)

            if (storeEmailCode) emailVerification(_userData, registerCode);
            else throw new HttpException('can\'t send email code to this email', HttpStatus.BAD_REQUEST)
        }

        // to remove password from object before retune data to user 
        delete userData.password
        return {
            message: `The code has been sent to your email = ${_userData.email}`,
            data: {
                _id: userData._id,
                name: userData.name,
                email: userData.email,
                is_verification: userData.is_verification,
            }
            // data: userData
        }
    }

    // #=======================================================================================#
    // #			                        activate email                                     #
    // #=======================================================================================#
    @Post('activate')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(ValidationPipe)
    async activateEmail(@Body() _emailActivateData: CreateEmailActivateDto) {

        if (_emailActivateData.code.toString().length !== 6) {
            throw new HttpException('the code must be 6 number', HttpStatus.BAD_REQUEST)
        }

        let data: any;
        data = await this.emailVerificationService.checkCode(_emailActivateData)

        if (!data) {
            throw new HttpException(`Not send code to user with id = ${_emailActivateData.user}`, HttpStatus.BAD_REQUEST)
        } else if (_emailActivateData.code != data.code) {
            throw new HttpException('invalid code', HttpStatus.BAD_REQUEST);
        } else if (new Date() >= data.expire_at) {
            // If the code exceeds a certain time and it has not been used in this application for 24 hours
            throw new HttpException('This code has expired', HttpStatus.BAD_REQUEST);
        }

        // update user data is_verification = true
        data = await this.usersService.activateUserAccount(_emailActivateData.user)
        if (!data) throw new HttpException('can\'t activate this email', HttpStatus.BAD_REQUEST);

        return { message: 'email activation successfully' }
    }
    // #=======================================================================================#
    // #			                            login                                          #
    // #=======================================================================================#
    @Post('login')
    @UsePipes(ValidationPipe)
    @HttpCode(HttpStatus.OK)
    async login(@Body(EmailLowerCasePipe) _userData: LoginDto) {
        let userData: User;

        userData = await this.usersService.login(_userData);
        if (!userData) throw new HttpException(`there is no user with this email = ${_userData.email}`, HttpStatus.UNAUTHORIZED)


        const IsValidPassword: boolean = bcrypt.compareSync(_userData.password, userData.password);
        if (!IsValidPassword) throw new HttpException('invalid password', HttpStatus.UNAUTHORIZED)


        // to add token
        const token: string = 'Bearer ' + jwt.sign({ _id: userData._id, is_verification: userData.is_verification }, ACCESS_TOKEN_SECRET as string, {
            expiresIn: 86400 //for 24 hour
        });

        // to remove password from object before retune data to user 
        delete userData.password

        return {
            token,
            data: {
                _id: userData._id,
                name: userData.name,
                email: userData.email,
                is_verification: userData.is_verification,
            }
        }
    }
}
