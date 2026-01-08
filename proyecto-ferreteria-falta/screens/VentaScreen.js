import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions } from "@react-navigation/native";
import { Appbar, List, Title, Snackbar } from "react-native-paper";

import FormularioMovimiento from "../components/FormularioMovimiento";

export default function VentaScreen({ navigation, productos, actualizarProductoFn, crearMovimientoFn }) {
  const [selected, setSelected] = useState(null);
  const [snack, setSnack] = useState({ visible: false, msg: "" });

  const handleGuardar = async ({ quantity, price }) => {
    if (!selected) return;

    const stockActual = Number(selected.stock || 0);
    const q = Number(quantity || 0);

    if (q > stockActual) {
      setSnack({ visible: true, msg: "No hay stock suficiente" });
      return;
    }

    const p = Number(price || 0);
    const total = p * q;
    const newStock = stockActual - q;

    try {
      await crearMovimientoFn({
        productId: selected.id,
        productName: selected.name,
        type: "salida",
        quantity: q,
        price: p,
        total,
      });

      const updated = await actualizarProductoFn(selected.id, {
        name: selected.name,
        code: selected.code,
        category: selected.category,
        price: Number(selected.price || 0),
        stock: newStock,
      });

      setSelected(updated);
      setSnack({ visible: true, msg: "Venta registrada" });
    } catch (e) {
      setSnack({ visible: true, msg: "Error al guardar" });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <Appbar.Header style={{ paddingTop: 8 }}>
        <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
        <Appbar.Content title="Venta" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <Title style={{ marginBottom: 8 }}>Selecciona un producto</Title>

        {(productos || []).map((p) => (
          <List.Item
            key={p.id}
            title={p.name}
            description={`Stock: ${Number(p.stock || 0)} | Precio: S/ ${Number(p.price || 0).toFixed(2)}`}
            onPress={() => setSelected(p)}
          />
        ))}

        {selected && (
          <View style={{ marginTop: 10 }}>
            <FormularioMovimiento
              producto={selected}
              tipo="salida"
              onGuardar={handleGuardar}
              onCancelar={() => setSelected(null)}
            />
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <Snackbar
        visible={snack.visible}
        onDismiss={() => setSnack({ visible: false, msg: "" })}
        duration={2500}
      >
        {snack.msg}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
});
