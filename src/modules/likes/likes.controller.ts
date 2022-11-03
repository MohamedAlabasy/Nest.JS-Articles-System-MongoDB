import { Controller, Post, Delete, Request, Get, Param, UsePipes, ValidationPipe, Body, ParseUUIDPipe, NotFoundException, BadRequestException, ForbiddenException, UseGuards } from '@nestjs/common';
import { PoliciesGuard } from 'src/casl/policies/policies.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
// import { PoliciesGuard } from 'src/policies-guard/policies.guard';
import { ArticlesService } from '../articles/articles.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikesService } from './likes.service';
// import { HttpExceptionFilter } from './../../exception/http-exception.filter';

@Controller('likes')
// @UseFilters(HttpExceptionFilter)
export class LikesController {
    constructor(
        private readonly likesService: LikesService,
        private readonly articlesService: ArticlesService
    ) { }

    // #=======================================================================================#
    // #			                     create like on article                                #
    // #=======================================================================================#
    @Post()
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async createArticle(@Body() createLikeDto: CreateLikeDto, @Request() req) {
        let data: any;
        createLikeDto.user = req.user._id

        const articleData = await this.articlesService.getArticleById(createLikeDto.article)
        if (!articleData) throw new NotFoundException(`no article with this _id =${createLikeDto.article}`);

        data = await this.likesService.checkLikeArticle(createLikeDto.user, createLikeDto.article)
        if (data) throw new BadRequestException('You have already liked this article');

        data = await this.likesService.createLikeArticle(createLikeDto)
        if (!data) throw new BadRequestException('can\'t like this article please try again');
        else await this.articlesService.updateNumberOfLikes(data.article, articleData.likes + 1)

        // to remove __v from object before retune data to user 
        data = (data as any).toObject();
        delete data['__v']
        delete data['createdAt']
        delete data['updatedAt']

        return { data }
    }
    // #=======================================================================================#
    // #			                        unlike article                                     #
    // #=======================================================================================#
    @Delete(':articleID')
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async unLikeArticle(@Param('articleID', ParseUUIDPipe) articleID: string, @Request() req) {
        let data: any;
        const userID = req.user._id

        const articleData = await this.articlesService.getArticleById(articleID)
        if (!articleData) throw new NotFoundException(`no article with this id =${articleID}`);

        data = await this.likesService.getLikeByArticleId(articleID)
        if (data && data.user !== userID) throw new ForbiddenException('this like can only be unlike by the person who created it')

        if (data.createdAt + 3600000 > new Date()) throw new ForbiddenException('You can\'t unlike after 7 days')

        data = await this.likesService.checkLikeArticle(userID, articleID)
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
    async getAllLikeOnArticle(@Param('articleID', ParseUUIDPipe) articleID: string) {
        const data = await this.likesService.getAllLikeOnArticle(articleID)
        if (data && data.length == 0) throw new NotFoundException(`there is no like with this article = ${articleID}`);

        return {
            count: data.length,
            data
        }
    }
}
