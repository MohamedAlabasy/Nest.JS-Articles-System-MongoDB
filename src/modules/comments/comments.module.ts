import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schema/comments.schema';
import { ArticlesService } from '../articles/articles.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Article, ArticleSchema } from '../articles/schema/articles.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
        MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }])
    ],
    controllers: [CommentsController],
    providers: [CommentsService, ArticlesService]
})
export class CommentsModule { }
