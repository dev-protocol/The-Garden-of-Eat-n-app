import React, { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Storage } from "../services/storage";
import { CartItem } from "../models/types";

type Props = NativeStackScreenProps<RootStackParamList, "Cart">;

export function CartScreen({ navigation }: Props) {
  const [refresh, setRefresh] = useState(0);

  const cart = Storage.getCart();
  const total = cart.reduce((sum, c) => sum + c.qty * c.item.price, 0);

  const inc = (id: string) => {
    Storage.setCart(
      cart.map((c) => (c.item.id === id ? { ...c, qty: c.qty + 1 } : c))
    );
    setRefresh((x) => x + 1);
  };

  const dec = (id: string) => {
    const next = cart
      .map((c) => (c.item.id === id ? { ...c, qty: Math.max(0, c.qty - 1) } : c))
      .filter((c) => c.qty > 0);
    Storage.setCart(next);
    setRefresh((x) => x + 1);
  };

  const clear = () => {
    Storage.setCart([]);
    setRefresh((x) => x + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {cart.length === 0 ? (
        <Text style={styles.empty}>Cart is empty. Add items from Menu.</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            extraData={refresh}
            keyExtractor={(x) => x.item.id}
            renderItem={({ item }: { item: CartItem }) => (
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.item.name}</Text>
                  <Text style={styles.itemMeta}>
                    {item.item.price.toLocaleString()} RWF × {item.qty}
                  </Text>
                </View>

                <View style={styles.qtyBox}>
                  <Pressable onPress={() => dec(item.item.id)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>−</Text>
                  </Pressable>
                  <Text style={styles.qty}>{item.qty}</Text>
                  <Pressable onPress={() => inc(item.item.id)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>＋</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />

          <View style={styles.footer}>
            <Text style={styles.total}>Total: {total.toLocaleString()} RWF</Text>
            <Pressable
              style={styles.primaryBtn}
              onPress={() => navigation.navigate("Checkout")}
            >
              <Text style={styles.primaryBtnText}>Proceed to Checkout</Text>
            </Pressable>

            <Pressable style={styles.secondaryBtn} onPress={clear}>
              <Text style={styles.secondaryBtnText}>Clear Cart</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { color: "white", fontSize: 22, fontWeight: "900", marginBottom: 10 },
  empty: { color: "#cbd5e1", marginTop: 10 },
  row: {
    backgroundColor: "#111827",
    borderColor: "#1f2937",
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemName: { color: "white", fontWeight: "800" },
  itemMeta: { color: "#cbd5e1", marginTop: 4 },
  qtyBox: { flexDirection: "row", alignItems: "center", gap: 10 },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  qtyBtnText: { color: "white", fontSize: 18, fontWeight: "900" },
  qty: { color: "white", fontWeight: "900", minWidth: 16, textAlign: "center" },
  footer: { marginTop: 10, gap: 10 },
  total: { color: "#f59e0b", fontWeight: "900", fontSize: 16 },
  primaryBtn: {
    backgroundColor: "#f59e0b",
    padding: 12,
    borderRadius: 12,
  },
  primaryBtnText: { color: "#111827", fontWeight: "900", textAlign: "center" },
  secondaryBtn: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1f2937",
    padding: 12,
    borderRadius: 12,
  },
  secondaryBtnText: { color: "white", fontWeight: "800", textAlign: "center" },
});
