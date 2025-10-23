import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert,} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com)$/i;

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Ingresá tu correo.");
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Usá un correo con @gmail.com o @hotmail.com");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      Alert.alert("Listo", "Se envió un email para reestablecer la contraseña.");
      navigation.goBack();
    } catch (error) {
      console.log("ForgotPassword error:", error);
      Alert.alert("Error", error.message || "No se pudo enviar el correo.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fff" }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Recuperar contraseña</Text>
        <Text style={styles.helpText}>Al colocar tu email te enviaremos un correo para cambiar la contraseña.</Text>

        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa aquí tu correo"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Enviar email de recuperación</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const PRIMARY = "#800000";

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 120,
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "700", color: PRIMARY, marginBottom: 8 },
  helpText: { color: "#666", textAlign: "center", marginBottom: 16 },
  label: { alignSelf: "flex-start", fontWeight: "600", marginBottom: 6 },
  input: { width: "100%", backgroundColor: "#f5f5f5", padding: 12, borderRadius: 10, marginBottom: 12 },
  button: { width: "100%", backgroundColor: PRIMARY, padding: 14, borderRadius: 10, alignItems: "center", marginTop: 6 },
  buttonText: { color: "#fff", fontWeight: "700" },
});