import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
// import { User } from 'src/modules/users/schema/user.schema';

export type ForgotPasswordDocument = ForgotPassword & Document

@Schema({ collection: 'forgot_password', timestamps: true })
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
    user: User | string;
}

export const ForgotPasswordSchema = SchemaFactory.createForClass(ForgotPassword)