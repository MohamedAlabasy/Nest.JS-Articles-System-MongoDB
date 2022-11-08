import { Controller, Post, Delete, Request, Get, Param, UsePipes, ValidationPipe, Body, ParseUUIDPipe, NotFoundException, BadRequestException, ForbiddenException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Action } from 'src/casl/action.enum';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/policies/check-policies.decorator';
import { PoliciesGuard } from 'src/casl/policies/policies.guard';
import { DeleteLikePolicyHandler } from 'src/casl/policies/policy-handler/Policies/delete-like-policy-handler';
import { ArticlesService } from '../articles/articles.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikesService } from './likes.service';
// import { HttpExceptionFilter } from './../../exception/http-exception.filter';

@Controller('likes')
// @UseFilters(HttpExceptionFilter)
export class LikesController {
    constructor(

    ) { }


}
