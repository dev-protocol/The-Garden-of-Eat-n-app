import React, { useMemo, useState } from "react";
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { MENU } from "../data/menu";
import { MenuItemCard } from "../components/MenuItemCard";
import { CartItem, MenuCategory, MenuItem } from "../models/types";
import { Storage } from "../services/storage";

type Props = NativeStackScreenProps<RootStackParamList, "Menu">;

const CATS: (MenuCategory | "All")[] = ["All", "Starters", "Mains", "Desserts", "Drinks"];

export function MenuScreen({ navigation }: Props) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<MenuCategory | "All">("All");
  const [refresh, setRefresh] = useState(0);

  const cartCount = Storage.getCart().reduce((sum, c) => sum + c.qty, 0);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return MENU.filter((m) => {
      const matchesCat = cat === "All" ? true : m.category === cat;
      const matchesQ =
        !query ||
        m.name.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query);
      return matchesCat && matchesQ;
    });
  }, [q, cat]);

  const addToCart = (item: MenuItem) => {
    const cart = Storage.getCart();
    const idx = cart.findIndex((c) => c.item.id === item.id);
    let next: CartItem[];
    if (idx >= 0) {
      next = cart.map((c, i) => (i === idx ? { ...c, qty: c.qty + 1 } : c));
    } else {
      next = [...cart, { item, qty: 1 }];
    }
    Storage.setCart(next);
    setRefresh((x) => x + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heroTitle}>Welcome 👋</Text>
      <Text style={styles.heroSub}>
        Browse our menu, place orders, reserve a table, and track your order in realtime.
      </Text>

      <View style={styles.row}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search menu..."
          placeholderTextColor="#94a3b8"
          style={styles.input}
        />

        <Pressable style={styles.cartBtn} onPress={() => navigation.navigate("Cart")}>
          <Text style={styles.cartBtnText}>Cart ({cartCount})</Text>
        </Pressable>
      </View>

      <View style={styles.catRow}>
        {CATS.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCat(c as any)}
            style={[styles.chip, cat === c && styles.chipActive]}
          >
            <Text style={[styles.chipText, cat === c && styles.chipTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.secondaryBtn} onPress={() => navigation.navigate("Reservations")}>
          <Text style={styles.secondaryBtnText}>Make Reservation</Text>
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(x) => x.id}
        extraData={refresh}
        renderItem={({ item }) => <MenuItemCard item={item} onAdd={() => addToCart(item)} />}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heroTitle: { color: "white", fontSize: 26, fontWeight: "900" },
  heroSub: { color: "#cbd5e1", marginTop: 6, marginBottom: 14, lineHeight: 20 },
  row: { flexDirection: "row", gap: 10, alignItems: "center" },
  input: {
    flex: 1,
    backgroundColor: "#0f172a",
    borderColor: "#1f2937",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    color: "white",
  },
  cartBtn: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  cartBtnText: { fontWeight: "900", color: "#111827" },
  catRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  chip: {
    borderWidth: 1,
    borderColor: "#1f2937",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#0f172a",
  },
  chipActive: { backgroundColor: "#f59e0b", borderColor: "#f59e0b" },
  chipText: { color: "#e2e8f0", fontWeight: "700", fontSize: 12 },
  chipTextActive: { color: "#111827" },
  actionRow: { marginTop: 12, marginBottom: 6 },
  secondaryBtn: {
    backgroundColor: "#111827",
    borderColor: "#1f2937",
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
  },
  secondaryBtnText: { color: "white", fontWeight: "800", textAlign: "center" },
});
