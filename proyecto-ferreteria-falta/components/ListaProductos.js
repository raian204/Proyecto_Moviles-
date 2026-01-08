import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { List, Avatar, Button } from "react-native-paper";

export default function ListaProductos({ productos, onSelect, onEditar, onEliminar }) {
  const renderItem = ({ item }) => {
    const nombre = (item.name || "Producto").toString();
    const letra = nombre.trim().length ? nombre.trim()[0].toUpperCase() : "?";
    const stock = Number(item.stock || 0);
    const price = Number(item.price || 0);

    return (
      <List.Item
        title={nombre}
        description={`Código: ${item.code || "-"} | Stock: ${stock} | Precio: S/ ${price.toFixed(2)}`}
        left={() => <Avatar.Text size={44} label={letra} />}
        right={() => (
          <View style={styles.buttons}>
            <Button compact onPress={() => onEditar(item)}>Editar</Button>
            <Button compact textColor="#e44" onPress={() => onEliminar(item.id)}>Eliminar</Button>
          </View>
        )}
        onPress={() => onSelect(item)}
        style={styles.item}
      />
    );
  };

  return (
    <FlatList
      data={productos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  item: { borderBottomWidth: 0.5, borderBottomColor: "#ddd" },
  buttons: { flexDirection: "row", alignItems: "center", marginRight: 8 },
});
