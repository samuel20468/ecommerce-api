import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../orders/orders.entity";

@Entity({
  name: "users",
})
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  email: string;

  @Column({ type: "char", length: 60 })
  password: string;

  @Column({ type: "bigint" })
  phone: number;

  @Column({ length: 50, nullable: true })
  country: string;

  @Column()
  address: string;

  @Column({ length: 50, nullable: true })
  city: string;

  @Column({ type: "boolean", default: false })
  admin: boolean;

  @Column({ type: "boolean", default: false })
  superAdmin: boolean;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
