import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";
import CustomAlert from "../components/CustomAlert";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ 
    visible: false, 
    title: "", 
    message: "", 
    type: "info",
    onClose: null 
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showAlert = (title, message, type = "info", onCloseCallback = null) => {
    setAlert({ 
      visible: true, 
      title, 
      message, 
      type,
      onClose: onCloseCallback 
    });
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert("Campos incompletos", "Por favor, complete todos los campos requeridos.", "error");
      return;
    }

    if (!emailRegex.test(email)) {
      showAlert("Correo inválido", "Por favor, ingrese un correo válido.", "error");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      
      //Muestra el alert y navega cuando el usuario lo cierra.
      showAlert(
        "Sesión Iniciada con Éxito",
        "Le damos la bienvenida al Instituto Superior del Milagro.",
        "success",
        () => {
          setAlert({ ...alert, visible: false });
        }
  );
    } catch (err) {
      console.log("Login error:", err);
      showAlert(
        "Credenciales inválidas",
        "Por favor, verifique que su correo electrónico y contraseña sean correctos e intente nuevamente.",
        "error"
      );
    }
  };

  const handleCloseAlert = () => {
    if (alert.onClose) {
      alert.onClose();
    } else {
      setAlert({ ...alert, visible: false }); //cierra el alert
    }
  };

  const isDisabled = !email.trim() || !password.trim();

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
            <Text style={styles.title}>Iniciar sesión</Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#666"
                  style={styles.iconRight}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.forgotContainer}>
              <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                <Text style={styles.forgot}>¿Ha olvidado su contraseña?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, isDisabled && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isDisabled}
            >
              <Text style={styles.primaryButtonText}>Ingresar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.link}>
                ¿No tiene cuenta? <Text style={styles.linkBold}>Registrese</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    paddingTop: 0,
  },
  header: { 
    alignItems: "center", 
    marginBottom: 30 
},
  imageWrapper: { 
    position: "relative",
    top: -20
},
  headerImage: { 
    width: 300, 
    height: 105, 
    resizeMode: "contain", 
    marginBottom: 30 
},
  title: { 
    fontSize: 26, 
    fontWeight: "700", 
    color: "#222" 
},
  form: { 
    alignItems: "center" 
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
    color: "#111" 
},
  icon: { 
    marginRight: 6 
},
  iconRight: { 
    marginLeft: 6 
},
  forgotContainer: { 
    width: "100%", 
    alignItems: "flex-end" },
  forgot: { color: "#4da6ff", marginBottom: 12 },
  primaryButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  disabledButton: { opacity: 0.6 },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  link: { textAlign: "center", color: "#333", marginTop: 16 },
  linkBold: { fontWeight: "bold", color: PRIMARY },
});