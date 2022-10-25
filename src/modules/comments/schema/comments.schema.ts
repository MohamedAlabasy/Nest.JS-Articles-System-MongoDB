import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

import { Article } from 'src/modules/articles/schema/articles.schema';
import { User } from 'src/modules/users/schema/user.schema';

export type CommentDocument = Comment & Document

@Schema()
export class Comment {

    @Prop()
    _id: string;

    @Prop()
    comment: string;

    // for relations
    @Prop({ type: String, ref: 'User' })
    user: User;

    @Prop({ type: String, ref: 'Article' })
    article: Article;
}

export const CommentSchema = SchemaFactory.createForClass(Comment)