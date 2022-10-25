import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articles } from 'src/database/entities/articles.entity';
import { Users } from 'src/database/entities/users.entity';
import { UsersService } from '../users/users.service';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Articles, Users])],
  exports: [TypeOrmModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, UsersService]
})
export class ArticlesModule { }
