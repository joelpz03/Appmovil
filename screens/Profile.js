import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, KeyboardAvoidingView, Platform,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  const [photo, setPhoto] = useState(user?.photoURL || null);
  const [loading, setLoading] = useState(true);

  const initialRef = useRef({ nombre: "", apellido: "", telefono: "", photo: null });

  useEffect(() => {
    const load = async () => {
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
          setPhoto(data.photoURL ?? user?.photoURL ?? null);
          initialRef.current = {
            nombre: data.nombre ?? "",
            apellido: data.apellido ?? "",
            telefono: data.telefono ?? "",
            photo: data.photoURL ?? user?.photoURL ?? null,
          };
        } else {
          if (user?.displayName) {
            const parts = user.displayName.split(" ");
            setNombre(parts.shift() ?? "");
            setApellido(parts.join(" ") ?? "");
          }
          setPhoto(user?.photoURL ?? null);
          initialRef.current = {
            nombre: user?.displayName?.split(" ").shift() ?? "",
            apellido: user?.displayName?.split(" ").slice(1).join(" ") ?? "",
            telefono: "",
            photo: user?.photoURL ?? null,
          };
        }
      } catch (err) {
        console.log("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
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
        quality: 0.7,
      });

      const uri = result.assets ? result.assets[0].uri : result.uri;
      if (!result.cancelled && uri) {
        setPhoto(uri);
      }
    } catch (err) {
      console.log("Image pick error:", err);
    }
  };

  const handleSave = () => {
    Alert.alert("Guardar cambios", "¿Deseas guardar los cambios?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Guardar",
        onPress: async () => {
          try {
            if (!uid) throw new Error("Usuario no autenticado.");
            await setDoc(
              doc(firestore, "users", uid),
              {
                nombre,
                apellido,
                telefono,
                photoURL: photo ?? null,
              },
              { merge: true }
            );

            await updateProfile(user, {
              displayName: `${nombre} ${apellido}`,
              photoURL: photo ?? null,
            });

            initialRef.current = { nombre, apellido, telefono, photo };
            Alert.alert("Listo", "Datos actualizados.");
          } catch (err) {
            console.log("Save profile error:", err);
            Alert.alert("Error", err.message || "No se pudieron guardar los cambios.");
          }
        },
      },
    ]);
  };

  const handleCancel = () => {
    const init = initialRef.current;
    setNombre(init.nombre);
    setApellido(init.apellido);
    setTelefono(init.telefono);
    setPhoto(init.photo);
    navigation.navigate("Home");
  };

  if (loading) {
    return (
      <View style={[styles.center, { flex: 1 }]}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const defaultAvatar = require("../assets/logo.png");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Mi perfil</Text>

        <TouchableOpacity style={styles.avatarWrap} onPress={pickImage}>
          <Image source={photo ? { uri: photo } : defaultAvatar} style={styles.avatar} />
          <Text style={styles.changePhoto}>Tocar para cambiar / agregar foto</Text>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput value={nombre} onChangeText={setNombre} style={styles.input} placeholder="Nombre" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput value={apellido} onChangeText={setApellido} style={styles.input} placeholder="Apellido" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            value={telefono}
            onChangeText={setTelefono}
            style={styles.input}
            placeholder="Teléfono"
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
          <Text style={styles.primaryButtonText}>Guardar cambios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#800000", marginBottom: 16 },
  avatarWrap: { alignItems: "center", marginBottom: 16 },
  avatar: { width: 110, height: 110, borderRadius: 110 / 2, backgroundColor: "#eee" },
  changePhoto: { fontSize: 13, color: "#666", marginTop: 8 },
  inputGroup: { width: "100%", marginBottom: 12 },
  label: { fontSize: 14, color: "#333", fontWeight: "600", marginBottom: 6 },
  input: { backgroundColor: "#f5f5f5", padding: 12, borderRadius: 10, fontSize: 16 },
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
  center: { justifyContent: "center", alignItems: "center" },
});