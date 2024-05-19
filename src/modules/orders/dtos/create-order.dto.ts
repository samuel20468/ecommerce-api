import {
  IsUUID,
  ArrayMinSize,
  ValidateNested,
  IsNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiHideProperty, ApiProperty, PartialType } from "@nestjs/swagger";

export class ProductId {
  @ApiProperty({
    description: "Valid UUID",
    example: "b1d49b6a-daa1-4c21-ab76-ae1a1a6f0652",
  })
  @IsNotEmpty({ message: "El id del producto es obligatorio" })
  @IsUUID()
  id: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: "Valid UUID",
    example: "b1d49b6a-daa1-4c21-ab76-ae1a1a6f0652",
  })
  @IsNotEmpty({ message: "El userId es obligatorio" })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: "Array of valid UUID'S",
    example: [
      { id: "b1d49b6a-daa1-4c21-ab76-ae1a1a6f0652" },
      { id: "1c3af909-b04f-4b46-bb5d-54bc22c45601" },
    ],
    type: [ProductId],
  })
  @ArrayMinSize(1, { message: "Debe haber al menos un producto en la orden" })
  @ValidateNested({ each: true }) // Aquí aplicamos validación anidada
  @Type(() => ProductId)
  products: ProductId[];
}
