import React, { useRef, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Linking, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { auth, firestore } from "../src/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";

const PRIMARY = "#800000";
const { width } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation();
  const videoRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // Noticias desde tu PDF
  const noticias = [
    {
      id: 1,
      tipo: "Administrativas",
      titulo: "Fechas de Exámenes Finales",
      descripcion: "Se han publicado las fechas definitivas de los exámenes de la mesa de Diciembre/Febrero.",
      icon: "notifications-outline"
    },
    {
      id: 2,
      tipo: "Becas / Ayudas",
      titulo: "Apertura de Convocatoria Becas",
      descripcion: "Postulate para el programa de Becas de Apoyo Económico 2026. ¡Cierre el 30/11!",
      icon: "wallet-outline"
    },
    {
      id: 3,
      tipo: "Tecnología / Aulas",
      titulo: "Mejoras en el Aula Virtual",
      descripcion: "La plataforma fue actualizada con nuevas herramientas para docentes y alumnos.",
      icon: "laptop-outline"
    },
    {
      id: 4,
      tipo: "Logros",
      titulo: "Alumna Gana Concurso Provincial",
      descripcion: "Felicitamos a María López por su premio en el Concurso de Diseño.",
      icon: "trophy-outline"
    },
    {
      id: 5,
      tipo: "Recordatorios",
      titulo: "Vencimiento de Cuotas",
      descripcion: "Recordatorio: La cuota de noviembre vence el día 10. Consulte los medios de pago.",
      icon: "card-outline"
    }
  ];

  // Eventos próximos desde el PDF
  const eventos = [
    {
      id: 1,
      tipo: "Académicos",
      titulo: "Seminario de Marketing Digital",
      fecha: "05 de noviembre",
      hora: "19:30 hs",
      ubicacion: "Aula 12B",
      icon: "book-outline"
    },
    {
      id: 2,
      tipo: "Comunitarios",
      titulo: "Colecta de Alimentos",
      fecha: "12 de noviembre",
      hora: "8:00",
      ubicacion: "Entrada Principal",
      icon: "heart-outline"
    },
    {
      id: 3,
      tipo: "Culturales",
      titulo: "Feria de Emprendedores",
      fecha: "25 de noviembre",
      hora: "16:00 a 20:00 hs",
      ubicacion: "Patio de la Institución",
      icon: "bulb-outline"
    },
    {
      id: 4,
      tipo: "Orientación",
      titulo: "Charla de Ingreso 2026",
      fecha: "15 de diciembre",
      hora: "18:00 hs",
      ubicacion: "Vía Zoom (Link en el mail)",
      icon: "chatbubbles-outline"
    },
    {
      id: 5,
      tipo: "Cierres",
      titulo: "Acto de fin de curso",
      fecha: "20 de diciembre",
      hora: "18:00 hs",
      ubicacion: "Sede Principal",
      icon: "school-outline"
    }
  ];

  // Obtener nombre del usuario
  useEffect(() => {
    const loadUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            const nombre = userDoc.data().nombre || "";
            setUserName(nombre);
          }
        } catch (error) {
          console.log("Error al cargar nombre:", error);
        }
      }
    };
    loadUserName();
  }, []);

  // Carousel de noticias
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => 
        prevIndex === noticias.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Carouselde eventos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prevIndex) => 
        prevIndex === eventos.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (videoRef.current) videoRef.current.pauseAsync();
      };
    }, [])
  );

  useEffect(() => {
    return () => {
      if (videoRef.current) videoRef.current.pauseAsync();
    };
  }, []);

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("No se pudo abrir el enlace:", err));
  };

  const handlePrevNews = () => {
    setCurrentNewsIndex(currentNewsIndex === 0 ? noticias.length - 1 : currentNewsIndex - 1);
  };

  const handleNextNews = () => {
    setCurrentNewsIndex(currentNewsIndex === noticias.length - 1 ? 0 : currentNewsIndex + 1);
  };

  const handlePrevEvent = () => {
    setCurrentEventIndex(currentEventIndex === 0 ? eventos.length - 1 : currentEventIndex - 1);
  };

  const handleNextEvent = () => {
    setCurrentEventIndex(currentEventIndex === eventos.length - 1 ? 0 : currentEventIndex + 1);
  };

  const currentNoticia = noticias[currentNewsIndex];
  const currentEvento = eventos[currentEventIndex];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#fff" />
      <ScrollView 
        contentContainerStyle={styles.scroll} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.imageWrapper}>
            <Image 
              source={require("../assets/isdm_logo_expandido.png")} 
              style={styles.headerImage} 
            />
          </View>
          <Text style={styles.greeting}>
            ¡Hola{userName ? `, ${userName}` : ""}!
          </Text>
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
            <Ionicons name="document-text-outline" size={22} color={PRIMARY} />
            <Text style={styles.menuText}>Métodos de pago</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink("https://institutodelmilagro.com/campus/mod/page/view.php?id=12157")}
          >
            <Ionicons name="newspaper-outline" size={22} color={PRIMARY} />
            <Text style={styles.menuText}>Reglamento y Resoluciones</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink("https://institutodelmilagro.com/campus/mod/page/view.php?id=349")}
          >
            <Ionicons name="information-circle-outline" size={22} color={PRIMARY} />
            <Text style={styles.menuText}>Instructivos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink("https://institutodelmilagro.com/campus/mod/page/view.php?id=56598")}
          >
            <Ionicons name="calendar-outline" size={22} color={PRIMARY} />
            <Text style={styles.menuText}>Cronograma / WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Cursos")}>
            <Ionicons name="school-outline" size={22} color={PRIMARY} />
            <Text style={styles.menuText}>Ver Carreras</Text>
          </TouchableOpacity>
        </View>

        {/* Noticias Carousel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Noticias</Text>
          <View style={styles.carouselContainer}>
            <TouchableOpacity onPress={handlePrevNews} style={styles.carouselButton}>
              <Ionicons name="chevron-back" size={24} color={PRIMARY} />
            </TouchableOpacity>

            <View style={styles.card}>
              <Ionicons name={currentNoticia.icon} size={32} color={PRIMARY} style={{ marginBottom: 8 }} />
              <Text style={styles.cardType}>{currentNoticia.tipo}</Text>
              <Text style={styles.cardTitle}>{currentNoticia.titulo}</Text>
              <Text style={styles.cardText}>{currentNoticia.descripcion}</Text>
              
              {/* Indicadores */}
              <View style={styles.indicators}>
                {noticias.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.indicator,
                      index === currentNewsIndex && styles.activeIndicator
                    ]} 
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity onPress={handleNextNews} style={styles.carouselButton}>
              <Ionicons name="chevron-forward" size={24} color={PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Eventos Carousel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eventos próximos</Text>
          <View style={styles.carouselContainer}>
            <TouchableOpacity onPress={handlePrevEvent} style={styles.carouselButton}>
              <Ionicons name="chevron-back" size={24} color={PRIMARY} />
            </TouchableOpacity>

            <View style={styles.card}>
              <Ionicons name={currentEvento.icon} size={32} color={PRIMARY} style={{ marginBottom: 8 }} />
              <Text style={styles.cardType}>{currentEvento.tipo}</Text>
              <Text style={styles.cardTitle}>{currentEvento.titulo}</Text>
              
              <View style={styles.eventInfo}>
                <Ionicons name="calendar-outline" size={18} color={PRIMARY} style={{ marginRight: 6 }} />
                <Text style={styles.eventDate}>{currentEvento.fecha}</Text>
              </View>
              
              <View style={styles.eventInfo}>
                <Ionicons name="time-outline" size={18} color={PRIMARY} style={{ marginRight: 6 }} />
                <Text style={styles.eventDate}>{currentEvento.hora}</Text>
              </View>
              
              <View style={styles.eventInfo}>
                <Ionicons name="location-outline" size={18} color={PRIMARY} style={{ marginRight: 6 }} />
                <Text style={styles.eventDate}>{currentEvento.ubicacion}</Text>
              </View>
              
              {/* Indicadores */}
              <View style={styles.indicators}>
                {eventos.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.indicator,
                      index === currentEventIndex && styles.activeIndicator
                    ]} 
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity onPress={handleNextEvent} style={styles.carouselButton}>
              <Ionicons name="chevron-forward" size={24} color={PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Instituto Superior del Milagro</Text>
          <Text style={styles.footerSubtext}>© 2025</Text>
        </View>
      </ScrollView>

      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff"
  },
  scroll: { 
    flexGrow: 1,
    paddingBottom: 80
  },
  
  header: { 
    alignItems: "center", 
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 24
  },
  imageWrapper: { 
    position: "relative" 
  },
  headerImage: { 
    width: 300, 
    height: 105, 
    resizeMode: "contain", 
    marginBottom: 10
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: PRIMARY,
    textAlign: "center",
    marginBottom: 4
  },
  subtitle: { 
    fontSize: 14, 
    color: "#666", 
    textAlign: "center"
  },
  
  videoContainer: { 
    alignItems: "center", 
    marginBottom: 25,
    paddingHorizontal: 24
  },
  video: { 
    width: "100%", 
    height: 200, 
    borderRadius: 12 
  },
  
  section: { 
    paddingHorizontal: 24, 
    marginBottom: 25
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 12, 
    color: PRIMARY 
  },
  
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  menuText: { 
    marginLeft: 12, 
    fontSize: 15, 
    color: "#333", 
    fontWeight: "500",
    flex: 1
  },
  
  // Carousel
  carouselContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  carouselButton: {
    padding: 8
  },
  
  // Cards
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    elevation: 3,
    minHeight: 180
  },
  cardType: {
    fontSize: 12,
    color: "#999",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 4
  },
  cardTitle: { 
    fontSize: 17, 
    fontWeight: "700", 
    marginBottom: 8, 
    color: PRIMARY 
  },
  cardText: { 
    fontSize: 14, 
    color: "#555",
    lineHeight: 20,
    flex: 1
  },
  
  // Indicadores carousel
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 6
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd"
  },
  activeIndicator: {
    backgroundColor: PRIMARY,
    width: 24
  },
  
  // Eventos
  eventInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderRadius: 6
  },
  eventDate: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
    flex: 1
  },
  
  footer: { 
    backgroundColor: "#560000", 
    alignItems: "center", 
    paddingVertical: 20, 
    marginTop: 20
  },
  footerText: { 
    color: "#fff", 
    fontSize: 14, 
    fontWeight: "600" 
  },
  footerSubtext: { 
    color: "#ccc", 
    fontSize: 12,
    marginTop: 4
  },
});