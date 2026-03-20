import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Storage } from "../services/storage";
import { Order } from "../models/types";
import { Realtime } from "../services/realtime";

type Props = NativeStackScreenProps<RootStackParamList, "Checkout">;

function uid(prefix = "ord") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function CheckoutScreen({ navigation }: Props) {
  const cart = Storage.getCart();
  const total = useMemo(() => cart.reduce((s, c) => s + c.qty * c.item.price, 0), [cart]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const placeOrder = () => {
    if (cart.length === 0) {
      Alert.alert("Cart empty", "Please add items to cart first.");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Missing info", "Please provide your name and phone.");
      return;
    }

    const order: Order = {
      id: uid(),
      createdAt: Date.now(),
      items: cart,
      total,
      status: "Placed",
    };

    Storage.addOrder(order);
    Storage.setCart([]);

    // start realtime updates
    Realtime.startOrderStatusUpdates(order.id);

    navigation.replace("OrderTracking", { orderId: order.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.meta}>Total: {total.toLocaleString()} RWF</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Customer name"
        placeholderTextColor="#94a3b8"
        style={styles.input}
      />
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone number"
        keyboardType="phone-pad"
        placeholderTextColor="#94a3b8"
        style={styles.input}
      />
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Note (optional) e.g., no onions"
        placeholderTextColor="#94a3b8"
        style={[styles.input, { height: 90 }]}
        multiline
      />

      <Pressable style={styles.primaryBtn} onPress={placeOrder}>
        <Text style={styles.primaryBtnText}>Place Order</Text>
      </Pressable>

      <Text style={styles.tip}>
        Realtime status updates will appear immediately after placing the order.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { color: "white", fontSize: 22, fontWeight: "900" },
  meta: { color: "#f59e0b", marginTop: 8, marginBottom: 14, fontWeight: "900" },
  input: {
    backgroundColor: "#0f172a",
    borderColor: "#1f2937",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    color: "white",
    marginBottom: 10,
  },
  primaryBtn: { backgroundColor: "#f59e0b", padding: 12, borderRadius: 12, marginTop: 6 },
  primaryBtnText: { color: "#111827", fontWeight: "900", textAlign: "center" },
  tip: { color: "#cbd5e1", marginTop: 12, lineHeight: 20 },
});
