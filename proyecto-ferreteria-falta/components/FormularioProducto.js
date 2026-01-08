import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";

export default function FormularioProducto({ productoInicial, onGuardar, onCancelar }) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    category: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    if (productoInicial) {
      setForm({
        name: productoInicial.name || "",
        code: productoInicial.code || "",
        category: productoInicial.category || "",
        price: String(productoInicial.price ?? ""),
        stock: String(productoInicial.stock ?? ""),
      });
    } else {
      setForm({ name: "", code: "", category: "", price: "", stock: "" });
    }
  }, [productoInicial]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    onGuardar({
      name: form.name,
      code: form.code,
      category: form.category,
      price: Number(form.price || 0),
      stock: Number(form.stock || 0),
    });
  };

  return (
    <View style={styles.container}>
      <Title>{productoInicial ? "Editar producto" : "Nuevo producto"}</Title>

      <TextInput label="Nombre" value={form.name} onChangeText={(v) => handleChange("name", v)} style={styles.input} />
      <TextInput label="Código" value={form.code} onChangeText={(v) => handleChange("code", v)} style={styles.input} />
      <TextInput label="Categoría" value={form.category} onChangeText={(v) => handleChange("category", v)} style={styles.input} />

      <TextInput
        label="Precio"
        value={form.price}
        onChangeText={(v) => handleChange("price", v)}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Stock"
        value={form.stock}
        onChangeText={(v) => handleChange("stock", v)}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.actions}>
        <Button mode="text" onPress={onCancelar}>Cancelar</Button>
        <Button mode="contained" onPress={handleSubmit}>
          {productoInicial ? "Actualizar" : "Guardar"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: "white", borderRadius: 8, marginBottom: 12 },
  input: { marginBottom: 10 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 6 },
});

