import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { firestore } from "../src/config/firebaseConfig";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";

export default function CarrerasList({ navigation }) {
  const [carreras, setCarreras] = useState([]);

  useEffect(() => {
    const col = collection(firestore, "carreras");
    const unsub = onSnapshot(col, (snap) => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setCarreras(arr);
    });
    return () => unsub();
  }, []);

  const confirmDelete = (id) => {
    Alert.alert("Confirmar", "¿Eliminar esta carrera?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try {
          await deleteDoc(doc(firestore, "carreras", id));
          Alert.alert("Eliminado", "Carrera eliminada correctamente.");
        } catch (err) {
          Alert.alert("Error", err.message);
        }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carreras</Text>

      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("AddCarrera")}>
        <Text style={styles.addBtnText}>Agregar carrera</Text>
      </TouchableOpacity>

      <FlatList
        data={carreras}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardSub}>Duración: {item.duracion}</Text>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => navigation.navigate("EditCarrera", { id: item.id })}>
                <Text style={styles.edit}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                <Text style={styles.delete}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", color: "#800000", marginBottom: 12 },
  addBtn: { backgroundColor: "#800000", padding: 10, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  addBtnText: { color: "#fff", fontWeight: "700" },
  card: { backgroundColor: "#f6f6f6", padding: 12, borderRadius: 8, marginBottom: 10, flexDirection: "row", alignItems: "center" },
  cardTitle: { fontWeight: "700", fontSize: 16 },
  cardSub: { color: "#666" },
  buttons: { flexDirection: "row", gap: 12 },
  edit: { color: "#1a73e8", marginRight: 12 },
  delete: { color: "red" }
});