
import {
    BadRequestException,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    // Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // private readonly logger = new Logger(JwtAuthGuard.name);
    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments

        if (!user && (info.message === 'No auth token' || info.message == 'invalid token')) {
            throw err || new ForbiddenException(info.message);
        }

        if (err || !user) {
            if (info.message === 'No auth token' || info.message == 'invalid token') {
                throw new ForbiddenException(info.message);
            } else {
                throw new UnauthorizedException();
            }
        }

        if (user.is_verification == false) throw new BadRequestException('You must verification email first');

        return user;
    }
}