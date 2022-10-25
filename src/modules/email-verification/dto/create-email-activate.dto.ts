import { IsNotEmpty, IsInt, IsString } from "class-validator";

export class CreateEmailActivateDto {

    @IsInt()
    @IsNotEmpty()
    readonly code: number;

    @IsString()
    @IsNotEmpty()
    readonly user: number;
}
