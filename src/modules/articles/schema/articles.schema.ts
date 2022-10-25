import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { User } from 'src/modules/users/schema/user.schema';

export type ArticleDocument = Article & Document

@Schema()
export class Article {

    @Prop()
    _id: string;

    @Prop({ unique: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ default: 0 })
    likes: number;

    // for relations    
    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' });
    @Prop({ type: String, ref: 'User' })
    user: User;

}


export const ArticleSchema = SchemaFactory.createForClass(Article);