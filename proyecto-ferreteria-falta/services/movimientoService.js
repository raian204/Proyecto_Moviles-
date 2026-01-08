import { api } from "../api/axios";

export async function obtenerMovimientos() {
  const { data } = await api.get("/movimientos");
  return data;
}

export async function crearMovimiento(payload) {
  const safe = {
    productId: (payload.productId || "").toString(),
    productName: (payload.productName || "").toString(),
    type: (payload.type || "entrada").toString(),
    quantity: Number(payload.quantity || 0),
    price: Number(payload.price || 0),
    total: Number(payload.total || 0),
    date: payload.date || new Date().toISOString(),
  };

  const { data } = await api.post("/movimientos", safe);
  return data;
}
