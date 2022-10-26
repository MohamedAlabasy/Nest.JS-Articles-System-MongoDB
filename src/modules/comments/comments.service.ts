import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SELECT } from 'src/utilities/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto copy';
import { Comment } from './schema/comments.schema';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment.name) private commentsModel: Model<Comment>) { }

    // #=======================================================================================#
    // #			                        create comment                                     #
    // #=======================================================================================#
    async createComment(_commentData: CreateCommentDto): Promise<Comment> {
        return this.commentsModel.create({
            _id: uuidv4(),
            comment: _commentData.comment,
            user: _commentData.user,
            article: _commentData.article
        });
    }

    // #=======================================================================================#
    // #			                  get all comment on article                               #
    // #=======================================================================================#
    async getAllCommentsOnArticles(article: string): Promise<Comment[]> {
        return await this.commentsModel.find({ article }).populate({ path: 'user article', select: `${SELECT} -user` }).select(SELECT)
    }

    // #=======================================================================================#
    // #			                        update comment                                     #
    // #=======================================================================================#
    async updateComment(_id: string, _commentData: UpdateCommentDto): Promise<Comment> {
        return await this.commentsModel.findByIdAndUpdate({ _id }, {
            comment: _commentData.comment,
        }, { new: true }).populate({ path: 'user article', select: `${SELECT} -user` }).select(SELECT)
    }
    // #=======================================================================================#
    // #			                  get comment by id on article                             #
    // #=======================================================================================#
    async getCommentById(_id: string): Promise<Comment> {
        return await this.commentsModel.findById(_id).populate({ path: 'user article', select: `${SELECT} -user` }).select(SELECT)
    }
    // #=======================================================================================#
    // #			                        delete comment                                     #
    // #=======================================================================================#
    async deleteComment(_id: string): Promise<Comment> {
        return await this.commentsModel.findByIdAndDelete({ _id })
    }
}
