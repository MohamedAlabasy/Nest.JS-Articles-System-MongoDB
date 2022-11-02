import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
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


    //#region "add timestamps manually"
    // @Prop()
    // @Field(() => Date, { description: 'Created At' })
    // createdAt?: Date

    // @Prop()
    // @Field(() => Date, { description: 'Updated At' })
    // updatedAt?: Date
    //#endregion "add timestamps manually"
}

export const UserSchema = SchemaFactory.createForClass(User);
