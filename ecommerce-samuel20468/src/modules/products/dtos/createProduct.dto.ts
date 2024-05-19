import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  Min,
} from "class-validator";

export class ProductDto {
  /**
   *  Product Name
   *  @example "Iphone 15"
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  /**
   * Product Description
   * @example "The best smarthphone in the world"
   */
  @IsNotEmpty()
  @IsString()
  description: string;

  /**
   * Product Price
   * @example 1000.00
   */
  @IsNotEmpty()
  @IsDecimal({ decimal_digits: "2" })
  price: number;

  /**
   * Product Stock
   * @example 12
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  stock: number;

  /**
   * Product Image Url
   * @example https://www.shorturl.at/img/shorturl-icon.png
   */
  @IsOptional()
  @IsString()
  @IsUrl()
  imgUrl?: string;

  /**
   * Product Category
   * @example "smarthphone"
   */
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  category: string;
}
