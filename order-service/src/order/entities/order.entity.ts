// order-service/src/order/entities/order.entity.ts

export class OrderItemEntity {
  id!: string;
  orderId!: string;
  productId!: string;
  name!: string;
  price!: number;
  quantity!: number;
}

export class Order {
  id!: string;
  userId!: string;
  restaurantId!: string;
  restaurantName!: string;
  address!: string;
  deliveryNotes?: string | null; // El "?" ya maneja que pueda ser opcional/undefined
  paymentMethod!: string;
  subtotal!: number;
  deliveryFee!: number;
  total!: number;
  status!: string;
  createdAt!: Date;
  items!: OrderItemEntity[];
}