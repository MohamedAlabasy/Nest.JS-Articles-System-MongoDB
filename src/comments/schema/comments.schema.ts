import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Article } from 'src/articles/schema/articles.schema';
import { User } from 'src/users/schema/user.schema';


export type CommentDocument = Comment & Document

@Schema({ timestamps: true })
export class Comment {
    // constructor(createdAt) {
    //     this.createdAt = new Date(createdAt).getDate()
    // }

    @Prop()
    _id: string;

    @Prop()
    comment: string;

    // for relations
    @Prop({ type: String, ref: 'User' })
    user: User | string;

    @Prop({ type: String, ref: 'Article' })
    article: Article | string;

    // createdAt: any
}

export const CommentSchema = SchemaFactory.createForClass(Comment)