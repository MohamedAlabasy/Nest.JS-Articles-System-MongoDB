// import { Controller, Get, Post, Headers, Patch, Delete, HttpException, HttpStatus, Body, ValidationPipe, UsePipes, Param, ParseIntPipe } from '@nestjs/common';
// import { GET_ID_FROM_TOKEN } from 'src/utilities/get-id-from-token';
// import { ArticlesService } from '../articles/articles.service';
// import { CommentsService } from './comments.service';
// import { CreateCommentDto } from './dto/create-comment.dto';
// import { UpdateCommentDto } from './dto/update-comment.dto copy';

// @Controller('comments')
// export class CommentsController {
//     constructor(
//         private readonly commentService: CommentsService,
//         private readonly articlesService: ArticlesService
//     ) { }
//     // #=======================================================================================#
//     // #			                          create comment                                   #
//     // #=======================================================================================#
//     @Post()
//     @UsePipes(ValidationPipe)
//     async createArticle(@Body() _commentData: CreateCommentDto, @Headers() _headers) {
//         try {
//             _commentData.user = GET_ID_FROM_TOKEN(_headers)
//             let data: any;
//             data = await this.articlesService.getArticleById(_commentData.article)
//             if (!data) {
//                 throw new Error(`no articles with this id = ${_commentData.article}`)
//             }

//             data = await this.commentService.createComment(_commentData)
//             if (data.affected === 0) {
//                 throw new Error(`can't create comment on this articles with this id = ${_commentData.article}`)
//             }

//             return {
//                 statusCode: 200,
//                 data
//             }
//         } catch (error) {
//             return new HttpException(error.message, HttpStatus.BAD_REQUEST)
//         }
//     }
//     // #=======================================================================================#
//     // #			                     get all comments on articles                          #
//     // #=======================================================================================#
//     @Get(":articleID")
//     async getAllCommentsOnArticles(@Param('articleID', ParseIntPipe) _articleID: number) {
//         try {
//             const data = await this.commentService.getAllCommentsOnArticles(_articleID)

//             if (data.length == 0) {
//                 throw new Error('No comments on this articles to show')
//             }

//             return {
//                 statusCode: 200,
//                 count: data.length,
//                 data
//             }
//         } catch (error) {
//             return new HttpException(error.message, HttpStatus.BAD_REQUEST)
//         }
//     }
//     // #=======================================================================================#
//     // #			                        update comments                                    #
//     // #=======================================================================================#
//     @Patch(':commentID')
//     @UsePipes(ValidationPipe)
//     async updateComment(@Param('commentID', ParseIntPipe) _commentID: number, @Body() _commentData: UpdateCommentDto, @Headers() _headers) {
//         try {
//             _commentData.user = GET_ID_FROM_TOKEN(_headers)
//             let data: any;
//             data = await this.commentService.getCommentById(_commentID)
//             if (!data) {
//                 throw new Error(`no comment with this id = ${_commentID}`)
//             }

//             if (data.user.id !== GET_ID_FROM_TOKEN(_headers)) {
//                 throw new Error('this comment can only be modified by the person who created it')
//             }

//             data = await this.commentService.updateComment(_commentID, _commentData)
//             if (data.affected === 0) {
//                 throw new Error('can\'t update this comment please try again')
//             }

//             return {
//                 statusCode: 200,
//                 message: 'comment updated successfully',
//             }
//         } catch (error) {
//             return new HttpException(error.message, HttpStatus.BAD_REQUEST)
//         }
//     }
//     // #=======================================================================================#
//     // #			                        delete comments                                    #
//     // #=======================================================================================#
//     @Delete(':commentID')
//     async deleteComment(@Param('commentID', ParseIntPipe) _commentID: number, @Headers() _headers) {
//         try {
//             const userID = GET_ID_FROM_TOKEN(_headers)
//             let data: any;
//             data = await this.commentService.getCommentById(_commentID)
//             if (!data) {
//                 throw new Error(`no comment with this id = ${_commentID}`)
//             }

//             if (data.user.id !== userID) {
//                 throw new Error('this comment can only be deleted by the person who created it')
//             }

//             data = await this.commentService.deleteComment(_commentID)
//             if (data.affected === 0) {
//                 throw new Error('can\'t delete this comment please try again')
//             }

//             return {
//                 statusCode: 200,
//                 message: 'comment deleted successfully'
//             }
//         } catch (error) {
//             return new HttpException(error.message, HttpStatus.BAD_REQUEST)
//         }
//     }

// }
