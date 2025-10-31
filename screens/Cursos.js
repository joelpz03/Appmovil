import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { firestore } from "../src/config/firebaseConfig";
import Navbar from "../components/Navbar";
import CustomAlert from "../components/CustomAlert";

export default function Cursos() {
  const navigation = useNavigation();
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastOffset = useRef(0);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "",
    onConfirm: null,
    onCancel: null,
  });

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > lastOffset.current ? "down" : "up";
    lastOffset.current = currentOffset;
    setShowNavbar(direction !== "down");
  };

  const cargarCarreras = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, "carreras"));
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCarreras(data);
    } catch (err) {
      console.error("Error al cargar carreras:", err);
      Alert.alert("Error", "No se pudieron cargar las carreras.");
    } finally {
      setLoading(false);
    }
  };

  const eliminarCarrera = (id) => {
  setAlertConfig({
    visible: true,
    title: "Eliminar carrera",
    message: "¿Seguro que deseas eliminar esta carrera?",
    type: "confirm",
    showCancel: true,
    confirmText: "Eliminar",
    cancelText: "Cancelar",
    onConfirm: async () => {
      try {
        await deleteDoc(doc(firestore, "carreras", id));
        setCarreras((prev) => prev.filter((c) => c.id !== id));
        setAlertConfig({
          visible: true,
          title: "Éxito",
          message: "Carrera eliminada correctamente.",
          type: "success",
          onConfirm: () => setAlertConfig({ visible: false }),
        });
      } catch (err) {
        console.error("Error al eliminar carrera:", err);
        setAlertConfig({
          visible: true,
          title: "Error",
          message: "No se pudo eliminar la carrera.",
          type: "error",
          onConfirm: () => setAlertConfig({ visible: false }),
        });
      }
    },
    onClose: () => setAlertConfig({ visible: false }),
  });
};

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", cargarCarreras);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#800000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="arrow-back-outline" size={28} color="#800000" />
        </TouchableOpacity>

        <Text style={styles.header}>Carreras disponibles</Text>

        {/* Botón agregar carrera */}
        <TouchableOpacity onPress={() => navigation.navigate("AddCarrera")}>
          <Ionicons name="add-circle-outline" size={30} color="#800000" />
        </TouchableOpacity>
      </View>

      {/* Lista de carreras */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        scrollEnabled={carreras.length > 0}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {carreras.length === 0 ? (
          <Text style={{ color: "#666", marginTop: 40 }}>
            No hay carreras registradas.
          </Text>
        ) : (
          carreras.map((carrera) => (
            <TouchableOpacity
              key={carrera.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("CarreraDetalle", { id: carrera.id })
              }
            >
              {/* Imagen */}
              {carrera.imagen ? (
                <Image source={{ uri: carrera.imagen }} style={styles.image} />
              ) : null}

              {/* Título */}
              <Text style={styles.title}>{carrera.titulo}</Text>

              {/* Duración */}
              <Text style={styles.description}>
                Duración:{" "}
                {carrera.duracion
                  ? String(carrera.duracion)
                      .toLowerCase()
                      .includes("año")
                    ? carrera.duracion
                    : `${carrera.duracion} años`
                  : "No especificada"}
              </Text>

              {/* Acciones */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EditCarrera", { id: carrera.id })
                  }
                >
                  <Ionicons name="create-outline" size={22} color="#800000" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => eliminarCarrera(carrera.id)}>
                  <Ionicons name="trash-outline" size={22} color="#b30000" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* CustomAlert */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        showCancel={alertConfig.showCancel}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onClose={alertConfig.onClose}
      />

      <Navbar visible={showNavbar} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  fixedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#800000",
  },
  scroll: {
    alignItems: "center",
    paddingVertical: 20,
    paddingTop: 15,
    minHeight: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#800000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e0dcdc",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#800000",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 5,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 25,
    marginTop: 12,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});