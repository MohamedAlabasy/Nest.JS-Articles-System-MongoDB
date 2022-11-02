import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {

    handleRequest(err, user, info, context, status) {

        const request = context.switchToHttp().getRequest();
        const { email, password } = request.body;
        if (err || !user) {
            if (!email) {
                throw new BadRequestException('email field must not be empty & must be an email ');
            } else if (!password) {
                throw new BadRequestException('password field must not be empty & have 1 upper case, lowercase letter along with a number and special character.');
            } else {
                throw err || new UnauthorizedException();
            }
        }
        return user;
    }
}