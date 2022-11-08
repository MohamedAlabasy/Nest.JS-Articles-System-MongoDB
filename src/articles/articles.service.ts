import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SELECT } from 'src/utilities/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './schema/articles.schema';
@Injectable()
export class ArticlesService {
    constructor(@InjectModel(Article.name) private articlesModel: Model<Article>) { }

    // #=======================================================================================#
    // #			                          create article                                   #
    // #=======================================================================================#
    async createArticle(articleData: CreateArticleDto): Promise<Article> {
        return this.articlesModel.create({
            _id: uuidv4(),
            title: articleData.title,
            description: articleData.description,
            user: articleData.user
        });
    }
    // #=======================================================================================#
    // #			                        get article by id                                  #
    // #=======================================================================================#
    async getArticleById(_id: string): Promise<Article> {
        return await this.articlesModel.findOne({ _id }).populate({ path: 'user', select: SELECT }).select(SELECT)
    }
    // #=======================================================================================#
    // #			                      get article by title                                 #
    // #=======================================================================================#
    async getArticleByTitle(title: string): Promise<Article> {
        return await this.articlesModel.findOne({ title }).populate({ path: 'user', select: SELECT }).select(SELECT)
    }
    // #=======================================================================================#
    // #			                        get all articles                                   #
    // #=======================================================================================#
    async getAllArticles(): Promise<Article[]> {
        return await this.articlesModel.find({}).populate({ path: 'user', select: SELECT }).select(SELECT)
    }
    // #=======================================================================================#
    // #			                        update articles                                    #
    // #=======================================================================================#
    async updateArticle(_id: string, articleData: UpdateArticleDto): Promise<Article> {
        return await this.articlesModel.findByIdAndUpdate({ _id }, {
            title: articleData.title,
            description: articleData.description
        }, { new: true }).populate({ path: 'user', select: SELECT }).select(SELECT);
    }
    // #=======================================================================================#
    // #			                        delete article                                     #
    // #=======================================================================================#
    async deleteArticle(_id: string) {
        return await this.articlesModel.findByIdAndDelete({ _id });
    }
    // #=======================================================================================#
    // #			                     update number of Likes                                #
    // #=======================================================================================#
    async updateNumberOfLikes(_id: string, likes: number): Promise<Article> {
        return await this.articlesModel.findByIdAndUpdate({ _id }, { $inc: { likes } }, { new: true }) // new: true to return with new data 
    }
}
