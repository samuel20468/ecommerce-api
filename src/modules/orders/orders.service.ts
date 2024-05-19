import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { CreateOrderDto } from "./dtos/create-order.dto";
import { Order } from "./orders.entity";
import { OrderDetail } from "./orderDetails.entity";
import { Repository } from "typeorm";
import { User } from "../users/users.entity";
import { Product } from "../products/products.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async getOrder(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetail: {
          products: true,
        },
      },
    });
    if (!order) {
      throw new HttpException(`Order not found`, HttpStatus.BAD_REQUEST);
    }
    return order;
  }
  async addOrder(createOrder: CreateOrderDto) {
    const { userId, products } = createOrder;

    const foundUser = await this.usersRepository.findOneBy({ id: userId });
    if (!foundUser)
      throw new BadRequestException("A user is needed to create an order");

    let totalPrice: number = 0;
    const productsToUpdate: Product[] = [];

    for (const product of products) {
      const foundProduct = await this.productsRepository.findOneBy({
        id: product.id,
      });
      if (!foundProduct) {
        throw new BadRequestException("A product is needed to create an order");
      }

      // Verificar si el stock es mayor que 0 antes de actualizarlo
      if (foundProduct.stock > 0) {
        totalPrice += foundProduct.price;
        foundProduct.stock--;
        await this.productsRepository.save(foundProduct);
        productsToUpdate.push(foundProduct);
      }
    }

    const newOrder = new Order();
    newOrder.user = foundUser;
    newOrder.date = new Date();

    await this.ordersRepository.save(newOrder);

    const newOrderDetail = new OrderDetail();
    newOrderDetail.price = totalPrice;
    newOrderDetail.products = productsToUpdate;
    newOrderDetail.order = newOrder;

    await this.orderDetailsRepository.save(newOrderDetail);

    const totalOrder = await this.ordersRepository.findOne({
      where: { id: newOrder.id },
      relations: {
        orderDetail: true,
      },
    });

    return totalOrder;
  }
}
