import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe, ConflictException, BadRequestException, BadGatewayException, Get, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UsersService } from './users.service';
import { RegisterPipe } from '../../pipes/register.pipe';
import { emailVerification } from '../../utilities/email/emailVerification';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { CreateEmailActivateDto } from '../email-verification/dto/create-email-activate.dto';
import { REGISTER_CODE, EXPIRE_CODE_TIME } from '../../utilities/common'
// import { PoliciesGuard } from 'src/policies-guard/policies.guard';
// import { CheckPolicies } from 'src/policies-guard/check-policies.decorator';
// import { ReadArticlePolicyHandler } from 'src/policies-guard/policy-handler/Policies/read-article-policy-handler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReadArticlePolicyHandler } from 'src/casl/policies/policy-handler/Policies/read-article-policy-handler';
import { CheckPolicies } from 'src/casl/policies/check-policies.decorator';
import { PoliciesGuard } from 'src/casl/policies/policies.guard';
// import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';

// import { ForbiddenError } from '@casl/ability';
// import { HttpExceptionFilter } from './../../exception/http-exception.filter';

@Controller('users')
// @UseFilters(HttpExceptionFilter)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly emailVerificationService: EmailVerificationService,
        // private readonly abilityFactory: AbilityFactory,
        // private readonly caslAbilityFactory: CaslAbilityFactory
    ) { }

    // #=======================================================================================#
    // #			                            Register                                       #
    // #=======================================================================================#
    @Post('register')
    @UsePipes(ValidationPipe)
    async createNewUser(@Body(RegisterPipe) userData: CreateUsersDto) {
        let data = await this.usersService.getUserByEmail(userData.email)
        if (data) throw new ConflictException('this email already used')

        data = await this.usersService.createNewUser(userData)
        // use create then wanna send email code
        if (data) {
            // auto generate code = 6 numbers
            const registerCode = REGISTER_CODE
            const storeEmailCode = await this.emailVerificationService.createNewEmailVerification(registerCode, EXPIRE_CODE_TIME, data._id)

            if (storeEmailCode) emailVerification(userData, registerCode);
            else throw new BadGatewayException('can\'t send email code to this email')
        } else {
            throw new BadRequestException('can\'t create user, please try again')
        }

        // to remove password from object before retune data to user 
        data = (data as any).toObject();
        delete data.password
        delete data['__v']
        delete data['createdAt']
        delete data['updatedAt']

        return {
            message: `The code has been sent to your email = ${data.email}`,
            data
        }
    }

    // #=======================================================================================#
    // #			                        activate email                                     #
    // #=======================================================================================#
    @Post('activate')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async activateEmail(@Body() emailActivateData: CreateEmailActivateDto) {
        if (emailActivateData.code.toString().length !== 6) {
            throw new BadRequestException('the code must be 6 number')
        }

        let data: any;
        data = await this.emailVerificationService.checkCode(emailActivateData)

        if (!data) {
            throw new BadRequestException(`Not send code to user with id = ${emailActivateData.user}`)
        } else if (emailActivateData.code != data.code) {
            throw new BadRequestException('invalid code');
        } else if (new Date() >= data.expire_at) {
            // If the code exceeds a certain time and it has not been used in this application for 24 hours
            throw new BadRequestException('This code has expired');
        }

        // update user data is_verification = true
        data = await this.usersService.activateUserAccount(emailActivateData.user)
        if (!data) throw new BadRequestException('can\'t activate this email');

        return { message: 'email activation successfully' }
    }
    // #=======================================================================================#
    // #                    get all Users => this end point for admin only                     #
    // #=======================================================================================#
    @Get()
    @HttpCode(HttpStatus.OK)
    @CheckPolicies(new ReadArticlePolicyHandler())
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    async getAllUsers(@Request() req) {
        let data: any;

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
