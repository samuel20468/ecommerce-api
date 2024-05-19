import { Module } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
import { CloudinaryController } from "./cloudinary.controller";
import { CloudinaryConfig } from "../../config/cloudinary";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../products/products.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [CloudinaryController],
  providers: [CloudinaryService, CloudinaryConfig],
})
export class CloudinaryModule {}
