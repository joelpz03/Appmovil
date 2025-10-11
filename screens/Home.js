import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { signOut } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";

export default function Home() {
  const navigation = useNavigation();
  const videoRef = React.useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require("../assets/logoenpng.png")} style={styles.logo} />
          <Text style={styles.title}>Instituto del Milagro</Text>
          <Text style={styles.subtitle}>Bienvenido a la aplicación institucional</Text>
        </View>

        {/* Video */}
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={require("../assets/isdm-presentacion.mp4")}
            style={styles.video}
            useNativeControls
            resizeMode="cover"
            shouldPlay
            isLooping
          />
        </View>

        {/* Noticias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Noticias</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Inscripciones 2025</Text>
            <Text style={styles.cardText}>
              Ya se encuentran abiertas las inscripciones para el ciclo lectivo 2025.
            </Text>
          </View>
        </View>

        {/* Eventos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eventos próximos</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Acto de fin de curso</Text>
            <Text style={styles.cardText}>Fecha: 20 de diciembre - 18:00 hs</Text>
          </View>
        </View>
      </ScrollView>

      {/* Navbar con íconos */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home-outline" size={26} color="#a40000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Cursos")}>
          <Ionicons name="book-outline" size={26} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={26} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { paddingBottom: 120 },
  header: { alignItems: "center", marginTop: 60, marginBottom: 25 },
  logo: { width: 120, height: 120, resizeMode: "contain", marginBottom: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#222" },
  subtitle: { fontSize: 15, color: "#666", textAlign: "center", marginTop: 4 },
  videoContainer: { alignItems: "center", marginBottom: 30 },
  video: { width: "90%", height: 220, borderRadius: 12 },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10, color: "#111" },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#222" },
  cardText: { fontSize: 14, color: "#555" },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
});