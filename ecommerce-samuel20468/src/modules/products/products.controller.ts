import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductDto } from "./dtos/createProduct.dto";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CategoriesService } from "../categories/categories.service";
import { Roles } from "../../decorators/roles.decorator";
import { Role } from "../users/role.enum";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Product } from "./products.entity";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UpdateProductDto } from "./dtos/update-product.dto";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  getAllProducts(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 99,
  ) {
    return this.productsService.getProducts(page, limit);
  }
  @Get("seeder")
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async seedProducts(): Promise<string> {
    const categoriesLoaded = await this.categoriesService.getCategories();
    if (categoriesLoaded.length === 0) {
      throw new HttpException(
        "Categories must be loaded before seeding products.",
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.productsService.seedProducts();
  }
  @Get("/:id")
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  getProduct(@Param("id", ParseUUIDPipe) id: string) {
    return this.productsService.getProductById(id);
  }
  @Post("/createProduct")
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  createProduct(@Body() product: ProductDto): Promise<Product> {
    return this.productsService.createProduct(product);
  }
  @Put("/updateProduct/:id")
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  updateProduct(
    @Body() product: UpdateProductDto,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    const newProduct: UpdateProductDto = product;
    return this.productsService.updateProduct(id, newProduct);
  }
  @Delete("/deleteProduct/:id")
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  deleteProduct(@Param("id", ParseUUIDPipe) id: string) {
    return this.productsService.deleteProduct(id);
  }
}
