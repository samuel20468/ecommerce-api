import { Module } from "@nestjs/common";
import { CategoriesService } from "../categories/categories.service";
import { ProductsService } from "../products/products.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../products/products.entity";
import { Category } from "../categories/categories.entity";
import { PreloadService } from "./preload.service";

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  providers: [CategoriesService, ProductsService, PreloadService],
})
export class PreloadModule {}
