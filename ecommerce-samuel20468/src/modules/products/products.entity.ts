import { Category } from "../categories/categories.entity";
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderDetail } from "../orders/orderDetails.entity";

/// ColumnNumericTransformer
export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

const defaultImg =
  "https://i.pinimg.com/736x/11/2c/93/112c933e00502825649a504ca3ab3947.jpg";

@Entity({
  name: "products",
})
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 50, unique: true })
  name: string;

  @Column()
  description: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @Column("numeric")
  stock: number;

  @Column({ default: defaultImg })
  imgUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
  orderDetails: OrderDetail[];
}
