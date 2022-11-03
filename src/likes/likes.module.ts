import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { CaslModule } from 'src/casl/casl.module';
import { ArticlesService } from '../articles/articles.service';
import { Article, ArticleSchema } from '../articles/schema/articles.schema';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { Like, LikeSchema } from './schema/likes.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
        MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
        CaslModule
    ],
    controllers: [LikesController],
    providers: [LikesService, ArticlesService]
})
export class LikesModule { }
