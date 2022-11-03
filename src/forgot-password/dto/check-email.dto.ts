import { IsNotEmpty, IsEmail } from "class-validator";

export class CheckEmailDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
}
