// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Comments } from 'src/database/entities/comments.entity';
// import { Repository } from 'typeorm';
// import { CreateCommentDto } from './dto/create-comment.dto';
// import { UpdateCommentDto } from './dto/update-comment.dto copy';

// @Injectable()
// export class CommentsService {
//     constructor(@InjectRepository(Comments) private commentsRepository: Repository<Comments>) { }

//     // #=======================================================================================#
//     // #			                        create comment                                     #
//     // #=======================================================================================#
//     async createComment(_commentData: CreateCommentDto): Promise<Comments> {
//         const data = this.commentsRepository.create({
//             comment: _commentData.comment,
//             user: _commentData.user,
//             article: _commentData.article
//         });
//         return await this.commentsRepository.save(data)
//     }

//     // #=======================================================================================#
//     // #			                  get all comment on article                               #
//     // #=======================================================================================#
//     async getAllCommentsOnArticles(article: number): Promise<Comments[]> {
//         // return await this.commentsRepository.find({ where: { article: article }, relations: ['user', 'article'] })
//         return await this.commentsRepository.query(`select * from comments where articleId = ${article}`)
//     }

//     // #=======================================================================================#
//     // #			                        update comment                                     #
//     // #=======================================================================================#
//     async updateComment(id: number, _commentData: UpdateCommentDto) {
//         return await this.commentsRepository.update({ id }, {
//             comment: _commentData.comment,
//         })
//     }

//     async getCommentById(id: number) {
//         return await this.commentsRepository.findOne({ relations: ['user', 'article'], where: { id } })
//     }
//     // #=======================================================================================#
//     // #			                        delete comment                                     #
//     // #=======================================================================================#
//     async deleteComment(id: number) {
//         return await this.commentsRepository.delete({ id })
//     }
// }
