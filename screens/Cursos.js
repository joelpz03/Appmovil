import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";

const cursos = [
  { id: "1", titulo: "Profesorado de Educación Especial", duracion: "4 años", imagen: require("../assets/edc-especial.jpg") },
  { id: "2", titulo: "Profesorado de Educación Primaria", duracion: "4 años", imagen: require("../assets/edc-primaria.jpg") },
  { id: "3", titulo: "Profesorado de Inglés", duracion: "4 años", imagen: require("../assets/leccion-de-ingles.jpg") },
  { id: "4", titulo: "Profesorado de Educación Inicial", duracion: "4 años", imagen: require("../assets/educacioninicial.jpg") },
  { id: "5", titulo: "Psicopedagogía", duracion: "4 años", imagen: require("../assets/psicopedagogia.jpg") },
  { id: "6", titulo: "Tecnicatura en Análisis de Sistemas", duracion: "2 años", imagen: require("../assets/analisissistemas.jpg") },
];

export default function Cursos() {
  return (
    <View style={styles.container}>
      <FlatList
        data={cursos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.imagen} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.titulo}</Text>
              <Text style={styles.subtitle}>Duración: {item.duracion}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 10 },
  card: { backgroundColor: "#fff", borderRadius: 10, marginBottom: 15, overflow: "hidden", elevation: 3 },
  image: { height: 150, width: "100%" },
  cardContent: { padding: 10 },
  title: { fontSize: 16, fontWeight: "bold" },
  subtitle: { color: "#666" },
});