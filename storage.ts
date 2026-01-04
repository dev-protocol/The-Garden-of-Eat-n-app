import { CartItem, Order, Reservation } from "../models/types";

let cart: CartItem[] = [];
let orders: Order[] = [];
let reservations: Reservation[] = [];

export const Storage = {
  // CART
  getCart: () => cart,
  setCart: (c: CartItem[]) => {
    cart = c;
  },

  // ORDERS
  getOrders: () => orders,
  addOrder: (o: Order) => {
    orders = [o, ...orders];
  },
  updateOrder: (id: string, partial: Partial<Order>) => {
    orders = orders.map((o) => (o.id === id ? { ...o, ...partial } : o));
  },
  getOrderById: (id: string) => orders.find((o) => o.id === id),

  // RESERVATIONS
  getReservations: () => reservations,
  addReservation: (r: Reservation) => {
    reservations = [r, ...reservations];
  },
};
