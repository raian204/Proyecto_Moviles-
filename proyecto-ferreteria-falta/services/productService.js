import { api } from "../api/axios";

export async function obtenerProductos() {
  const { data } = await api.get("/productos");
  return data;
}

export async function crearProducto(payload) {
  const safe = {
    name: (payload.name || "Sin nombre").toString(),
    code: (payload.code || "").toString(),
    category: (payload.category || "General").toString(),
    price: Number(payload.price || 0),
    stock: Number(payload.stock || 0),
  };

  const { data } = await api.post("/productos", safe);
  return data;
}

export async function actualizarProducto(id, payload) {
  const safe = {
    name: (payload.name || "Sin nombre").toString(),
    code: (payload.code || "").toString(),
    category: (payload.category || "General").toString(),
    price: Number(payload.price || 0),
    stock: Number(payload.stock || 0),
  };

  const { data } = await api.put(`/productos/${id}`, safe);
  return data;
}

export async function eliminarProducto(id) {
  const { data } = await api.delete(`/productos/${id}`);
  return data;
}
