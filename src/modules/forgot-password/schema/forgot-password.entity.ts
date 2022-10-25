import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose';
import { User } from 'src/modules/users/schema/user.schema';

export type ForgotPasswordDocument = ForgotPassword & Document

@Schema({ collection: 'forgot_password' })
export class ForgotPassword {
    @Prop()
    _id: string;

    @Prop()
    code: string;

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date })
    expire_at: Date;

    // for relations
    @Prop({ type: String, ref: 'User' })
    user: User;
}

export const ForgotPasswordSchema = SchemaFactory.createForClass(ForgotPassword)