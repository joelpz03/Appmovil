import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity,} from "react-native";
import { firestore } from "../src/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function CarreraDetalle({ route, navigation }) {
  const { id } = route.params;
  const [carrera, setCarrera] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCarrera = async () => {
      try {
        const ref = doc(firestore, "carreras", id);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          setCarrera(snapshot.data());
        }
      } catch (e) {
        console.error("Error cargando carrera:", e);
      } finally {
        setLoading(false);
      }
    };
    loadCarrera();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#800000" />
      </View>
    );
  }

  if (!carrera) {
    return (
      <View style={styles.center}>
        <Text>No se encontró la carrera.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={28} color="#800000" />
      </TouchableOpacity>

      {carrera.imagen && (
        <Image source={{ uri: carrera.imagen }} style={styles.image} />
      )}

      <Text style={styles.title}>{carrera.titulo}</Text>

      {/* CARDS CON INFO PRINCIPAL */}
      <View style={styles.cardRow}>
        {carrera.duracion && (
          <View style={styles.card}>
            <Ionicons name="time-outline" size={24} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Duración</Text>
            <Text style={styles.cardText}>{carrera.duracion}</Text>
          </View>
        )}
        {carrera.modalidad && (
          <View style={styles.card}>
            <Ionicons name="laptop-outline" size={24} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Modalidad</Text>
            <Text style={styles.cardText}>{carrera.modalidad}</Text>
          </View>
        )}
        {Array.isArray(carrera.turnos) && carrera.turnos.length > 0 && (
          <View style={styles.card}>
            <Ionicons name="time-outline" size={24} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Turnos</Text>
            <Text style={styles.cardText}>{carrera.turnos.length}</Text>
          </View>
        )}
      </View>

      {/* SOBRE LA CARRERA */}
      <Text style={styles.sectionTitle}>Sobre la carrera</Text>
      <Text style={styles.description}>{carrera.descripcion}</Text>

      {/* TURNOS COMO CHIPS */}
      {Array.isArray(carrera.turnos) && carrera.turnos.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Turnos Disponibles</Text>
          <View style={styles.chipsContainer}>
            {carrera.turnos.map((turno, index) => (
              <View key={index} style={styles.chip}>
                <Text style={styles.chipText}>{turno}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* INFORMACIÓN CLAVE */}
      {carrera.informacionClave?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Información Clave</Text>
          {carrera.informacionClave.map((item, index) => (
            <View key={index} style={styles.infoCard}>
              <View style={styles.infoDot} />
              <Text style={styles.infoText}>{item}</Text>
            </View>
          ))}
        </>
      )}

      {/* TAREAS ESPECÍFICAS */}
      {carrera.tareas?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Tareas Específicas</Text>
          <Text style={styles.subtitle}>El egresado estará preparado para:</Text>
          {carrera.tareas.map((item, index) => (
            <View key={index} style={styles.taskItem}>
              <Text style={styles.taskText}>• {item}</Text>
            </View>
          ))}
        </>
      )}

      {/* PLAN DE ESTUDIOS - TABLA */}
      {carrera.planDeEstudios?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Plan de Estudios</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 0.8 }]}>Código</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 2 }]}>Espacio Curricular</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1.2 }]}>Régimen</Text>
            </View>
            {carrera.planDeEstudios.map((materia, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>{materia.codigo}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{materia.espacio}</Text>
                <Text style={[styles.tableCell, { flex: 1.2 }]}>{materia.regimen}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 30,
  },
  back: {
    marginBottom: 15,
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#800000",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },

  // CARDS
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    gap: 10,
  },
  card: {
    backgroundColor: "#800000",
    borderRadius: 12,
    padding: 15,
    flex: 1,
    alignItems: "center",
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 4,
  },
  cardText: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
  },

  // SECCIONES
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#800000",
    marginTop: 20,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555",
    marginBottom: 15,
  },

  // TURNOS - CHIPS
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    gap: 8,
  },
  chip: {
    backgroundColor: "#800000",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },

  // INFORMACIÓN CLAVE
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#9F2727",
  },
  infoDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#BF5F5F",
    marginRight: 12,
    marginTop: 2,
    flexShrink: 0,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    lineHeight: 20,
  },

  // TAREAS
  taskItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  taskText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  // TABLA PLAN DE ESTUDIOS
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#9F2727",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  tableHeaderText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 13,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCell: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },

  // CENTRADO
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});