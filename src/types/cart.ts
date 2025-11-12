export interface CartItem {
  product_name: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
  stock_available: number;
}
