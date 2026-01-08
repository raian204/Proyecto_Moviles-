import React from "react";
import { StyleSheet } from "react-native";
import { Card, Paragraph, Avatar, Button } from "react-native-paper";

export default function DetalleProducto({ producto, onEntrada, onVenta, onEditar, onEliminar }) {
  if (!producto) return null;

  const nombre = (producto.name || "Producto").toString();
  const letra = nombre.trim().length ? nombre.trim()[0].toUpperCase() : "?";

  return (
    <Card style={styles.card}>
      <Card.Title
        title={nombre}
        subtitle={`Categoría: ${producto.category || "General"}`}
        left={() => <Avatar.Text size={44} label={letra} />}
      />
      <Card.Content>
        <Paragraph>Codigo: {producto.code || "-"}</Paragraph>
        <Paragraph>Precio: S/ {Number(producto.price || 0).toFixed(2)}</Paragraph>
        <Paragraph>Stock: {Number(producto.stock || 0)}</Paragraph>
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <Button onPress={onEditar}>Editar</Button>
        <Button textColor="#e44" onPress={onEliminar}>Eliminar</Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 12 },
  actions: { flexWrap: "wrap", justifyContent: "flex-end" },
});
