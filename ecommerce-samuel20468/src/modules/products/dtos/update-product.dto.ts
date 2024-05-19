import { PartialType } from "@nestjs/swagger";
import { ProductDto } from "./createProduct.dto";

export class UpdateProductDto extends PartialType(ProductDto) {}