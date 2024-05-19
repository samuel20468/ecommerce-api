import { ConflictException, Injectable } from "@nestjs/common";
import { PreloadService } from "../preload/preload.service";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderDetail } from "../orders/orderDetails.entity";
import { Repository } from "typeorm";
import { Product } from "../products/products.entity";
import { Category } from "../categories/categories.entity";

@Injectable()
export class DataResetService {
  constructor(
    private readonly preloadService: PreloadService,
    @InjectRepository(OrderDetail)
    private readonly orderDetailsRepository: Repository<OrderDetail>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async resetData() {
    const allOrders: OrderDetail[] = await this.orderDetailsRepository.find({
      relations: {
        products: true,
      },
    });

    const productsFromOrders = allOrders.flatMap((order) => order.products);

    if (productsFromOrders.length === 0) {
      console.log("Data Restart Initiated!");
      await this.preloadService.preloadData();
      return
    }

    const productIdsFromOrders: string[] = productsFromOrders.map(
      (product) => product.id,
    );

    const allProducts: Product[] = await this.productsRepository.find();

    const productIdsStored: string[] = allProducts.map((product) => product.id);

    const productsInOrders = productIdsFromOrders.some((id) =>
      productIdsStored.includes(id),
    );

    if (productsInOrders) {
      throw new ConflictException(
        "No es posible reiniciar los datos debido a la existencia de órdenes activas que contienen productos.",
      );
    } else {
      console.log("Data Restart Initiated!");
      await this.preloadService.preloadData();
    }
  }
}
