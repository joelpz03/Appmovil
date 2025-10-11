import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { firestore } from "../src/config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function AddCarrera({ navigation }) {
  const [titulo, setTitulo] = useState("");
  const [duracion, setDuracion] = useState("");

  const handleAdd = () => {
    if (!titulo || !duracion) {
      Alert.alert("Error", "Completá todos los campos.");
      return;
    }

    Alert.alert("Confirmar", "¿Agregar la nueva carrera?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Agregar", onPress: async () => {
        try {
          await addDoc(collection(firestore, "carreras"), { titulo, duracion });
          Alert.alert("Listo", "Carrera agregada.");
          navigation.goBack();
        } catch (err) {
          Alert.alert("Error", err.message);
        }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Carrera</Text>
      <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
      <TextInput style={styles.input} placeholder="Duración (ej: 4 años)" value={duracion} onChangeText={setDuracion} />
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 20, fontWeight: "700", color: "#800000", marginBottom: 8 },
  input: { backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: "#800000", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" }
});