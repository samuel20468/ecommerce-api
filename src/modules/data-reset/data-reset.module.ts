import { Module } from "@nestjs/common";
import { DataResetService } from "./data-reset.service";
import { DataResetController } from "./data-reset.controller";
import { PreloadService } from "../preload/preload.service";
import { Product } from "../products/products.entity";
import { Category } from "../categories/categories.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesService } from "../categories/categories.service";
import { ProductsService } from "../products/products.service";
import { OrderDetail } from "../orders/orderDetails.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, OrderDetail])],
  controllers: [DataResetController],
  providers: [DataResetService, PreloadService, CategoriesService, ProductsService],
})
export class DataResetModule {}
