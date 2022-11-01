import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { EmailLowerCasePipe } from 'src/pipes/email-lower-case.pipe';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../guards/local-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    // #=======================================================================================#
    // #			                            login                                          #
    // #=======================================================================================#    
    @UseGuards(LocalAuthGuard)
    @Post('')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    // async login(@Body() userData: LoginDto) {
    async login(@Body(EmailLowerCasePipe) _userData: LoginDto, @Request() req) {
        // console.log('_userData', _userData);
        // console.log('user', req.user);

        // to remove password from object before retune data to user 
        delete req.user._doc.password

        const token = await this.authService.SignJWTToken(req.user._doc);

        return {
            token: 'Bearer ' + token,
            data: req.user._doc
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async login2(@Request() req) {
        // console.log('req', req);
        console.log('user', req.user);
        // console.log('_userData', _userData);
        return req.user
    }
}
