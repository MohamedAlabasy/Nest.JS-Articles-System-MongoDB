import { Injectable, NestMiddleware, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { ACCESS_TOKEN_SECRET } from '../config/token.config';


@Injectable()
export class CheckTokensMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers["authorization"] || req.body.token || req.query.token;
    const token = authHeader && authHeader.split(' ')[1]; //to get token without Bearer
    if (!token) throw new ForbiddenException("You must enter token");;

    jwt.verify(token, ACCESS_TOKEN_SECRET as string, (error: any, decoded: any) => {
      if (error) throw new UnauthorizedException('invalid token'); //No. (498 invalid token) is an unofficial code used by a proprietary product. 

      if (!decoded.is_verification) throw new ForbiddenException('You must verification email first')
      next();
    });
  }
}
