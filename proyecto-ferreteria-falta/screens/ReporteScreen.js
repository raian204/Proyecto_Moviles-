import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions } from "@react-navigation/native";
import { Appbar, ActivityIndicator, Title, Paragraph, List } from "react-native-paper";

export default function ReporteScreen({ navigation, loading, totalVendido, stockBajo }) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Appbar.Header style={{ paddingTop: 8 }}>
        <Appbar.Action
          icon="menu"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
        <Appbar.Content title="Reporte" />
      </Appbar.Header>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <ScrollView>
          <Title style={styles.title}>Reporte simple</Title>
          <Paragraph style={styles.text}>Total vendido: S/ {Number(totalVendido).toFixed(2)}</Paragraph>
          <Paragraph style={styles.text}>Productos con stock bajo (menor o igual a 5): {stockBajo.length}</Paragraph>

          <Title style={styles.title}>Stock bajo</Title>
          {stockBajo.map((p) => (
            <List.Item
              key={p.id}
              title={p.name}
              description={`Stock: ${Number(p.stock || 0)} | Precio: S/ ${Number(p.price || 0).toFixed(2)}`}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 12, marginLeft: 12 },
  text: { marginLeft: 12, marginTop: 6 },
});

