// import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

// import { Articles } from './articles.entity';
// import { Comments } from './comments.entity';
// import { EmailVerification } from './email-verification.entity';
// import { Likes } from './likes.entity';
// import { ForgotPassword } from './forgot-password.entity';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    _id: string;

    @Prop()
    name: string;

    @Prop({ unique: true })
    email: string;

    @Prop({ default: false })
    is_admin: boolean;

    @Prop({ default: false })
    is_verification: boolean;

    @Prop({ select: false })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
