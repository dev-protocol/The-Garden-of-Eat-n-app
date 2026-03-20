export type MenuCategory = "Starters" | "Mains" | "Desserts" | "Drinks";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image?: string; // optional URL
};

export type CartItem = {
  item: MenuItem;
  qty: number;
};

export type Reservation = {
  id: string;
  name: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  guests: number;
  note?: string;
};

export type OrderStatus =
  | "Placed"
  | "Confirmed"
  | "Preparing"
  | "Ready"
  | "OutForDelivery"
  | "Delivered"
  | "Cancelled";

export type Order = {
  id: string;
  createdAt: number;
  items: CartItem[];
  total: number;
  status: OrderStatus;
};
