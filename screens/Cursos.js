import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../src/config/firebaseConfig";

export default function Cursos() {
  const navigation = useNavigation();
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <ScrollView  contentContainerStyle={styles.scroll} scrollEnabled={carreras.length > 0} bounces={false}>
        {carreras.length === 0 ? (
          <Text style={{ color: "#666", marginTop: 40 }}>
            No hay carreras registradas.
          </Text>
        ) : (
          carreras.map((carrera) => (
            <TouchableOpacity
              key={carrera.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("CarreraDetalle", { id: carrera.id })}
            >
              {/* Imagen */}
              {carrera.imagen ? (
                <Image source={{ uri: carrera.imagen }} style={styles.image} />
              ) : null}

              {/* Título */}
              <Text style={styles.title}>{carrera.titulo}</Text>

              {/* Duración */}
              {carrera.duracion ? (
                <Text style={styles.description}>
                  Duración:{" "}
                  {String(carrera.duracion)
                    .toLowerCase()
                    .includes("año")
                    ? carrera.duracion
                    : `${carrera.duracion} años`}
                </Text>
              ) : (
                <Text style={styles.description}>Duración no especificada</Text>
              )}

              {/* Botón editar */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("EditCarrera", { id: carrera.id })}
                >
                  <Ionicons name="create-outline" size={22} color="#800000" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: 5,
  },
  actionRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 10,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});