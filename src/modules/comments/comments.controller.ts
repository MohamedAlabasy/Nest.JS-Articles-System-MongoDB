import { Controller, Get, Post, Headers, Patch, Delete, HttpException, HttpStatus, Body, ValidationPipe, UsePipes, Param, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { GET_ID_FROM_TOKEN } from 'src/utilities/get-id-from-token';
import { ArticlesService } from '../articles/articles.service';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto copy';

@Controller('comments')
export class CommentsController {
    constructor(
        private readonly commentService: CommentsService,
        private readonly articlesService: ArticlesService
    ) { }
    // #=======================================================================================#
    // #			                          create comment                                   #
    // #=======================================================================================#
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(ValidationPipe)
    async createArticle(@Body() _commentData: CreateCommentDto, @Headers() _headers) {
        _commentData.user = GET_ID_FROM_TOKEN(_headers)
        let data: any;
        data = await this.articlesService.getArticleById(_commentData.article)
        if (!data) {
            throw new HttpException(`no articles with this id = ${_commentData.article}`, HttpStatus.NOT_FOUND)
        }

        data = await this.commentService.createComment(_commentData)
        if (data.affected === 0) throw new HttpException(`can't create comment on this articles with this id = ${_commentData.article}`, HttpStatus.BAD_REQUEST)

        return {
            data: {
                _id: data._id,
                comment: data.comment,
                user: data.user,
                article: data.article
            }
        }
    }
    // #=======================================================================================#
    // #			                     get all comments on articles                          #
    // #=======================================================================================#
    @Get(":articleID")
    @HttpCode(HttpStatus.OK)
    async getAllCommentsOnArticles(@Param('articleID', ParseUUIDPipe) _articleID: string) {
        const data = await this.commentService.getAllCommentsOnArticles(_articleID)

        if (data.length == 0) throw new HttpException('No comments on this articles to show', HttpStatus.NOT_FOUND)

        return {
            count: data.length,
            data
        }

    }
    // #=======================================================================================#
    // #			                        update comments                                    #
    // #=======================================================================================#
    @Patch(':commentID')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async updateComment(@Param('commentID', ParseUUIDPipe) _commentID: string, @Body() _commentData: UpdateCommentDto, @Headers() _headers) {

        _commentData.user = GET_ID_FROM_TOKEN(_headers)
        let data: any;
        data = await this.commentService.getCommentById(_commentID)
        if (!data) throw new HttpException(`no comment with this id = ${_commentID}`, HttpStatus.NOT_FOUND)


        if (data.user.id !== GET_ID_FROM_TOKEN(_headers)) throw new HttpException('this comment can only be modified by the person who created it', HttpStatus.FORBIDDEN)


        data = await this.commentService.updateComment(_commentID, _commentData)
        if (data.affected === 0) throw new HttpException('can\'t update this comment please try again', HttpStatus.BAD_REQUEST)


        return {
            message: 'comment updated successfully',
            data
        }
    }
    // #=======================================================================================#
    // #			                        delete comments                                    #
    // #=======================================================================================#
    @Delete(':commentID')
    @HttpCode(HttpStatus.OK)
    async deleteComment(@Param('commentID', ParseUUIDPipe) _commentID: string, @Headers() _headers) {
        let data: any;
        const userID = GET_ID_FROM_TOKEN(_headers)

        data = await this.commentService.getCommentById(_commentID)
        if (!data) throw new HttpException(`no comment with this id = ${_commentID}`, HttpStatus.NOT_FOUND)


        if (data.user.id !== userID) throw new HttpException('this comment can only be deleted by the person who created it', HttpStatus.FORBIDDEN)


        data = await this.commentService.deleteComment(_commentID)
        if (data.affected === 0) throw new HttpException('can\'t delete this comment please try again', HttpStatus.BAD_REQUEST)


        return { message: 'comment deleted successfully' }
    }

}
