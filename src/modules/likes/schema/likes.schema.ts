import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

import { Article } from "src/modules/articles/schema/articles.schema";
import { User } from "src/modules/users/schema/user.schema";
import { EmojiType } from "src/utilities/common";

export type LikeDocument = Like & Document;

@Schema()
export class Like {

    @Prop()
    _id: number;

    @Prop({
        type: String,
        enum: ['like', 'smile', 'love', 'angry',],
        default: 'like'

        // enum: EmojiType,
        // default: EmojiType.LIKE,
    })
    type: string;

    // for relations
    @Prop({ type: String, ref: 'User' })
    user: User;

    @Prop({ type: String, ref: 'User' })
    article: Article;
}
export const LikeSchema = SchemaFactory.createForClass(Like)