import { Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    // #=======================================================================================#
    // #			                            login                                          #
    // #=======================================================================================#    
    @Post('')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    async login(@Request() req) {

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
