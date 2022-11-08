import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from 'src/articles/schema/articles.schema';
import { Comment, CommentSchema } from 'src/comments/schema/comments.schema';
import { Like, LikeSchema } from 'src/likes/schema/likes.schema';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
        MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    ],
    providers: [CaslAbilityFactory],
    exports: [CaslAbilityFactory],
})
export class CaslModule { }