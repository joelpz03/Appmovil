import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Cursos() {
  const navigation = useNavigation();

  const courses = [
    {
      id: 1,
      name: "Programación I",
      description: "Aprendé lógica de programación desde cero.",
      image: require("../assets/analisissistemas.jpg"),
    },
    {
      id: 2,
      name: "Educación Primaria",
      description: "Educación Primaria.",
      image: require("../assets/edc-primaria.jpg"),
    },
    {
      id: 3,
      name: "Educación Inicial",
      description: "Educación Inicial.",
      image: require("../assets/educacioninicial.jpg"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* 🔙 Botón fijo para volver al Home */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="arrow-back-outline" size={28} color="#800000" />
        </TouchableOpacity>
        <Text style={styles.header}>Cursos disponibles</Text>
      </View>

      {/* 📜 Scroll del contenido */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {courses.map((course, index) => (
          <View key={`${course.id}-${index}`} style={styles.card}>
            <Image source={course.image} style={styles.image} />
            <Text style={styles.title}>{course.name}</Text>
            <Text style={styles.description}>{course.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fixedHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#fff",
    elevation: 4, // sombra ligera
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#800000",
    marginLeft: 15,
  },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
    paddingTop: 15,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#800000",
  },
  description: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: 5,
  },
});