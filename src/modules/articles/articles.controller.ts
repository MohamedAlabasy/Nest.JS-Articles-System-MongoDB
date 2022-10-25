// import { Controller, Get, Post, Patch, Headers, Delete, HttpException, HttpStatus, Body, ValidationPipe, UsePipes, Param, ParseIntPipe } from '@nestjs/common';
// import { UsersService } from '../users/users.service';
// import { ArticlesService } from './articles.service';
// import { CreateArticleDto } from './dto/create-article.dto';
// import { UpdateArticleDto } from './dto/update-article.dto';
// import { GET_ID_FROM_TOKEN } from '../../utilities/get-id-from-token';

// @Controller('articles')
// export class ArticlesController {
//     constructor(
//         private readonly articlesService: ArticlesService,
//         private readonly usersService: UsersService
//     ) { }
//     // #=======================================================================================#
//     // #			                          create Article                                   #
//     // #=======================================================================================#
//     @Post()
//     @UsePipes(ValidationPipe)
//     async createArticle(@Body() _articleData: CreateArticleDto, @Headers() _headers) {
//         try {
//             _articleData.user = GET_ID_FROM_TOKEN(_headers)

//             const data = await this.articlesService.createArticle(_articleData)

//             return {
//                 statusCode: 200,
//                 data
//             }
//         } catch (error) {
//             return new HttpException(error.message, HttpStatus.BAD_REQUEST)
//         }
//     }
//     // #=======================================================================================#
//     // #			                        get article by id                                  #
//     // #=======================================================================================#
//     @Get(':id')
//     async getArticleById(@Param('id', ParseIntPipe) _id: number) {
//         try {
//             const data = await this.articlesService.getArticleById(_id)

//             if (!data) {
//                 throw new Error(`No articles with this id = ${_id}`)
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
//     // #			                        get all articles                                   #
//     // #=======================================================================================#
//     @Get()
//     async getAllArticles() {
//         try {
//             const data = await this.articlesService.getAllArticles()

//             if (data.length == 0) {
//                 throw new Error('No articles to show')
//             }
//             return {
//                 statusCode: 200,
//                 count: data.length,
//                 data: data
//             }
//         } catch (error) {
//             return new HttpException(error.message, HttpStatus.BAD_REQUEST)
//         }
//     }
//     // #=======================================================================================#
//     // #			                        update articles                                    #
//     // #=======================================================================================#
//     @Patch(':_articleID')
//     @UsePipes(ValidationPipe)
//     async updateArticle(@Param('_articleID', ParseIntPipe) _articleID: number, @Body() _articleData: UpdateArticleDto, @Headers() _headers) {
//         try {
//             _articleData.user = GET_ID_FROM_TOKEN(_headers)
//             let data: any;
//             data = await this.usersService.getUserById(_articleData.user)
//             if (!data) {
//                 throw new Error(`No user with this id = ${_articleData.user}`)
//             }

//             data = await this.articlesService.getArticleById(_articleID)
//             if (!data) {
//                 throw new Error(`no articles with this id = ${_articleID}`)
//             }

//             if (data.user.id !== GET_ID_FROM_TOKEN(_headers)) {
//                 throw new Error('this article can only be modified by the person who created it')
//             }

//             data = await this.articlesService.updateArticle(_articleID, _articleData)
//             if (data.affected === 0) {
//                 throw new Error(`can't update articles with this id = ${_articleID}`)
//             }
//             return {
//                 statusCode: 200,
//                 message: 'articles updated successfully',
//                 data: data.data
//             }
//         } catch (error) {
//             return new HttpException(error.message, HttpStatus.BAD_REQUEST)
//         }
//     }
//     // #=======================================================================================#
//     // #			                        delete articles                                    #
//     // #=======================================================================================#
//     @Delete(':_articleID')
//     async deleteArticle(@Param('_articleID', ParseIntPipe) _articleID: number, @Headers() _headers) {
//         try {
//             let data: any;
//             const userID = GET_ID_FROM_TOKEN(_headers)
//             data = await this.usersService.getUserById(userID)
//             if (!data) {
//                 throw new Error(`No user with this id = ${userID}`)
//             }

//             data = await this.articlesService.getArticleById(_articleID)
//             if (!data) {
//                 throw new Error(`no articles with this id = ${_articleID}`)
//             }

//             if (data.user.id !== userID) {
//                 throw new Error('this article can only be deleted by the person who created it')
//             }

//             data = await this.articlesService.deleteArticle(_articleID)
//             if (data.affected === 0) {
//                 throw new Error(`can't delete articles with this id  = ${_articleID}`)
//             }

//             return {
//                 statusCode: 200,
//                 message: 'articles deleted successfully'
//             }
//         } catch (error) {
//             return new HttpException(error.message, HttpStatus.BAD_REQUEST)
//         }
//     }


// }
