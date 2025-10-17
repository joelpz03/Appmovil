import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, KeyboardAvoidingView, Platform,} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, firestore } from "../src/config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

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
        } else {
          await setDoc(doc(firestore, "users", uid), {
            nombre: "",
            apellido: "",
            telefono: "",
            dni: "",
            direccion: "",
            photoBase64: null,
            email: user?.email ?? "",
          });
          setEmail(user?.email ?? "");
        }
      } catch (err) {
        console.log("Error al cargar perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [uid]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Se necesita permiso para acceder a la galería.");
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
    } catch (err) {
      console.log("Error al seleccionar imagen:", err);
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
      Alert.alert("Listo", "Datos actualizados correctamente.");
      setEditMode(false);
    } catch (err) {
      console.log("Error al guardar los cambios:", err);
      Alert.alert("Error", err.message || "No se pudieron guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const init = initialRef.current;
    setNombre(init.nombre || "");
    setApellido(init.apellido || "");
    setTelefono(init.telefono || "");
    setDni(init.dni || "");
    setDireccion(init.direccion || "");
    setPhoto(init.photo || user?.photoURL || null);
    setEditMode(false);
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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Mi perfil</Text>

        <TouchableOpacity style={styles.avatarWrap} onPress={editMode ? pickImage : null}>
          <Image source={photo ? { uri: photo } : defaultAvatar} style={styles.avatar} />
          {editMode && <Text style={styles.changePhoto}>Tocar para cambiar foto</Text>}
        </TouchableOpacity>

        {/* Campos editables */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            editable={editMode}
            style={[styles.input, !editMode && styles.disabledInput]}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput
            value={apellido}
            onChangeText={setApellido}
            editable={editMode}
            style={[styles.input, !editMode && styles.disabledInput]}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            value={email}
            editable={false}
            style={[styles.input, styles.disabledInput]}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>DNI</Text>
          <TextInput
            value={dni}
            onChangeText={setDni}
            editable={editMode}
            keyboardType="numeric"
            style={[styles.input, !editMode && styles.disabledInput]}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            value={direccion}
            placeholder="Ingresa aquí tu dirección"
            onChangeText={setDireccion}
            editable={editMode}
            style={[styles.input, !editMode && styles.disabledInput]}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            value={telefono}
            onChangeText={setTelefono}
            editable={editMode}
            keyboardType="phone-pad"
            style={[styles.input, !editMode && styles.disabledInput]}
          />
        </View>

        {editMode ? (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 120,
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "700", color: "#800000", marginBottom: 16 },
  avatarWrap: { alignItems: "center", marginBottom: 16 },
  avatar: { width: 110, height: 110, borderRadius: 110 / 2, backgroundColor: "#eee" },
  changePhoto: { fontSize: 13, color: "#666", marginTop: 8 },
  inputGroup: { width: "100%", marginBottom: 12 },
  label: { fontSize: 14, color: "#333", fontWeight: "600", marginBottom: 6 },
  input: { backgroundColor: "#f5f5f5", padding: 12, borderRadius: 10, fontSize: 16 },
  disabledInput: { backgroundColor: "#eaeaea", color: "#555" },
  primaryButton: {
    width: "100%",
    backgroundColor: "#800000",
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
  backButtonText: { color: "#800000", fontWeight: "700" },
  center: { justifyContent: "center", alignItems: "center" },
});