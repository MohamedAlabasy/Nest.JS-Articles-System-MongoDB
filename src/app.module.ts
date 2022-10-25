import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

import { UsersModule } from './modules/users/users.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { CheckTokensMiddleware } from './middleware/check-tokens.middleware';
import { EmailVerificationModule } from './modules/email-verification/email-verification.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { LikesModule } from './modules/likes/likes.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ForgotPasswordModule } from './modules/forgot-password/forgot-password.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    EmailVerificationModule,
    ArticlesModule,
    LikesModule,
    CommentsModule,
    ForgotPasswordModule,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware).forRoutes('*')
      .apply(CheckTokensMiddleware).exclude(
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users/register', method: RequestMethod.POST },
        { path: 'users/activate', method: RequestMethod.POST },
        { path: 'forgotPassword/checkEmail', method: RequestMethod.POST },
        { path: 'forgotPassword/resetPassword', method: RequestMethod.POST },
        { path: 'articles', method: RequestMethod.GET },
        { path: 'likes/:articleID', method: RequestMethod.GET },
        { path: 'comments/:articleID', method: RequestMethod.GET },
      ).forRoutes('*')
  }
}
