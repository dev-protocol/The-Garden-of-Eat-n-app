import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Storage } from "../services/storage";
import { OrderStatus } from "../models/types";

type Props = NativeStackScreenProps<RootStackParamList, "OrderTracking">;

function statusLabel(s: OrderStatus) {
  switch (s) {
    case "Placed":
      return "Order placed ✅";
    case "Confirmed":
      return "Confirmed by restaurant ☎️";
    case "Preparing":
      return "Preparing your meal 🍳";
    case "Ready":
      return "Ready for pickup 🚀";
    case "OutForDelivery":
      return "Out for delivery 🛵";
    case "Delivered":
      return "Delivered 🎉";
    case "Cancelled":
      return "Cancelled ❌";
    default:
      return s;
  }
}

export function OrderTrackingScreen({ route, navigation }: Props) {
  const { orderId } = route.params;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 700);
    return () => clearInterval(t);
  }, []);

  const order = Storage.getOrderById(orderId);

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Order not found</Text>
        <Pressable style={styles.btn} onPress={() => navigation.navigate("Menu")}>
          <Text style={styles.btnText}>Back to Menu</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Realtime Order Status</Text>
      <Text style={styles.orderId}>Order ID: {order.id}</Text>

      <View style={styles.card}>
        <Text style={styles.big}>{statusLabel(order.status)}</Text>
        <Text style={styles.small}>
          Total: {order.total.toLocaleString()} RWF • Items:{" "}
          {order.items.reduce((s, i) => s + i.qty, 0)}
        </Text>
      </View>

      <Text style={styles.note}>
        (This demo updates status automatically every few seconds. Replace with WebSocket/Firebase later.)
      </Text>

      <Pressable style={styles.btn} onPress={() => navigation.navigate("Menu")}>
        <Text style={styles.btnText}>Back to Menu</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { color: "white", fontSize: 22, fontWeight: "900" },
  orderId: { color: "#cbd5e1", marginTop: 8 },
  card: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  big: { color: "#f59e0b", fontWeight: "900", fontSize: 18 },
  small: { color: "#cbd5e1", marginTop: 10 },
  note: { color: "#94a3b8", marginTop: 14, lineHeight: 20 },
  btn: { marginTop: 16, backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#1f2937", padding: 12, borderRadius: 12 },
  btnText: { color: "white", fontWeight: "900", textAlign: "center" },
});
