import { Controller, Post, Delete, Headers, Get, Param, UsePipes, ValidationPipe, Body, HttpStatus, HttpCode, ParseUUIDPipe, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { GET_ID_FROM_TOKEN } from 'src/utilities/get-id-from-token';
import { ArticlesService } from '../articles/articles.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
    constructor(
        private readonly likesService: LikesService,
        private readonly articlesService: ArticlesService
    ) { }

    // #=======================================================================================#
    // #			                     create like on article                                #
    // #=======================================================================================#
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(ValidationPipe)
    async createArticle(@Body() _articleData: CreateLikeDto, @Headers() _headers) {
        let data: any;
        _articleData.user = GET_ID_FROM_TOKEN(_headers)

        const articleData = await this.articlesService.getArticleById(_articleData.article)
        if (!articleData) throw new NotFoundException(`no article with this _id =${_articleData.article}`);

        data = await this.likesService.checkLikeArticle(_articleData.user, _articleData.article)
        if (data) throw new BadRequestException('You have already liked this article');

        data = await this.likesService.createLikeArticle(_articleData)
        if (!data) throw new BadRequestException('can\'t like this article please try again');
        else await this.articlesService.updateNumberOfLikes(data.article, articleData.likes + 1)

        return {
            data: {
                _id: data._id,
                type: data.type,
                user: data.user,
                article: data.article
            }
        }
    }
    // #=======================================================================================#
    // #			                        unlike article                                     #
    // #=======================================================================================#
    @Delete(':articleID')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async unLikeArticle(@Param('articleID', ParseUUIDPipe) _articleID: string, @Headers() _headers) {
        let data: any;
        const userID = GET_ID_FROM_TOKEN(_headers)

        const articleData = await this.articlesService.getArticleById(_articleID)
        if (!articleData) throw new NotFoundException(`no article with this id =${_articleID}`);

        data = await this.likesService.getLikeByArticleId(_articleID)
        if (data && data.user !== userID) throw new ForbiddenException('this like can only be unlike by the person who created it')

        data = await this.likesService.checkLikeArticle(userID, _articleID)
        if (!data) throw new BadRequestException('You didn\'t like this article before');

        data = await this.likesService.unLikeArticle(data._id)
        if (!data) throw new BadRequestException('can\'t unLiked this article');
        else await this.articlesService.updateNumberOfLikes(data.article, articleData.likes - 1)

        return { message: 'unLiked successfully' }
    }
    // #=======================================================================================#
    // #			                    get all like on article                                #
    // #=======================================================================================#
    @Get(':articleID')
    @HttpCode(HttpStatus.OK)
    async getAllLikeOnArticle(@Param('articleID', ParseUUIDPipe) _articleID: string) {
        const data = await this.likesService.getAllLikeOnArticle(_articleID)
        if (data && data.length == 0) throw new NotFoundException(`there is no like with this article = ${_articleID}`);

        return {
            count: data.length,
            data
        }
    }
}
