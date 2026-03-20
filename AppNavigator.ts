import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MenuScreen } from "../screens/MenuScreen";
import { CartScreen } from "../screens/CartScreen";
import { CheckoutScreen } from "../screens/CheckoutScreen";
import { ReservationsScreen } from "../screens/ReservationsScreen";
import { OrderTrackingScreen } from "../screens/OrderTrackingScreen";

export type RootStackParamList = {
  Menu: undefined;
  Cart: undefined;
  Checkout: undefined;
  Reservations: undefined;
  OrderTracking: { orderId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#0b1220" },
        headerTintColor: "#fff",
        contentStyle: { backgroundColor: "#0b1220" },
      }}
    >
      <Stack.Screen name="Menu" component={MenuScreen} options={{ title: "Garden of Eat'n" }} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Place Order" }} />
      <Stack.Screen name="Reservations" component={ReservationsScreen} options={{ title: "Reservations" }} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} options={{ title: "Order Status" }} />
    </Stack.Navigator>
  );
}
