import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions } from "@react-navigation/native";
import { Appbar, ActivityIndicator, List, Title } from "react-native-paper";

export default function MovimientosScreen({ navigation, loading, movimientos }) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Appbar.Header style={{ paddingTop: 8 }}>
        <Appbar.Action
          icon="menu"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
        <Appbar.Content title="Movimientos" />
      </Appbar.Header>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <ScrollView>
          <Title style={styles.title}>Historial</Title>
          {(movimientos || []).map((m) => (
            <List.Item
              key={m.id}
              title={`${m.type === "salida" ? "Venta" : "Entrada"}: ${m.productName || "-"}`}
              description={`Cantidad: ${Number(m.quantity || 0)} | Total: S/ ${Number(m.total || 0).toFixed(2)}`}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 12, marginLeft: 12 },
});

