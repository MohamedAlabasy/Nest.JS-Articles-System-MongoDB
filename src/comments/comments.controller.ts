import { Controller, Get, Post, Patch, Delete, Request, Body, ValidationPipe, UsePipes, Param, ParseUUIDPipe, NotFoundException, BadRequestException, ForbiddenException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Action } from 'src/casl/action.enum';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
// import { CheckPolicies } from 'src/casl/policies/check-policies.decorator';
import { PoliciesGuard } from 'src/guards/policies.guard';
import { ArticlesService } from '../articles/articles.service';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto copy';
// import { Comment } from './schema/comments.schema';
// import { HttpExceptionFilter } from './../../exception/http-exception.filter';

@Controller('comments')
// @UseFilters(HttpExceptionFilter)
export class CommentsController {
    constructor(
        private readonly commentService: CommentsService,
        private readonly articlesService: ArticlesService,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) { }
    // #=======================================================================================#
    // #			                          create comment                                   #
    // #=======================================================================================#
    @Post()
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async createArticle(@Body() commentData: CreateCommentDto, @Request() req) {
        let data: any;
        commentData.user = req.user._id

        data = await this.articlesService.getArticleById(commentData.article)
        if (!data) throw new NotFoundException(`no articles with this _id = ${commentData.article}`)

        data = await this.commentService.createComment(commentData)
        if (data.affected === 0) throw new BadRequestException(`can't create comment on this articles with this _id = ${commentData.article}`)

        // to remove __v from object before retune data to user 
        data = (data as any).toObject();
        delete data['__v']
        delete data['createdAt']
        delete data['updatedAt']

        return { data }
    }
    // #=======================================================================================#
    // #			                     get all comments on articles                          #
    // #=======================================================================================#
    @Get(":articleID")
    async getAllCommentsOnArticles(@Param('articleID', ParseUUIDPipe) articleID: string) {
        const data = await this.commentService.getAllCommentsOnArticles(articleID)
        if (data && data.length === 0) throw new NotFoundException('No comments on this articles to show')

        return {
            count: data.length,
            data
        }
    }
    // #=======================================================================================#
    // #			                        update comments                                    #
    // #=======================================================================================#
    @Patch(':commentID')
    // @CheckPolicies(new UpdateCommentPolicyHandler())
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async updateComment(@Param('commentID', ParseUUIDPipe) commentID: string, @Body() commentData: UpdateCommentDto, @Request() req) {
        let data: any;
        commentData.user = req.user._id

        data = await this.commentService.getCommentById(commentID)
        if (!data) throw new NotFoundException(`no comment with this id = ${commentID}`)

        const ability = this.caslAbilityFactory.createForUser(req.user);
        if (!ability.can(Action.Update, data)) throw new ForbiddenException('this comment can only be modified by the person who created it')
        // if (data.user._id !== commentData.user) throw new ForbiddenException('this comment can only be modified by the person who created it')

        data = await this.commentService.updateComment(commentID, commentData)
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
    // @CheckPolicies(new DeleteCommentPolicyHandler())
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    async deleteComment(@Param('commentID', ParseUUIDPipe) commentID: string, @Request() req) {
        let data: any;
        const userID: string = req.user._id

        data = await this.commentService.getCommentById(commentID)
        if (!data) throw new NotFoundException(`no comment with this _id = ${commentID}`)

        const ability = this.caslAbilityFactory.createForUser(req.user);
        // if (data.user._id !== userID) throw new ForbiddenException('this comment can only be deleted by the person who created it')
        if (!ability.can(Action.Delete, data)) throw new ForbiddenException('this comment can only be deleted by the person who created it and It hasn\'t been more than 7 days since it was created')
        // if (data.createdAt + 3600000 > new Date()) throw new ForbiddenException('You can\'t delete after 7 days')
        // if (!ability.can(Action.Update, new Comment(data.createdAt))) throw new ForbiddenException('this comment can only be modified by the person who created it')


        data = await this.commentService.deleteComment(commentID)
        if (data.affected === 0) throw new BadRequestException('can\'t delete this comment please try again')

        return { message: 'comment deleted successfully' }
    }
}
