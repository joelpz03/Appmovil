import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";
import CustomAlert from "../components/CustomAlert";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ 
    visible: false, 
    title: "", 
    message: "", 
    type: "info",
    onClose: null 
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email.trim());

  const showAlert = (title, message, type = "info", onCloseCallback = null) => {
    setAlert({ 
      visible: true, 
      title, 
      message, 
      type,
      onClose: onCloseCallback 
    });
  };

  const handleReset = async () => {
    if (!email.trim()) {
      showAlert("Campo vacío", "Por favor, ingrese su correo electrónico.", "error");
      return;
    }
    if (!isEmailValid) {
      showAlert("Formato inválido", "Por favor, ingrese un formato de correo válido.", "error");
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      showAlert(
        "Correo enviado",
        "Se ha enviado un enlace a su correo. Si su cuenta existe, recibirá las instrucciones para restablecer su contraseña. Por favor, revise su bandeja de entrada y la carpeta de spam.",
        "success",
        () => {
          setAlert({ ...alert, visible: false });
          navigation.goBack();
        }
      );
    } catch (error) {
      console.log("ForgotPassword error:", error);
      // Mismo mensaje que en el try para evitar enumeración de usuarios
      showAlert(
        "Correo enviado",
        "Se ha enviado un enlace a su correo. Si su cuenta existe, recibirá las instrucciones para restablecer su contraseña. Por favor, revise su bandeja de entrada y la carpeta de spam.",
        "success",
        () => {
          setAlert({ ...alert, visible: false });
          navigation.goBack();
        }
      );
    }
  };

  const handleCloseAlert = () => {
    if (alert.onClose) {
      alert.onClose();
    } else {
      setAlert({ ...alert, visible: false });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
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
            <Text style={styles.title}>Recuperar contraseña</Text>
          </View>

          {/* Texto de ayuda */}
          <Text style={styles.helpText}>
            Ingrese su correo electrónico para recibir las instrucciones y restablecer su contraseña.
          </Text>

          {/* Formulario */}
          <View style={styles.form}>
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#666"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="ejemplo@gmail.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!isEmailValid || !email.trim()) && styles.disabledButton,
              ]}
              onPress={handleReset}
              disabled={!isEmailValid || !email.trim()}
            >
              <Text style={styles.primaryButtonText}>Enviar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.link}>
                ¿Recordó su contraseña?{" "}
                <Text style={styles.linkBold}>Volver al inicio de sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Alert */}
      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={handleCloseAlert}
      />
    </SafeAreaView>
  );
}

const PRIMARY = "#800000";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  imageWrapper: {
    position: "relative",
    top: -10,
  },
  headerImage: {
    width: 300, 
    height: 105, 
    resizeMode: "contain", 
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#222",
  },
  helpText: {
    color: "#555",
    textAlign: "center",
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 22,
  },
  form: {
    alignItems: "center",
  },
  label: {
    width: "100%",
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 14,
    paddingHorizontal: 10,
    width: "100%",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111",
  },
  icon: {
    marginRight: 6,
  },
  primaryButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#b88f8f",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  link: {
    textAlign: "center",
    color: "#333",
    marginTop: 18,
  },
  linkBold: {
    fontWeight: "bold",
    color: PRIMARY,
  },
});