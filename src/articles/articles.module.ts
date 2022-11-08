import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './schema/articles.schema';
import { UsersService } from '../users/users.service';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { User, UserSchema } from '../users/schema/user.schema';
// import { CaslModule } from 'src/casl/casl.module';
import { Like, LikeSchema } from 'src/likes/schema/likes.schema';
import { LikesService } from 'src/likes/likes.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
        // CaslModule
    ],
    controllers: [ArticlesController],
    providers: [ArticlesService, UsersService, LikesService]
})
export class ArticlesModule { }
