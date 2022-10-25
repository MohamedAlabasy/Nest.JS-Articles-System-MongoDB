import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { ACCESS_TOKEN_SECRET } from '../config/token.config';


@Injectable()
export class CheckTokensMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers["authorization"] || req.body.token || req.query.token;
      const token = authHeader && authHeader.split(' ')[1]; //to get token without Bearer
      if (!token) {
        throw new Error("You must enter token");;
      }

      jwt.verify(token, ACCESS_TOKEN_SECRET as string, (error: any, decoded: any) => {
        if (error) {
          throw new Error('invalid token');
        }

        if (!decoded.is_verification) {
          throw new Error('You must verification email first')
        }

        next();
      });
    } catch (error) {
      res.status(400).send({
        statusCode: 400,
        message: error.message
      })
    }
  }
}
