import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, ScrollView, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { firestore } from "../src/config/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function EditCarrera({ route, navigation }) {
  const { id } = route.params || {};
  const [titulo, setTitulo] = useState("");
  const [duracion, setDuracion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [informacionClave, setInformacionClave] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [planDeEstudios, setPlanDeEstudios] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modales
  const [modalVisibleTurno, setModalVisibleTurno] = useState(false);
  const [modalVisibleInfo, setModalVisibleInfo] = useState(false);
  const [modalVisibleTarea, setModalVisibleTarea] = useState(false);
  const [modalVisiblePlan, setModalVisiblePlan] = useState(false);

  // Inputs modales
  const [nuevoTurno, setNuevoTurno] = useState("");
  const [nuevoItemInfo, setNuevoItemInfo] = useState("");
  const [nuevoItemTarea, setNuevoItemTarea] = useState("");
  const [nuevoPlan, setNuevoPlan] = useState({ codigo: "", espacio: "", regimen: "" });

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const d = await getDoc(doc(firestore, "carreras", id));
        if (d.exists()) {
          const data = d.data();
          setTitulo(data.titulo || "");
          setDuracion(data.duracion || "");
          setDescripcion(data.descripcion || "");
          setModalidad(data.modalidad || "");
          setTurnos(Array.isArray(data.turnos) ? data.turnos : []);
          setInformacionClave(data.informacionClave || []);
          setTareas(data.tareas || []);
          setPlanDeEstudios(data.planDeEstudios || []);
          setImagen(data.imagen || null);
        } else {
          Alert.alert("Error", "Carrera no encontrada.");
          navigation.goBack();
        }
      } catch (err) {
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const elegirImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImagen(base64Img);
    }
  };

  // TURNOS
  const agregarTurno = () => {
    if (!nuevoTurno.trim()) {
      Alert.alert("Aviso", "Ingresa un turno");
      return;
    }
    setTurnos([...turnos, nuevoTurno]);
    setNuevoTurno("");
    setModalVisibleTurno(false);
  };

  const eliminarTurno = (index) => {
    setTurnos(turnos.filter((_, i) => i !== index));
  };

  // INFORMACIÓN CLAVE
  const agregarItemInfo = () => {
    if (!nuevoItemInfo.trim()) {
      Alert.alert("Aviso", "Ingresa información clave");
      return;
    }
    setInformacionClave([...informacionClave, nuevoItemInfo]);
    setNuevoItemInfo("");
    setModalVisibleInfo(false);
  };

  const eliminarItemInfo = (index) => {
    setInformacionClave(informacionClave.filter((_, i) => i !== index));
  };

  // TAREAS
  const agregarItemTarea = () => {
    if (!nuevoItemTarea.trim()) {
      Alert.alert("Aviso", "Ingresa una tarea");
      return;
    }
    setTareas([...tareas, nuevoItemTarea]);
    setNuevoItemTarea("");
    setModalVisibleTarea(false);
  };

  const eliminarItemTarea = (index) => {
    setTareas(tareas.filter((_, i) => i !== index));
  };

  // PLAN DE ESTUDIOS
  const agregarItemPlan = () => {
    if (!nuevoPlan.codigo.trim() || !nuevoPlan.espacio.trim() || !nuevoPlan.regimen.trim()) {
      Alert.alert("Aviso", "Completa todos los campos");
      return;
    }
    setPlanDeEstudios([...planDeEstudios, { ...nuevoPlan }]);
    setNuevoPlan({ codigo: "", espacio: "", regimen: "" });
    setModalVisiblePlan(false);
  };

  const eliminarItemPlan = (index) => {
    setPlanDeEstudios(planDeEstudios.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    Alert.alert("Guardar cambios", "¿Guardar los cambios?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Guardar",
        onPress: async () => {
          try {
            await updateDoc(doc(firestore, "carreras", id), {
              titulo,
              duracion,
              descripcion,
              modalidad,
              turnos,
              informacionClave,
              tareas,
              planDeEstudios,
              imagen,
            });
            Alert.alert("Guardado", "Cambios guardados correctamente.");
            navigation.goBack();
          } catch (err) {
            Alert.alert("Error", err.message);
          }
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert("Eliminar", "¿Seguro que querés eliminar esta carrera?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(firestore, "carreras", id));
            Alert.alert("Eliminado", "Carrera eliminada.");
            navigation.goBack();
          } catch (err) {
            Alert.alert("Error", err.message);
          }
        },
      },
    ]);
  };

  const handleCancel = () => {
    Alert.alert(
      "Descartar cambios",
      "¿Descartar todos los cambios sin guardar?",
      [
        { text: "Continuar editando", style: "cancel" },
        {
          text: "Descartar",
          style: "destructive",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#800000" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="#800000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Editar carrera</Text>
      </View>

      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Título" />
      <TextInput style={styles.input} value={duracion} onChangeText={setDuracion} placeholder="Duración (ej: 3 años)" />
      <TextInput style={styles.input} value={modalidad} onChangeText={setModalidad} placeholder="Modalidad (Presencial, Virtual...)" />
      <TextInput style={[styles.input, styles.textArea]} value={descripcion} onChangeText={setDescripcion} placeholder="Descripción de la carrera" multiline />

      {/* TURNOS */}
      <Text style={styles.sectionTitle}>Turnos</Text>
      <View style={styles.chipsContainer}>
        {turnos.map((turno, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.chipText}>{turno}</Text>
            <TouchableOpacity onPress={() => eliminarTurno(index)} style={styles.chipClose}>
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisibleTurno(true)}>
        <Ionicons name="add" size={20} color="#800000" />
        <Text style={styles.addButtonText}>Agregar turno</Text>
      </TouchableOpacity>

      {/* INFORMACIÓN CLAVE */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Información Clave</Text>
      {informacionClave.map((item, index) => (
        <View key={index} style={styles.infoCard}>
          <View style={styles.infoDot} />
          <Text style={styles.infoText}>{item}</Text>
          <TouchableOpacity onPress={() => eliminarItemInfo(index)}>
            <Ionicons name="close-circle" size={20} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisibleInfo(true)}>
        <Ionicons name="add" size={20} color="#800000" />
        <Text style={styles.addButtonText}>Agregar información</Text>
      </TouchableOpacity>

      {/* TAREAS */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Tareas Específicas</Text>
      {tareas.map((tarea, index) => (
        <View key={index} style={styles.taskItem}>
          <Text style={styles.taskText}>• {tarea}</Text>
          <TouchableOpacity onPress={() => eliminarItemTarea(index)}>
            <Ionicons name="close-circle" size={20} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisibleTarea(true)}>
        <Ionicons name="add" size={20} color="#800000" />
        <Text style={styles.addButtonText}>Agregar tarea</Text>
      </TouchableOpacity>

      {/* PLAN DE ESTUDIOS */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Plan de Estudios</Text>
      {planDeEstudios.length > 0 && (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Código</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Espacio Curricular</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Régimen</Text>
            <Text style={styles.tableHeaderText}>Acción</Text>
          </View>
          {planDeEstudios.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.codigo}</Text>
              <Text style={styles.tableCell}>{item.espacio}</Text>
              <Text style={styles.tableCell}>{item.regimen}</Text>
              <TouchableOpacity onPress={() => eliminarItemPlan(index)}>
                <Ionicons name="trash" size={18} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisiblePlan(true)}>
        <Ionicons name="add" size={20} color="#800000" />
        <Text style={styles.addButtonText}>Agregar materia</Text>
      </TouchableOpacity>

      {/* IMAGEN */}
      <TouchableOpacity style={styles.imageButton} onPress={elegirImagen}>
        <Ionicons name="image-outline" size={22} color="#800000" />
        <Text style={styles.imageButtonText}>{imagen ? "Cambiar imagen" : "Seleccionar imagen"}</Text>
      </TouchableOpacity>

      {imagen && <Image source={{ uri: imagen }} style={styles.preview} />}

      {/* BOTONES GUARDAR/CANCELAR/ELIMINAR */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
        <Text style={styles.cancelBtnText}>Cancelar edición</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteText}>Eliminar carrera</Text>
      </TouchableOpacity>

      {/* MODAL TURNO */}
      <Modal visible={modalVisibleTurno} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Turno</Text>
            <TextInput placeholder="Ej: Turno Tarde" value={nuevoTurno} onChangeText={setNuevoTurno} style={styles.input} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setNuevoTurno(""); setModalVisibleTurno(false); }}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={agregarTurno}>
                <Text style={styles.confirmButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL INFORMACIÓN */}
      <Modal visible={modalVisibleInfo} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Información Clave</Text>
            <TextInput placeholder="Ingresa información importante" value={nuevoItemInfo} onChangeText={setNuevoItemInfo} style={[styles.input, styles.textArea]} multiline />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setNuevoItemInfo(""); setModalVisibleInfo(false); }}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={agregarItemInfo}>
                <Text style={styles.confirmButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL TAREA */}
      <Modal visible={modalVisibleTarea} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Tarea</Text>
            <TextInput placeholder="Describe la tarea" value={nuevoItemTarea} onChangeText={setNuevoItemTarea} style={[styles.input, styles.textArea]} multiline />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setNuevoItemTarea(""); setModalVisibleTarea(false); }}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={agregarItemTarea}>
                <Text style={styles.confirmButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL PLAN DE ESTUDIOS */}
      <Modal visible={modalVisiblePlan} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Materia</Text>
            <TextInput placeholder="Código (ej: 1.01)" value={nuevoPlan.codigo} onChangeText={(text) => setNuevoPlan({ ...nuevoPlan, codigo: text })} style={styles.input} />
            <TextInput placeholder="Espacio Curricular" value={nuevoPlan.espacio} onChangeText={(text) => setNuevoPlan({ ...nuevoPlan, espacio: text })} style={styles.input} />
            <TextInput placeholder="Régimen (ej: 1º Cuatrimestre)" value={nuevoPlan.regimen} onChangeText={(text) => setNuevoPlan({ ...nuevoPlan, regimen: text })} style={styles.input} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setNuevoPlan({ codigo: "", espacio: "", regimen: "" }); setModalVisiblePlan(false); }}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={agregarItemPlan}>
                <Text style={styles.confirmButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff", padding: 20, paddingTop: 15, paddingBottom: 30 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  headerText: { fontSize: 22, fontWeight: "bold", color: "#800000", marginLeft: 15 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 15, backgroundColor: "#f9f9f9" },
  textArea: { height: 100, textAlignVertical: "top" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#800000", marginBottom: 10 },

  // Turnos
  chipsContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10, gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", backgroundColor: "#800000", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 6 },
  chipText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  chipClose: { padding: 2 },

  // Información
  infoCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: "#9F2727" },
  infoDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#BF5F5F", marginRight: 10 },
  infoText: { flex: 1, fontSize: 14, color: "#333", marginRight: 10 },

  // Tareas
  taskItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
  taskText: { flex: 1, fontSize: 14, color: "#333" },

  // Tabla
  tableContainer: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, overflow: "hidden", marginBottom: 15 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f0f0f0", paddingHorizontal: 10, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: "#ddd" },
  tableHeaderText: { fontWeight: "bold", color: "#333", fontSize: 13 },
  tableRow: { flexDirection: "row", paddingHorizontal: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee", alignItems: "center" },
  tableCell: { flex: 1, fontSize: 13, color: "#555" },

  // Botones
  addButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0", paddingVertical: 12, borderRadius: 8, marginBottom: 15, gap: 8 },
  addButtonText: { color: "#800000", fontWeight: "bold", fontSize: 14 },
  imageButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, marginBottom: 15 },
  imageButtonText: { color: "#800000", marginLeft: 8, fontWeight: "bold" },
  preview: { width: "100%", height: 180, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: "#800000", borderRadius: 8, paddingVertical: 14, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelBtn: { backgroundColor: "#f0f0f0", borderRadius: 8, paddingVertical: 14, alignItems: "center", marginBottom: 10, borderWidth: 1, borderColor: "#ddd" },
  cancelBtnText: { color: "#666", fontWeight: "bold", fontSize: 16 },
  deleteBtn: { paddingVertical: 12, alignItems: "center", marginBottom: 20 },
  deleteText: { color: "red", fontWeight: "bold", fontSize: 16 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#800000", marginBottom: 15 },
  modalButtons: { flexDirection: "row", gap: 10, marginTop: 15 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  cancelButton: { backgroundColor: "#f0f0f0" },
  cancelButtonText: { color: "#666", fontWeight: "bold" },
  confirmButton: { backgroundColor: "#800000" },
  confirmButtonText: { color: "#fff", fontWeight: "bold" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});