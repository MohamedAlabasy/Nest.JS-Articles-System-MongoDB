import { Controller, Get, Request, Post, Patch, Delete, Body, ValidationPipe, UsePipes, Param, ParseUUIDPipe, NotFoundException, BadRequestException, ForbiddenException, ConflictException, UseGuards, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PoliciesGuard } from 'src/casl/policies/policies.guard';
import { Article } from './schema/articles.schema';
// import { CheckPolicies } from 'src/casl/policies/check-policies.decorator';
// import { UpdateArticlePolicyHandler } from 'src/casl/policies/policy-handler/Policies/update-article-policy-handler';
// import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/casl/action.enum';
// import { ForbiddenError } from '@casl/ability';
// import { DeleteArticlePolicyHandler } from 'src/casl/policies/policy-handler/Policies/delete-article-policy-handler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { HttpExceptionFilter } from 'src/exception/http-exception.filter';

@Controller('articles')
// @UseFilters(HttpExceptionFilter)
export class ArticlesController {
    constructor(
        private readonly articlesService: ArticlesService,
        private readonly usersService: UsersService,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) { }
    // #=======================================================================================#
    // #			                          create Article                                   #
    // #=======================================================================================#
    @Post()
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    // async createArticle(@Body() articleData: CreateArticleDto, @Request() req: Request) {
    async createArticle(@Body() articleData: CreateArticleDto, @Request() req) {
        let data: Article;
        // to add user id to articleData from token
        articleData.user = req.user._id

        data = await this.articlesService.getArticleByTitle(articleData.title);
        if (data) throw new ConflictException('this title already exists');

        data = await this.articlesService.createArticle(articleData);

        // to remove from object before retune data to user 
        data = (data as any).toObject();
        delete data['__v']
        delete data['createdAt']
        delete data['updatedAt']

        return { data }
    }
    // #=======================================================================================#
    // #			                        get article by id                                  #
    // #=======================================================================================#
    @Get(':id')
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    async getArticleById(@Param('id', ParseUUIDPipe) id: string) {

        const data = await this.articlesService.getArticleById(id)
        if (!data) throw new NotFoundException(`No articles with this _id = ${id}`)

        return { data }
    }
    // #=======================================================================================#
    // #			                        get all articles                                   #
    // #=======================================================================================#
    @Get()
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
    @Patch(':articleID')
    // @CheckPolicies(new UpdateArticlePolicyHandler())
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async updateArticle(@Param('articleID', ParseUUIDPipe) articleID: string, @Body() articleData: UpdateArticleDto, @Request() req) {
        let data: any;
        articleData.user = req.user._id

        data = await this.usersService.getUserById(articleData.user)
        if (!data) throw new NotFoundException(`No user with this id = ${articleData.user}`)


        data = await this.articlesService.getArticleById(articleID)
        if (!data) throw new NotFoundException(`no articles with this id = ${articleID}`)


        const ability = this.caslAbilityFactory.createForUser(req.user);
        // if (data.user.id !== req.user._id) throw new ForbiddenException('this article can only be modified by the person who created it')
        if (!ability.can(Action.Update, data)) throw new ForbiddenException('this article can only be modified by the person who created it')


        data = await this.articlesService.updateArticle(articleID, articleData)
        if (data.affected === 0) throw new BadRequestException(`can't update articles with this id = ${articleID}`)

        return {
            message: 'articles updated successfully',
            data: data
        }
    }
    // #=======================================================================================#
    // #			                        delete articles                                    #
    // #=======================================================================================#
    @Delete(':articleID')
    // @CheckPolicies(new DeleteArticlePolicyHandler())
    @UseGuards(PoliciesGuard)
    @UseGuards(JwtAuthGuard)
    async deleteArticle(@Param('articleID', ParseUUIDPipe) articleID: string, @Request() req) {
        let data: any;

        data = await this.usersService.getUserById(req.user._id)
        if (!data) throw new NotFoundException(`No user with this _id = ${req.user._id}`)

        data = await this.articlesService.getArticleById(articleID)
        if (!data) throw new NotFoundException(`no articles with this _id = ${articleID}`)

        const ability = this.caslAbilityFactory.createForUser(req.user);
        // if (data.user._id !== req.user._id) throw new ForbiddenException('this article can only be deleted by the person who created it')
        if (!ability.can(Action.Delete, data)) throw new ForbiddenException('this article can only be deleted by the person who created it')


        data = await this.articlesService.deleteArticle(articleID)
        if (data.affected === 0) throw new BadRequestException(`can't delete articles with this _id = ${articleID}`)

        return { message: 'articles deleted successfully' }
    }
}
