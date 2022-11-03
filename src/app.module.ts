import { Module } from '@nestjs/common';
// import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_DB } from './config/mongodb.config';
import { CaslModule } from './casl/casl.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { ArticlesModule } from './articles/articles.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
// import { HttpExceptionFilter } from './exception/http-exception.filter';
// import { APP_FILTER } from '@nestjs/core';


@Module({
  imports: [
    MongooseModule.forRoot(MONGO_DB),
    CaslModule,
    UsersModule,
    AuthModule,
    EmailVerificationModule,
    ArticlesModule,
    LikesModule,
    CommentsModule,
    ForgotPasswordModule,
  ],
  providers: [
    JwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: PoliciesGuard,
    // },
  ],
})
export class AppModule { }

//#region "Middleware"
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       // .apply(LoggerMiddleware).forRoutes('*')
//       .apply(CheckTokensMiddleware).exclude(
        // { path: 'auth', method: RequestMethod.POST },
        // { path: 'users/register', method: RequestMethod.POST },
        // { path: 'users/activate', method: RequestMethod.POST },
        // { path: 'forgotPassword/checkEmail', method: RequestMethod.POST },
        // { path: 'forgotPassword/resetPassword', method: RequestMethod.POST },
        // { path: 'articles', method: RequestMethod.GET },
        // { path: 'likes/:articleID', method: RequestMethod.GET },
        // { path: 'comments/:articleID', method: RequestMethod.GET },
//       ).forRoutes('*')
//   }
// }
//#endregion "Middleware"