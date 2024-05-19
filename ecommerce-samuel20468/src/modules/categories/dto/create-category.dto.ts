import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    /**
     * Category name
     * @example mouse
     */
    @IsString()
    @IsNotEmpty()
    name: string;
}
