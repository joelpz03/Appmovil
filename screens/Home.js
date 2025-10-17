import React, { useRef, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Linking,} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { signOut } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";

export default function Home() {
  const navigation = useNavigation();
  const videoRef = useRef(null);

  // Pausa el video cuando abandonas la pantalla
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (videoRef.current) {
          videoRef.current.pauseAsync();
        }
      };
    }, [])
  );

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pauseAsync();
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  //Función para abrir links externos
  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("No se pudo abrir el enlace:", err)
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../assets/logoenpng.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Instituto del Milagro</Text>
          <Text style={styles.subtitle}>
            Bienvenido a la aplicación institucional
          </Text>
        </View>

        {/* Video */}
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={require("../assets/isdm-presentacion.mp4")}
            style={styles.video}
            useNativeControls
            resizeMode="cover"
            shouldPlay={false}
            isLooping
          />
        </View>

        {/* Menú Principal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menú Principal</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink("https://institutodelmilagro.com/campus/mod/page/view.php?id=12106")}
          >
            <Ionicons name="document-text-outline" size={22} color="#007B8F" />
            <Text style={styles.menuText}>Métodos de pago</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink("https://institutodelmilagro.com/campus/mod/page/view.php?id=12157")}
          >
            <Ionicons name="newspaper-outline" size={22} color="#007B8F" />
            <Text style={styles.menuText}>Reglamento y Resoluciones</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink("https://institutodelmilagro.com/campus/mod/page/view.php?id=349")}
          >
            <Ionicons name="information-circle-outline" size={22} color="#007B8F" />
            <Text style={styles.menuText}>Instructivos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink("https://institutodelmilagro.com/campus/mod/page/view.php?id=56598")}
          >
            <Ionicons name="link-outline" size={22} color="#007B8F" />
            <Text style={styles.menuText}>Cronograma / WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Noticias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Noticias</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Inscripciones 2025</Text>
            <Text style={styles.cardText}>
              Ya se encuentran abiertas las inscripciones para el ciclo lectivo
              2025.
            </Text>
          </View>
        </View>

        {/* Eventos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eventos próximos</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Acto de fin de curso</Text>
            <Text style={styles.cardText}>
              Fecha: 20 de diciembre - 18:00 hs
            </Text>
          </View>
        </View>

        {/* Footer estático */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Instituto Superior del Milagro</Text>
          <Text style={styles.footerSubtext}>© 2025</Text>
        </View>
      </ScrollView>

      {/* Navbar fija */}
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
  scroll: { paddingBottom: 76 },
  header: { alignItems: "center", marginTop: 60, marginBottom: 25 },
  logo: { width: 120, height: 120, resizeMode: "contain", marginBottom: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#222" },
  subtitle: { fontSize: 15, color: "#666", textAlign: "center", marginTop: 4 },
  videoContainer: { alignItems: "center", marginBottom: 30 },
  video: { width: "90%", height: 220, borderRadius: 12 },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f9fa",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
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
  footer: {
    backgroundColor: "#444",
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 20,
  },
  footerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  footerSubtext: {
    color: "#ccc",
    fontSize: 12,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});