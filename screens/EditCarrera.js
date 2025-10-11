import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { firestore } from "../src/config/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export default function EditCarrera({ route, navigation }) {
  const { id } = route.params;
  const [titulo, setTitulo] = useState("");
  const [duracion, setDuracion] = useState("");

  useEffect(() => {
    const load = async () => {
      const d = await getDoc(doc(firestore, "carreras", id));
      if (d.exists()) {
        const data = d.data();
        setTitulo(data.titulo || "");
        setDuracion(data.duracion || "");
      }
    };
    load();
  }, [id]);

  const handleSave = () => {
    Alert.alert("Guardar cambios", "¿Guardar los cambios?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Guardar", onPress: async () => {
        try {
          await updateDoc(doc(firestore, "carreras", id), { titulo, duracion });
          Alert.alert("Guardado", "Cambios guardados.");
          navigation.goBack();
        } catch (err) {
          Alert.alert("Error", err.message);
        }
      }}
    ]);
  };

  const handleDelete = () => {
    Alert.alert("Eliminar", "¿Seguro que querés eliminar esta carrera?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try {
          await deleteDoc(doc(firestore, "carreras", id));
          Alert.alert("Eliminado", "Carrera eliminada.");
          navigation.goBack();
        } catch (err) {
          Alert.alert("Error", err.message);
        }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Carrera</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Título" />
      <TextInput style={styles.input} value={duracion} onChangeText={setDuracion} placeholder="Duración" />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteText}>Eliminar carrera</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  title: { color: "#800000", fontSize: 20, fontWeight: "700", marginBottom: 10 },
  input: { backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: "#800000", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
  deleteBtn: { marginTop: 12, alignItems: "center" },
  deleteText: { color: "red", fontWeight: "700" }
});