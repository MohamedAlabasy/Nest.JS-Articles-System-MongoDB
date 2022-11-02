import { Controller, Get, Post, Headers, Patch, Delete, HttpStatus, Body, ValidationPipe, UsePipes, Param, ParseUUIDPipe, HttpCode, NotFoundException, BadRequestException, ForbiddenException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/policies-guard/policies.guard';
import { GET_ID_FROM_TOKEN } from 'src/utilities/get-id-from-token';
import { ArticlesService } from '../articles/articles.service';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto copy';
// import { HttpExceptionFilter } from './../../exception/http-exception.filter';

@Controller('comments')
// @UseFilters(HttpExceptionFilter)
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
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    async createArticle(@Body() _commentData: CreateCommentDto, /* @Headers() _headers */) {
        let data: any;
        _commentData.user = GET_ID_FROM_TOKEN(_headers)

        data = await this.articlesService.getArticleById(_commentData.article)
        if (!data) throw new NotFoundException(`no articles with this _id = ${_commentData.article}`)

        data = await this.commentService.createComment(_commentData)
        if (data.affected === 0) throw new BadRequestException(`can't create comment on this articles with this id = ${_commentData.article}`)

        // to remove __v from object before retune data to user 
        data = (data as any).toObject();
        delete data['__v']

        return { data }
    }
    // #=======================================================================================#
    // #			                     get all comments on articles                          #
    // #=======================================================================================#
    @Get(":articleID")
    @HttpCode(HttpStatus.OK)
    async getAllCommentsOnArticles(@Param('articleID', ParseUUIDPipe) _articleID: string) {
        const data = await this.commentService.getAllCommentsOnArticles(_articleID)
        if (data && data.length == 0) throw new NotFoundException('No comments on this articles to show')

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
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    async updateComment(@Param('commentID', ParseUUIDPipe) _commentID: string, @Body() _commentData: UpdateCommentDto, /* @Headers() _headers */) {
        let data: any;
        _commentData.user = GET_ID_FROM_TOKEN(_headers)

        data = await this.commentService.getCommentById(_commentID)
        if (!data) throw new NotFoundException(`no comment with this id = ${_commentID}`)
        if (data.user._id !== _commentData.user) throw new ForbiddenException('this comment can only be modified by the person who created it')

        data = await this.commentService.updateComment(_commentID, _commentData)
        if (data.affected === 0) throw new BadRequestException('can\'t update this comment please try again')

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
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    async deleteComment(@Param('commentID', ParseUUIDPipe) _commentID: string, /* @Headers() _headers */) {
        let data: any;
        const userID: string = GET_ID_FROM_TOKEN(_headers)

        data = await this.commentService.getCommentById(_commentID)
        if (!data) throw new NotFoundException(`no comment with this _id = ${_commentID}`)
        if (data.user._id !== userID) throw new ForbiddenException('this comment can only be deleted by the person who created it')

        data = await this.commentService.deleteComment(_commentID)
        if (data.affected === 0) throw new BadRequestException('can\'t delete this comment please try again')

        return { message: 'comment deleted successfully' }
    }

}
