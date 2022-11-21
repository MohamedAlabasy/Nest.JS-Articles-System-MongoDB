import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { User } from 'src/users/schema/user.schema';

export type ArticleDocument = Article & Document

@Schema({ timestamps: true })
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
    // @Prop({ type: String, ref: 'User', autopopulate: true })
    user: User | string;

}


export const ArticleSchema = SchemaFactory.createForClass(Article);