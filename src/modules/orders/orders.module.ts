import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./orders.entity";
import { OrderDetail } from "./orderDetails.entity";
import { Product } from "../products/products.entity";
import { User } from "../users/users.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail, Product, User])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
