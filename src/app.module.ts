import { Module } from "@nestjs/common";
//? Importación de modulos
import { UsersModule } from "./modules/users/users.module";
import { ProductsModule } from "./modules/products/products.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { AuthModule } from "./modules/auth/auth.module";

//? Importación de configuración
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import typeOrmConfig from "./config/typeorm";
import { OrdersModule } from "./modules/orders/orders.module";
import { CloudinaryModule } from "./modules/cloudinary/cloudinary.module";
import { JwtModule } from "@nestjs/jwt";
import { PreloadModule } from './modules/preload/preload.module';
import { DataResetModule } from './modules/data-reset/data-reset.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get("typeorm"),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "1h",
      },
    }),
    UsersModule,
    ProductsModule,
    AuthModule,
    CategoriesModule,
    OrdersModule,
    CloudinaryModule,
    PreloadModule,
    DataResetModule,
  ],
})
export class AppModule {}
