import "react-native-gesture-handler";
import React, { useEffect, useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { Provider as PaperProvider, Drawer as PaperDrawer } from "react-native-paper";

import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } from "./services/productService";
import { obtenerMovimientos, crearMovimiento } from "./services/movimientoService";

import ProductosScreen from "./screens/ProductosScreen";
import MovimientosScreen from "./screens/MovimientosScreen";
import ReporteScreen from "./screens/ReporteScreen";
import EntradaScreen from "./screens/EntradaScreen";
import VentaScreen from "./screens/VentaScreen";


const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { state, navigation } = props;
  const activeRoute = state.routeNames[state.index];

  return (
    <DrawerContentScrollView {...props}>
      <PaperDrawer.Section>
        <PaperDrawer.Item
          label="Inicio"
          active={activeRoute === "Inicio"}
          onPress={() => navigation.navigate("Inicio")}
        />
        <PaperDrawer.Item
          label="Movimientos"
          active={activeRoute === "Movimientos"}
          onPress={() => navigation.navigate("Movimientos")}
        />
        <PaperDrawer.Item
          label="Reporte"
          active={activeRoute === "Reporte"}
          onPress={() => navigation.navigate("Reporte")}
        />
        </PaperDrawer.Section>
        <PaperDrawer.Item
          label="Entrada"
          active={activeRoute === "Entrada"}
          onPress={() => navigation.navigate("Entrada")}
        />
      <PaperDrawer.Item
  label="Venta"
  active={activeRoute === "Venta"}
  onPress={() => navigation.navigate("Venta")}
/>

    </DrawerContentScrollView>
  );
}

export default function App() {
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    setLoading(true);
    try {
      const [prods, movs] = await Promise.all([obtenerProductos(), obtenerMovimientos()]);
      setProductos(prods || []);
      setMovimientos(movs || []);
    } catch (e) {
      setProductos([]);
      setMovimientos([]);
    } finally {
      setLoading(false);
    }
  };

  const crearProductoFn = async (form) => {
    const nuevo = await crearProducto(form);
    setProductos((prev) => [nuevo, ...prev]);
    return nuevo;
  };

  const actualizarProductoFn = async (id, form) => {
    const updated = await actualizarProducto(id, form);
    setProductos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    return updated;
  };

  const eliminarProductoFn = async (id) => {
    await eliminarProducto(id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  const crearMovimientoFn = async (payload) => {
    const mov = await crearMovimiento({ ...payload, date: new Date().toISOString() });
    setMovimientos((prev) => [mov, ...prev]);
    return mov;
  };

  const totalVendido = useMemo(() => {
    return (movimientos || [])
      .filter((m) => m.type === "salida")
      .reduce((acc, m) => acc + Number(m.total || 0), 0);
  }, [movimientos]);

  const stockBajo = useMemo(() => {
    return (productos || []).filter((p) => Number(p.stock || 0) <= 5);
  }, [productos]);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{ headerShown: false }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen name="Inicio">
            {(props) => (
              <ProductosScreen
                {...props}
                loading={loading}
                productos={productos}
                totalVendido={totalVendido}
                stockBajoCount={stockBajo.length}
                crearProductoFn={crearProductoFn}
                actualizarProductoFn={actualizarProductoFn}
                eliminarProductoFn={eliminarProductoFn}
                crearMovimientoFn={crearMovimientoFn}
              />
            )}
          </Drawer.Screen>

          <Drawer.Screen name="Movimientos">
            {(props) => (
              <MovimientosScreen
                {...props}
                loading={loading}
                movimientos={movimientos}
              />
            )}
          </Drawer.Screen>

          <Drawer.Screen name="Reporte">
            {(props) => (
              <ReporteScreen
                {...props}
                loading={loading}
                totalVendido={totalVendido}
                stockBajo={stockBajo}
              />
            )}
            <Drawer.Screen name="Entrada">
  {(props) => (
    <EntradaScreen
      {...props}
      productos={productos}
      actualizarProductoFn={actualizarProductoFn}
      crearMovimientoFn={crearMovimientoFn}
    />
  )}
</Drawer.Screen>

<Drawer.Screen name="Venta">
  {(props) => (
    <VentaScreen
      {...props}
      productos={productos}
      actualizarProductoFn={actualizarProductoFn}
      crearMovimientoFn={crearMovimientoFn}
    />
  )}
</Drawer.Screen>
          </Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

