import { IsNotEmpty, IsInt } from "class-validator";

export class CreateEmailActivateDto {

    @IsInt()
    @IsNotEmpty()
    readonly code: number;

    @IsInt()
    @IsNotEmpty()
    readonly user: number;
}
