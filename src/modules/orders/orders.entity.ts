import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/users.entity";
import { OrderDetail } from "./orderDetails.entity";

@Entity({
  name: "orders",
})
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("date")
  date: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetail: OrderDetail;
}
