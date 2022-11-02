import { Controller, Get, Post, Patch, Headers, Delete, HttpStatus, Body, ValidationPipe, UsePipes, Param, HttpCode, ParseUUIDPipe, NotFoundException, BadRequestException, ForbiddenException, ConflictException, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { GET_ID_FROM_TOKEN } from '../../utilities/get-id-from-token';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/policies-guard/policies.guard';
// import { HttpExceptionFilter } from './../../exception/http-exception.filter';

@Controller('articles')
// @UseFilters(HttpExceptionFilter)
export class ArticlesController {
    constructor(
        private readonly articlesService: ArticlesService,
        private readonly usersService: UsersService
    ) { }
    // #=======================================================================================#
    // #			                          create Article                                   #
    // #=======================================================================================#
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(ValidationPipe)
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    async createArticle(@Body() _articleData: CreateArticleDto, /* @Headers() _headers */) {
        let data: any;
        _articleData.user = GET_ID_FROM_TOKEN(_headers)

        data = await this.articlesService.getArticleByTitle(_articleData.title);
        if (data) throw new ConflictException('this title already exists');

        data = await this.articlesService.createArticle(_articleData);

        // to remove __v from object before retune data to user 
        data = (data as any).toObject();
        delete data['__v']

        return { data }
    }
    // #=======================================================================================#
    // #			                        get article by id                                  #
    // #=======================================================================================#
    @Get(':_id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    async getArticleById(@Param('_id', ParseUUIDPipe) _id: string) {

        const data = await this.articlesService.getArticleById(_id)
        if (!data) throw new NotFoundException(`No articles with this _id = ${_id}`)

        return { data }
    }
    // #=======================================================================================#
    // #			                        get all articles                                   #
    // #=======================================================================================#
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllArticles() {
        const data = await this.articlesService.getAllArticles()
        if (data && data.length == 0) throw new NotFoundException('No articles to show')

        return {
            count: data.length,
            data: data
        }
    }
    // #=======================================================================================#
    // #			                        update articles                                    #
    // #=======================================================================================#
    @Patch(':_articleID')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    async updateArticle(@Param('_articleID', ParseUUIDPipe) _articleID: string, @Body() _articleData: UpdateArticleDto, @Headers() _headers) {
        let data: any;
        _articleData.user = GET_ID_FROM_TOKEN(_headers)
        data = await this.usersService.getUserById(_articleData.user)
        if (!data) throw new NotFoundException(`No user with this id = ${_articleData.user}`)


        data = await this.articlesService.getArticleById(_articleID)
        if (!data) throw new NotFoundException(`no articles with this id = ${_articleID}`)


        if (data.user.id !== GET_ID_FROM_TOKEN(_headers)) throw new ForbiddenException('this article can only be modified by the person who created it')


        data = await this.articlesService.updateArticle(_articleID, _articleData)
        if (data.affected === 0) throw new BadRequestException(`can't update articles with this id = ${_articleID}`)

        return {
            message: 'articles updated successfully',
            data: data
        }
    }
    // #=======================================================================================#
    // #			                        delete articles                                    #
    // #=======================================================================================#
    @Delete(':_articleID')
    @HttpCode(HttpStatus.OK)
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    async deleteArticle(@Param('_articleID', ParseUUIDPipe) _articleID: string, @Headers() _headers) {
        let data: any;
        const userID = GET_ID_FROM_TOKEN(_headers)
        data = await this.usersService.getUserById(userID)
        if (!data) throw new NotFoundException(`No user with this _id = ${userID}`)

        data = await this.articlesService.getArticleById(_articleID)
        if (!data) throw new NotFoundException(`no articles with this _id = ${_articleID}`)
        if (data.user._id !== userID) throw new ForbiddenException('this article can only be deleted by the person who created it')

        data = await this.articlesService.deleteArticle(_articleID)
        if (data.affected === 0) throw new BadRequestException(`can't delete articles with this _id = ${_articleID}`)

        return { message: 'articles deleted successfully' }
    }
}
