import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articles } from 'src/database/entities/articles.entity';
import { Likes } from 'src/database/entities/likes.entity';
import { ArticlesService } from '../articles/articles.service';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Likes, Articles])],
  exports: [TypeOrmModule],
  controllers: [LikesController],
  providers: [LikesService, ArticlesService]
})
export class LikesModule { }
