import { Controller, Get, Post, Patch, Headers, Delete, HttpException, HttpStatus, Body, ValidationPipe, UsePipes, Param, HttpCode, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { GET_ID_FROM_TOKEN } from '../../utilities/get-id-from-token';

@Controller('articles')
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
    async createArticle(@Body() _articleData: CreateArticleDto, @Headers() _headers) {
        let data: any;
        _articleData.user = GET_ID_FROM_TOKEN(_headers)

        data = await this.articlesService.getArticleByTitle(_articleData.title);
        if (data) throw new HttpException('this title already exists', HttpStatus.BAD_REQUEST);

        data = await this.articlesService.createArticle(_articleData);
        return {
            data: {
                _id: data._id,
                title: data.title,
                description: data.description,
                likes: data.likes,
                user: data.user
            }
        }

    }
    // #=======================================================================================#
    // #			                        get article by id                                  #
    // #=======================================================================================#
    @Get(':_id')
    async getArticleById(@Param('_id', ParseUUIDPipe) _id: string) {

        const data = await this.articlesService.getArticleById(_id)
        if (!data) throw new HttpException(`No articles with this id = ${_id}`, HttpStatus.NOT_FOUND)

        return { data }
    }
    // #=======================================================================================#
    // #			                        get all articles                                   #
    // #=======================================================================================#
    @Get()
    async getAllArticles() {
        const data = await this.articlesService.getAllArticles()
        if (data.length == 0) throw new HttpException('No articles to show', HttpStatus.NOT_FOUND)

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
    async updateArticle(@Param('_articleID', ParseUUIDPipe) _articleID: string, @Body() _articleData: UpdateArticleDto, @Headers() _headers) {

        _articleData.user = GET_ID_FROM_TOKEN(_headers)
        let data: any;
        data = await this.usersService.getUserById(_articleData.user)
        if (!data) throw new HttpException(`No user with this id = ${_articleData.user}`, HttpStatus.NOT_FOUND)


        data = await this.articlesService.getArticleById(_articleID)
        if (!data) throw new HttpException(`no articles with this id = ${_articleID}`, HttpStatus.NOT_FOUND)


        if (data.user.id !== GET_ID_FROM_TOKEN(_headers)) throw new HttpException('this article can only be modified by the person who created it', HttpStatus.FORBIDDEN)


        data = await this.articlesService.updateArticle(_articleID, _articleData)
        if (data.affected === 0) throw new HttpException(`can't update articles with this id = ${_articleID}`, HttpStatus.BAD_REQUEST)

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
    async deleteArticle(@Param('_articleID', ParseUUIDPipe) _articleID: string, @Headers() _headers) {

        let data: any;
        const userID = GET_ID_FROM_TOKEN(_headers)
        data = await this.usersService.getUserById(userID)
        if (!data) throw new HttpException(`No user with this _id = ${userID}`, HttpStatus.NOT_FOUND)

        data = await this.articlesService.getArticleById(_articleID)
        if (!data) throw new HttpException(`no articles with this _id = ${_articleID}`, HttpStatus.NOT_FOUND)

        if (data.user._id !== userID) throw new HttpException('this article can only be deleted by the person who created it', HttpStatus.FORBIDDEN)

        data = await this.articlesService.deleteArticle(_articleID)
        if (data.affected === 0) throw new HttpException(`can't delete articles with this _id = ${_articleID}`, HttpStatus.BAD_REQUEST)

        return { message: 'articles deleted successfully' }
    }


}
