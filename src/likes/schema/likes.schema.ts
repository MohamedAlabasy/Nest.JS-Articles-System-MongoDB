import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Article } from "src/articles/schema/articles.schema";
import { User } from "src/users/schema/user.schema";
import { EmojiType } from "src/utilities/common";

export type LikeDocument = Like & Document;

@Schema({ timestamps: true })
export class Like {

    @Prop()
    _id: string;

    @Prop({
        type: String,
        // enum: ['like', 'smile', 'love', 'angry'],
        // default: 'like',
        enum: EmojiType,
        default: EmojiType.LIKE,
    })
    type: string;

    // for relations
    @Prop({ type: String, ref: 'User' })
    user: User | string;

    @Prop({ type: String, ref: 'Article' })
    article: Article | string;
}
export const LikeSchema = SchemaFactory.createForClass(Like)