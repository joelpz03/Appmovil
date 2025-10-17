import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert,} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com)$/i;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert("Correo inválido", "Usá un correo @gmail.com o @hotmail.com.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      Alert.alert("Éxito", "Inicio de sesión correcto.");
    } catch (err) {
      console.log("Login error:", err);
      Alert.alert("Error", "Correo o contraseña incorrectos.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.brand}>Instituto del Milagro</Text>
            <Text style={styles.title}>Iniciar sesión</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Correo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa aquí tu correo"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa aquí tu contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
              <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Ingresar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const PRIMARY = "#800000";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 120,
    paddingTop: 60,
  },
  header: { alignItems: "center", marginBottom: 18 },
  brand: { color: PRIMARY, fontWeight: "700", marginBottom: 6 },
  title: { fontSize: 28, fontWeight: "700", color: "#222" },

  form: { marginTop: 6 },

  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6 },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
    color: "#111",
  },

  forgot: { color: "#666", alignSelf: "flex-end", marginBottom: 8 },

  primaryButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  link: { textAlign: "center", color: PRIMARY, marginTop: 16 },
});