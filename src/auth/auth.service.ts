import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/schema/user.schema';


@Injectable()
export class AuthService {
    // private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    // #=======================================================================================#
    // #			                            login                                          #
    // #=======================================================================================#
    async validateUser(email: string, pass: string): Promise<object | null> {
        const user: User = await this.usersService.login(email);
        if (!user) throw new NotFoundException('user not found')

        const IsValidPassword: boolean = bcrypt.compareSync(pass, user.password);

        if (IsValidPassword) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    // #=======================================================================================#
    // #			                         create token                                      #
    // #=======================================================================================#
    async SignJWTToken(payload: User): Promise<string> {
        return this.jwtService.sign(payload)
    }
}