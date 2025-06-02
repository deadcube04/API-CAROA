export class Cart {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  totalPrice: number;
  status: string;
  items?: CartItem[];
}

export class CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  size: string;
}
