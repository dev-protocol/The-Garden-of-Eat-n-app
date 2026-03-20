import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Storage } from "../services/storage";
import { Reservation } from "../models/types";

type Props = NativeStackScreenProps<RootStackParamList, "Reservations">;

function uid(prefix = "res") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function ReservationsScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("2026-01-05"); // sample default
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState("2");
  const [note, setNote] = useState("");

  const submit = () => {
    const g = Number(guests);
    if (!name.trim() || !phone.trim() || !date.trim() || !time.trim() || !g || g < 1) {
      Alert.alert("Missing info", "Please fill all fields correctly.");
      return;
    }

    const r: Reservation = {
      id: uid(),
      name: name.trim(),
      phone: phone.trim(),
      date: date.trim(),
      time: time.trim(),
      guests: g,
      note: note.trim() || undefined,
    };

    Storage.addReservation(r);
    Alert.alert("Reservation requested ✅", "We will confirm your reservation shortly.");

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reserve a Table</Text>
      <Text style={styles.sub}>Enter details and submit your reservation request.</Text>

      <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor="#94a3b8" style={styles.input} />
      <TextInput value={phone} onChangeText={setPhone} placeholder="Phone number" keyboardType="phone-pad" placeholderTextColor="#94a3b8" style={styles.input} />
      <TextInput value={date} onChangeText={setDate} placeholder="Date (YYYY-MM-DD)" placeholderTextColor="#94a3b8" style={styles.input} />
      <TextInput value={time} onChangeText={setTime} placeholder="Time (HH:mm)" placeholderTextColor="#94a3b8" style={styles.input} />
      <TextInput value={guests} onChangeText={setGuests} placeholder="Guests (e.g., 2)" keyboardType="number-pad" placeholderTextColor="#94a3b8" style={styles.input} />
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Note (optional)"
        placeholderTextColor="#94a3b8"
        style={[styles.input, { height: 90 }]}
        multiline
      />

      <Pressable style={styles.primaryBtn} onPress={submit}>
        <Text style={styles.primaryBtnText}>Submit Reservation</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { color: "white", fontSize: 22, fontWeight: "900" },
  sub: { color: "#cbd5e1", marginTop: 8, marginBottom: 12, lineHeight: 20 },
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
});
