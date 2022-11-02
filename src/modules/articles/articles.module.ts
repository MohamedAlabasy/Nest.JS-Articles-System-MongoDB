import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './schema/articles.schema';
import { UsersService } from '../users/users.service';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { User, UserSchema } from '../users/schema/user.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        CaslModule
    ],
    controllers: [ArticlesController],
    providers: [ArticlesService, UsersService]
})
export class ArticlesModule { }
