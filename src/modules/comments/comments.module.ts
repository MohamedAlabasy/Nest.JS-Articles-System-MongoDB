import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articles } from 'src/database/entities/articles.entity';
import { Comments } from 'src/database/entities/comments.entity';
import { ArticlesService } from '../articles/articles.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comments, Articles])],
  exports: [TypeOrmModule],
  controllers: [CommentsController],
  providers: [CommentsService, ArticlesService]
})
export class CommentsModule { }
