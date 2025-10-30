import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput,TouchableOpacity, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { auth, firestore } from "../src/config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import CustomAlert from "../components/CustomAlert";

const PRIMARY = "#800000";

export default function Profile({ navigation }) {
  const user = auth.currentUser;
  const uid = user?.uid;

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [dni, setDni] = useState("");
  const [direccion, setDireccion] = useState("");
  const [photo, setPhoto] = useState(user?.photoURL || null);
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isModified, setIsModified] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    type: "info",
    onClose: null,
    onConfirm: null,
    confirmText: "Aceptar",
    cancelText: null,
  });

  const initialRef = useRef({});

  useEffect(() => {
    const loadUser = async () => {
      if (!uid) {
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(firestore, "users", uid));
        if (snap.exists()) {
          const data = snap.data();
          setNombre(data.nombre ?? "");
          setApellido(data.apellido ?? "");
          setTelefono(data.telefono ?? "");
          setDni(data.dni ?? "");
          setDireccion(data.direccion ?? "");
          setPhoto(data.photoBase64 ?? user?.photoURL ?? null);
          setEmail(user?.email ?? "");
          initialRef.current = { ...data, photo: data.photoBase64 };
        }
      } catch (err) {
        console.log("Error al cargar perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [uid]);

  useEffect(() => {
    const init = initialRef.current;
    const changed =
      nombre !== (init.nombre ?? "") ||
      apellido !== (init.apellido ?? "") ||
      telefono !== (init.telefono ?? "") ||
      dni !== (init.dni ?? "") ||
      direccion !== (init.direccion ?? "") ||
      photo !== (init.photo ?? user?.photoURL ?? null);
    setIsModified(changed);
  }, [nombre, apellido, telefono, dni, direccion, photo]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showAlert("Permiso requerido", "Se necesita permiso para acceder a la galería.", "error");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0].base64) {
      const base64Data = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setPhoto(base64Data);
    }
  };

  const handleSave = async () => {
    try {
      if (!uid) throw new Error("Usuario no autenticado.");
      setLoading(true);

      const photoBase64 = photo?.startsWith("data:image") ? photo : null;

      await setDoc(
        doc(firestore, "users", uid),
        { nombre, apellido, telefono, dni, direccion, photoBase64, email },
        { merge: true }
      );

      await updateProfile(user, {
        displayName: `${nombre} ${apellido}`,
      });

      initialRef.current = { nombre, apellido, telefono, dni, direccion, photo: photoBase64 };
      setEditMode(false);
      setIsModified(false);
      showAlert("Listo", "Datos actualizados correctamente.", "success");
    } catch (err) {
      console.log("Error al guardar los cambios:", err);
      showAlert("Error", err.message || "No se pudieron guardar los cambios.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isModified) {
      showAlert("Cancelar cambios", "Sus cambios se borrarán, ¿desea cancelar?", "warning", {
        confirmText: "Cancelar",
        cancelText: "Volver",
        onConfirm: () => {
          const init = initialRef.current;
          setNombre(init.nombre || "");
          setApellido(init.apellido || "");
          setTelefono(init.telefono || "");
          setDni(init.dni || "");
          setDireccion(init.direccion || "");
          setPhoto(init.photo || user?.photoURL || null);
          setEditMode(false);
          setIsModified(false);
        },
      });
    } else {
      setEditMode(false);
    }
  };

  const showAlert = (title, message, type = "info", options = {}) => {
    setAlertData({
      title,
      message,
      type,
      onClose: options.onClose || null,
      onConfirm: options.onConfirm || null,
      confirmText: options.confirmText || "Aceptar",
      cancelText: options.cancelText || null,
    });
    setAlertVisible(true);
  };

  if (loading) {
    return (
      <View style={[styles.center, { flex: 1 }]}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const defaultAvatar = require("../assets/default-avatar.png");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Mi perfil</Text>

          <TouchableOpacity style={styles.avatarWrap} onPress={editMode ? pickImage : null}>
            <Image source={photo ? { uri: photo } : defaultAvatar} style={styles.avatar} />
            {editMode && <Text style={styles.changePhoto}>Toque para cambiar su foto</Text>}
          </TouchableOpacity>

          {/* Campos con íconos */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={PRIMARY} style={styles.inputIcon} />
              <TextInput
                value={nombre}
                onChangeText={setNombre}
                editable={editMode}
                style={[styles.input, !editMode && styles.disabledInput]}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellido</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-circle-outline" size={20} color={PRIMARY} style={styles.inputIcon} />
              <TextInput
                value={apellido}
                onChangeText={setApellido}
                editable={editMode}
                style={[styles.input, !editMode && styles.disabledInput]}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={PRIMARY} style={styles.inputIcon} />
              <TextInput
                value={email}
                editable={false}
                style={[styles.input, styles.disabledInput]}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>DNI</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="id-card-outline" size={20} color={PRIMARY} style={styles.inputIcon} />
              <TextInput
                value={dni}
                onChangeText={setDni}
                editable={editMode}
                keyboardType="numeric"
                style={[styles.input, !editMode && styles.disabledInput]}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dirección</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="home-outline" size={20} color={PRIMARY} style={styles.inputIcon} />
              <TextInput
                value={direccion}
                onChangeText={setDireccion}
                editable={editMode}
                style={[styles.input, !editMode && styles.disabledInput]}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color={PRIMARY} style={styles.inputIcon} />
              <TextInput
                value={telefono}
                onChangeText={setTelefono}
                editable={editMode}
                keyboardType="phone-pad"
                style={[styles.input, !editMode && styles.disabledInput]}
              />
            </View>
          </View>

          {/* Botones */}
          {editMode ? (
            <>
              <TouchableOpacity
                style={[styles.primaryButton, !isModified && { backgroundColor: "#ccc" }]}
                onPress={handleSave}
                disabled={!isModified}
              >
                <Text style={styles.primaryButtonText}>Guardar cambios</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={() => setEditMode(true)}>
                <Text style={styles.primaryButtonText}>Editar información</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
                <Text style={styles.backButtonText}>Volver</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertVisible}
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        confirmText={alertData.confirmText}
        cancelText={alertData.cancelText}
        onConfirm={() => {
          setAlertVisible(false);
          if (alertData.onConfirm) alertData.onConfirm();
        }}
        onClose={() => {
          setAlertVisible(false);
          if (alertData.onClose) alertData.onClose();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 120,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 16,
  },
  avatarWrap: { alignItems: "center", marginBottom: 16 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#eee",
  },
  changePhoto: { fontSize: 13, color: "#666", marginTop: 8 },
  inputGroup: { width: "100%", marginBottom: 12 },
  label: { fontSize: 14, color: "#333", fontWeight: "600", marginBottom: 6 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  disabledInput: { backgroundColor: "#eaeaea", color: "#555" },
  primaryButton: {
    width: "100%",
    backgroundColor: PRIMARY,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: { color: "#fff", fontWeight: "700" },
  cancelButton: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: { color: "#333", fontWeight: "700" },
  backButton: {
    width: "100%",
    backgroundColor: "#e9e9e9ff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: { color: PRIMARY, fontWeight: "700" },
  center: { justifyContent: "center", alignItems: "center" },
});