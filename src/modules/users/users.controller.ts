import { Body, Controller, HttpCode, HttpStatus, Headers, Post, UsePipes, ValidationPipe, ConflictException, BadRequestException, UnauthorizedException, BadGatewayException, Get, NotFoundException, ForbiddenException, UseGuards, Request } from '@nestjs/common';
// import * as bcrypt from 'bcryptjs';
// import * as jwt from 'jsonwebtoken';

import { CreateUsersDto } from './dto/create-users.dto';
import { UsersService } from './users.service';
import { RegisterPipe } from '../../pipes/register.pipe';
// import { ACCESS_TOKEN_SECRET } from '../../config/token.config';
import { emailVerification } from '../../utilities/email/emailVerification';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { CreateEmailActivateDto } from '../email-verification/dto/create-email-activate.dto';
import { REGISTER_CODE, EXPIRE_CODE_TIME } from '../../utilities/common'
// import { EmailLowerCasePipe } from 'src/pipes/email-lower-case.pipe';
// import { User } from './schema/user.schema';
import { GET_ID_FROM_TOKEN } from 'src/utilities/get-id-from-token';
// import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { PoliciesGuard } from 'src/policies-guard/policies.guard';
import { CheckPolicies } from 'src/policies-guard/check-policies.decorator';
import { ReadArticlePolicyHandler } from 'src/policies-guard/policy-handler/Policies/read-article-policy-handler';
// import { AuthService } from '../auth/auth.service';
// import { AuthGuard } from '@nestjs/passport';
// import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

// import { ForbiddenError } from '@casl/ability';
// import { HttpExceptionFilter } from './../../exception/http-exception.filter';

@Controller('users')
// @UseFilters(HttpExceptionFilter)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly emailVerificationService: EmailVerificationService,
        // private readonly authService: AuthService,
        // private readonly abilityFactory: AbilityFactory,
        // private readonly caslAbilityFactory: CaslAbilityFactory
    ) { }

    // #=======================================================================================#
    // #			                            Register                                       #
    // #=======================================================================================#
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(ValidationPipe)
    async createNewUser(@Body(RegisterPipe) _userData: CreateUsersDto) {
        let userData = await this.usersService.getUserByEmail(_userData.email)
        if (userData) throw new ConflictException('this email already used')

        userData = await this.usersService.createNewUser(_userData)
        // use create then wanna send email code
        if (userData) {
            // auto generate code = 6 numbers
            const registerCode = REGISTER_CODE
            const storeEmailCode = await this.emailVerificationService.createNewEmailVerification(registerCode, EXPIRE_CODE_TIME, userData._id)

            if (storeEmailCode) emailVerification(_userData, registerCode);
            else throw new BadGatewayException('can\'t send email code to this email')
        } else {
            throw new BadRequestException('can\'t create user, please try again')
        }
        userData = (userData as any).toObject();
        // to remove password from object before retune data to user 
        delete userData.password
        delete userData['__v']

        return {
            message: `The code has been sent to your email = ${userData.email}`,
            data: userData
        }
    }

    // #=======================================================================================#
    // #			                        activate email                                     #
    // #=======================================================================================#
    @Post('activate')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async activateEmail(@Body() _emailActivateData: CreateEmailActivateDto) {
        if (_emailActivateData.code.toString().length !== 6) {
            throw new BadRequestException('the code must be 6 number')
        }

        let data: any;
        data = await this.emailVerificationService.checkCode(_emailActivateData)

        if (!data) {
            throw new BadRequestException(`Not send code to user with id = ${_emailActivateData.user}`)
        } else if (_emailActivateData.code != data.code) {
            throw new BadRequestException('invalid code');
        } else if (new Date() >= data.expire_at) {
            // If the code exceeds a certain time and it has not been used in this application for 24 hours
            throw new BadRequestException('This code has expired');
        }

        // update user data is_verification = true
        data = await this.usersService.activateUserAccount(_emailActivateData.user)
        if (!data) throw new BadRequestException('can\'t activate this email');

        return { message: 'email activation successfully' }
    }
    // #=======================================================================================#
    // #                    get all Users => this end point for admin only                     #
    // #=======================================================================================#
    @UseGuards(JwtAuthGuard)
    @Get()
    @UseGuards(PoliciesGuard)
    @CheckPolicies(new ReadArticlePolicyHandler())
    @HttpCode(HttpStatus.OK)
    async getAllUsers(@Request() req) {
        let data: any;
        // const userID = GET_ID_FROM_TOKEN(_headers)
        console.log('getAllUsers', req.user);

        data = await this.usersService.getUserById(req.user._id)
        if (!data) throw new NotFoundException('user not found')

        // const ability = this.caslAbilityFactory.createForUser(data);
        // if (!ability.can(Action.Read, User)) { //send User to compare
        //     // "user" has read access to everything
        //     throw new ForbiddenException('you isn\'t an admin')
        // }

        data = await this.usersService.getAllUsers()
        if (data && data.length == 0) throw new NotFoundException('no users to show')

        return {
            count: data.length,
            data: data
        }
    }
}
