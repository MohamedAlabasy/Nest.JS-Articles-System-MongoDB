import { IsNotEmpty, IsInt } from "class-validator";

export class UnLikeDto {

    @IsInt()
    @IsNotEmpty()
    readonly user: number;

    @IsInt()
    @IsNotEmpty()
    readonly article: number;

}
