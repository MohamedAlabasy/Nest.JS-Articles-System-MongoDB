import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { User } from 'src/users/schema/user.schema';

export type EmailVerificationDocument = EmailVerification & Document

@Schema({ collection: 'email_verification', timestamps: true })
export class EmailVerification {

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

export const EmailVerificationSchema = SchemaFactory.createForClass(EmailVerification)