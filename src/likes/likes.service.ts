import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { SELECT } from 'src/utilities/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { Like } from './schema/likes.schema';

@Injectable()
export class LikesService {
    constructor(@InjectModel(Like.name) private likeModel: Model<Like>) { }

    // #=======================================================================================#
    // #			                      check like article                                   #
    // #=======================================================================================#
    async checkLikeArticle(user: string, article: string): Promise<Like> {
        return await this.likeModel.findOne({ user, article })
    }

    // #=======================================================================================#
    // #			                      create like article                                  #
    // #=======================================================================================#
    async createLikeArticle(likeData: CreateLikeDto): Promise<Like> {
        return this.likeModel.create({
            _id: uuidv4(),
            type: likeData.type,
            article: likeData.article,
            user: likeData.user,
        });
    }

    // #=======================================================================================#
    // #			                        unlike article                                     #
    // #=======================================================================================#
    async unLikeArticle(_id: string) {
        return await this.likeModel.findOneAndDelete({ _id })
    }

    // #=======================================================================================#
    // #			                      check like article                                   #
    // #=======================================================================================#
    async getAllLikeOnArticle(article: string): Promise<Like[]> {
        return await this.likeModel.find({ article }).populate({ path: 'user article', select: `${SELECT} -user` }).select(SELECT)
    }
    // #=======================================================================================#
    // #			                        get like by id                                     #
    // #=======================================================================================#
    async getLikeByArticleId(article: string): Promise<Like> {
        return await this.likeModel.findOne({ article })
    }
}
