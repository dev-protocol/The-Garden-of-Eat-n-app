import { OrderStatus } from "../models/types";
import { Storage } from "./storage";

const PIPELINE: OrderStatus[] = [
  "Placed",
  "Confirmed",
  "Preparing",
  "Ready",
  "OutForDelivery",
  "Delivered",
];

type Unsubscribe = () => void;

export const Realtime = {
  // Start a fake status update pipeline for an order
  startOrderStatusUpdates(orderId: string): Unsubscribe {
    let i = 0;

    const tick = () => {
      const status = PIPELINE[i] ?? "Delivered";
      Storage.updateOrder(orderId, { status });
      i += 1;

      // stop when delivered/cancelled
      const current = Storage.getOrderById(orderId);
      if (!current || current.status === "Delivered" || current.status === "Cancelled") {
        return;
      }
    };

    // first tick immediately
    tick();

    const interval = setInterval(() => {
      const current = Storage.getOrderById(orderId);
      if (!current) return clearInterval(interval);
      if (current.status === "Delivered" || current.status === "Cancelled") {
        return clearInterval(interval);
      }
      tick();
    }, 3500);

    return () => clearInterval(interval);
  },
};
