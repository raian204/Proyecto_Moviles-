import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Title, TextInput, Button, Paragraph } from "react-native-paper";

export default function FormularioMovimiento({ producto, tipo, onGuardar, onCancelar }) {
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    setQuantity("");
    setPrice(producto ? String(producto.price ?? "") : "");
  }, [producto, tipo]);

  const handleSubmit = () => {
    const q = Number(quantity || 0);
    if (!q || q <= 0) return;

    if (tipo === "salida") {
      const p = Number(price || 0);
      if (p <= 0) return;
      onGuardar({ type: "salida", quantity: q, price: p });
      return;
    }

    onGuardar({ type: "entrada", quantity: q, price: 0 });
  };

  if (!producto) return null;

  return (
    <View style={styles.container}>
      <Title>{tipo === "salida" ? "Registrar venta" : "Registrar entrada"}</Title>
      <Paragraph>Producto: {producto.name}</Paragraph>
      <Paragraph>Stock actual: {Number(producto.stock || 0)}</Paragraph>

      <TextInput
        label="Cantidad"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />

      {tipo === "salida" && (
        <TextInput
          label="Precio de venta"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />
      )}

      <View style={styles.actions}>
        <Button mode="text" onPress={onCancelar}>Cancelar</Button>
        <Button mode="contained" onPress={handleSubmit}>Guardar</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: "white", borderRadius: 8, marginBottom: 12 },
  input: { marginTop: 10 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 12 },
});
