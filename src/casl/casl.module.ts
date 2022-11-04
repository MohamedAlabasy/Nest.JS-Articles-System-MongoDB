import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { ArticlesService } from 'src/articles/articles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from 'src/articles/schema/articles.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),],
    providers: [CaslAbilityFactory],
    exports: [CaslAbilityFactory],
})
export class CaslModule { }