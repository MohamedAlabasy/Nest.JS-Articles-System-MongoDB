import { Controller, Post, Delete, Headers, Get, Param, UsePipes, ValidationPipe, Body, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
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
    @UsePipes(ValidationPipe)
    async createArticle(@Body() _articleData: CreateLikeDto, @Headers() _headers) {
        try {
            _articleData.user = GET_ID_FROM_TOKEN(_headers)
            let data: any;
            data = await this.articlesService.getArticleById(_articleData.article)
            if (!data) {
                throw new Error(`no article with this id =${_articleData.article}`);
            }

            data = await this.likesService.checkLikeArticle(_articleData.user, _articleData.article)
            if (data.length > 0) {
                throw new Error('You have already liked this article');
            }

            data = await this.likesService.createLikeArticle(_articleData)
            if (!data) {
                throw new Error('can\'t like this article please try again');
            }

            return {
                statusCode: 200,
                data
            }

        } catch (error) {
            return new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }
    // #=======================================================================================#
    // #			                        unlike article                                     #
    // #=======================================================================================#
    @Delete(':articleID')
    @UsePipes(ValidationPipe)
    async unLikeArticle(@Param('articleID', ParseIntPipe) _articleID: number, @Headers() _headers) {
        try {
            const userID = GET_ID_FROM_TOKEN(_headers)
            let data: any;
            data = await this.articlesService.getArticleById(_articleID)
            if (!data) {
                throw new Error(`no article with this id =${_articleID}`);
            }

            data = await this.likesService.getLikeByArticleId(_articleID)
            if (data.user.id !== userID) {
                throw new Error('this like can only be unlike by the person who created it')
            }

            data = await this.likesService.checkLikeArticle(userID, _articleID)
            if (data.length === 0) {
                throw new Error('You didn\'t like this article before');
            }

            data = await this.likesService.unLikeArticle(data[0].id)
            if (data.affected === 0) {
                throw new Error('can\'t unLiked this article');
            }

            return {
                statusCode: 200,
                message: 'unLiked successfully'
            }

        } catch (error) {
            return new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }
    // #=======================================================================================#
    // #			                    get all like on article                                #
    // #=======================================================================================#
    @Get(':articleID')
    async getAllLikeOnArticle(@Param('articleID', ParseIntPipe) _articleID: number) {
        try {

            const data = await this.likesService.getAllLikeOnArticle(_articleID)

            if (data.length === 0) {
                throw new Error(`there is no like with this article = ${_articleID}`);
            }

            return {
                statusCode: 200,
                count: data.length,
                data
            }

        } catch (error) {
            return new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }
}
