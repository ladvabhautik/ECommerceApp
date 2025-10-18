export type UserRole = 'admin' | 'seller' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Product {
  id: string;
  seller_id: string;
  seller_name: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}