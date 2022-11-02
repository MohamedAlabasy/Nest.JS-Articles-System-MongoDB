import { Module } from '@nestjs/common';
// import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MONGO_DB } from './config/mongodb.config';
import { UsersModule } from './modules/users/users.module';
// import { CheckTokensMiddleware } from './middleware/check-tokens.middleware';
import { EmailVerificationModule } from './modules/email-verification/email-verification.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { LikesModule } from './modules/likes/likes.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ForgotPasswordModule } from './modules/forgot-password/forgot-password.module';

import { CaslModule } from './casl/casl.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
// import { APP_GUARD } from '@nestjs/core';
// import { PoliciesGuard } from './policies-guard/policies.guard';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
    // CaslModule
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