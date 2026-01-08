import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions } from "@react-navigation/native";
import { Appbar, ActivityIndicator, Button, Snackbar, Title, Paragraph } from "react-native-paper";

import ListaProductos from "../components/ListaProductos";
import FormularioProducto from "../components/FormularioProducto";
import DetalleProducto from "../components/DetalleProducto";
import FormularioMovimiento from "../components/FormularioMovimiento";

export default function ProductosScreen({
  navigation,
  loading,
  productos,
  totalVendido,
  stockBajoCount,
  crearProductoFn,
  actualizarProductoFn,
  eliminarProductoFn,
  crearMovimientoFn,
}) {
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [moveTipo, setMoveTipo] = useState(null);
  const [showMoveForm, setShowMoveForm] = useState(false);

  const [snack, setSnack] = useState({ visible: false, msg: "" });

  const abrirNuevo = () => {
    setEditing(null);
    setSelected(null);
    setShowForm(true);
    setShowMoveForm(false);
  };

  const abrirEditar = (prod) => {
    setEditing(prod);
    setSelected(prod);
    setShowForm(true);
    setShowMoveForm(false);
  };

  const cancelarForm = () => {
    setEditing(null);
    setShowForm(false);
  };

  const handleGuardarProducto = async (form) => {
    try {
      if (editing) {
        const updated = await actualizarProductoFn(editing.id, form);
        setSelected(updated);
        setSnack({ visible: true, msg: "Producto actualizado" });
      } else {
        await crearProductoFn(form);
        setSnack({ visible: true, msg: "Producto creado" });
      }
      setEditing(null);
      setShowForm(false);
    } catch (e) {
      setSnack({ visible: true, msg: "Error al guardar" });
    }
  };

  const handleEliminarProducto = async (id) => {
    try {
      await eliminarProductoFn(id);
      if (selected && selected.id === id) setSelected(null);
      if (editing && editing.id === id) setEditing(null);
      setSnack({ visible: true, msg: "Producto eliminado" });
    } catch (e) {
      setSnack({ visible: true, msg: "Error al eliminar" });
    }
  };

  const confirmarEliminarProducto = (id) => {
    Alert.alert(
      "Eliminar producto",
      "¿Seguro que deseas eliminar este producto?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => handleEliminarProducto(id) },
      ],
      { cancelable: true }
    );
  };

  const abrirMovimiento = (tipo) => {
    if (!selected) return;
    setMoveTipo(tipo);
    setShowMoveForm(true);
    setShowForm(false);
  };

  const cancelarMovimiento = () => {
    setMoveTipo(null);
    setShowMoveForm(false);
  };

  const handleGuardarMovimiento = async ({ type, quantity, price }) => {
    if (!selected) return;

    const stockActual = Number(selected.stock || 0);
    const q = Number(quantity || 0);


    if (type === "salida" && q > stockActual) {
      setSnack({ visible: true, msg: "No hay stock suficiente" });
      return;
    }

    const newStock = type === "entrada" ? stockActual + q : stockActual - q;
    const total = type === "salida" ? Number(price || 0) * q : 0;

    try {
      await crearMovimientoFn({
        productId: selected.id,
        productName: selected.name,
        type,
        quantity: q,
        price: Number(price || 0),
        total,
      });

      const updatedProd = await actualizarProductoFn(selected.id, {
        name: selected.name,
        code: selected.code,
        category: selected.category,
        price: Number(selected.price || 0),
        stock: newStock,
      });

      setSelected(updatedProd);
      setSnack({ visible: true, msg: type === "salida" ? "Venta registrada" : "Entrada registrada" });
      setMoveTipo(null);
      setShowMoveForm(false);
    } catch (e) {
      setSnack({ visible: true, msg: "Error al registrar movimiento" });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Appbar.Header style={{ paddingTop: 8 }}>
        <Appbar.Action
          icon="menu"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
        <Appbar.Content title="Inventario Ferretería San Martín" />
      </Appbar.Header>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={[styles.container, {paddingBottom: 120 }]}>
          <View style={{ marginBottom: 10 }}>
            <Button mode="contained" onPress={abrirNuevo}>Nuevo producto</Button>
          </View>

          {showForm && (
            <FormularioProducto
              productoInicial={editing}
              onGuardar={handleGuardarProducto}
              onCancelar={cancelarForm}
            />
          )}

          {showMoveForm && (
            <FormularioMovimiento
              producto={selected}
              tipo={moveTipo}
              onGuardar={handleGuardarMovimiento}
              onCancelar={cancelarMovimiento}
            />
          )}

          <Title style={styles.title}>Reporte simple</Title>
          <Paragraph>Total vendido: S/ {Number(totalVendido).toFixed(2)}</Paragraph>
          <Paragraph>Stock bajo (menor o igual a 5): {stockBajoCount}</Paragraph>

          <Title style={styles.title}>Productos</Title>
          <ListaProductos
            productos={productos}
            onSelect={setSelected}
            onEditar={abrirEditar}
            onEliminar={confirmarEliminarProducto}
          />

          <DetalleProducto
            producto={selected}
            onEntrada={() => abrirMovimiento("entrada")}
            onVenta={() => abrirMovimiento("salida")}
            onEditar={() => selected && abrirEditar(selected)}
            onEliminar={() => selected && confirmarEliminarProducto(selected.id)}
          />
        </ScrollView>
      )}

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
  title: { marginTop: 14, marginBottom: 6 },
});

