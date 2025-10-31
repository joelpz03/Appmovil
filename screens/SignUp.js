import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { auth, firestore } from "../src/config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../components/CustomAlert";

export default function SignUp({ setIsNavigatingAway }) {
  const navigation = useNavigation();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [alert, setAlert] = useState({ 
    visible: false, 
    title: "", 
    message: "", 
    type: "info",
    onClose: null 
  });

  const [validations, setValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
  });

  // Regex de validación
  const nameRegex = /^[a-zA-Z\sñÑ\u00C0-\u017F]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$/;

  const showAlert = (title, message, type = "info", onCloseCallback = null) => {
    setAlert({ 
      visible: true, 
      title, 
      message, 
      type,
      onClose: onCloseCallback 
    });
  };

  const handleNombreChange = (text) => {
    const soloLetras = text.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    setNombre(soloLetras);
  };

  const handleApellidoChange = (text) => {
    const soloLetras = text.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    setApellido(soloLetras);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setValidations({
      length: text.length >= 6,
      upper: /[A-Z]/.test(text),
      lower: /[a-z]/.test(text),
      number: /\d/.test(text),
    });
  };

  const passwordsMatch = password && confirmPassword === password;
  const allValidationsPassed = validations.length && validations.upper && validations.lower && validations.number;
  
  const isFormValid = 
    nombre.trim() && 
    apellido.trim() && 
    emailRegex.test(email.trim()) && 
    allValidationsPassed && 
    passwordsMatch;

  const handleSignUp = async () => {
    // Validación de campos vacíos
    if (!nombre.trim() || !apellido.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      showAlert("Campos incompletos", "Por favor, complete todos los campos para continuar.", "error");
      return;
    }

    // Validación de nombre y apellido
    if (!nameRegex.test(nombre.trim())) {
      showAlert("Nombre inválido", "El nombre solo puede contener letras y espacios.", "error");
      return;
    }

    if (!nameRegex.test(apellido.trim())) {
      showAlert("Apellido inválido", "El apellido solo puede contener letras y espacios.", "error");
      return;
    }

    // Validación de email
    if (!emailRegex.test(email.trim())) {
      showAlert("Correo inválido", "Por favor, ingrese un formato de correo válido.", "error");
      return;
    }

    // Validación de contraseña
    if (!passwordRegex.test(password)) {
      showAlert("Contraseña inválida", "La contraseña debe cumplir con todos los requisitos de seguridad.", "error");
      return;
    }

    // Validación de coincidencia de contraseñas
    if (!passwordsMatch) {
      showAlert("Error", "Las contraseñas no coinciden.", "error");
      return;
    }

    try {
      //Se avisa inmediatamente a App.js que estamos en un proceso manual.
      if (setIsNavigatingAway) {
        setIsNavigatingAway(true);
      }
      
      //Pequeño delay de sincronización (50ms).
      //Esto da tiempo a que App.js (el useRef) lea isNavigatingAway=true
      //ANTES de que el listener de Firebase se active.
      await new Promise(resolve => setTimeout(resolve, 50));

      //Crear el usuario (se conecta y dispara onAuthStateChanged)
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${nombre.trim()} ${apellido.trim()}`,
      });

      // Guardar datos adicionales en Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim().toLowerCase(),
        photoBase64: null,
        telefono: "",
        dni: "",
        direccion: "",
      });
      
      //Mostrar alerta de éxito
      showAlert(
        "Cuenta creada",
        "Su registro se ha completado exitosamente. Ahora puede iniciar sesión con sus credenciales.",
        "success",
        async () => {
          setAlert({ ...alert, visible: false });
          
          //Cerrar la sesión
          await signOut(auth);
          
          //Navega a Login inmediatamente después del signOut
          navigation.navigate("Login", { 
            email: email.trim().toLowerCase() 
          });

          //Restablece el flag DE ÚLTIMO, después de la navegación.
          if (setIsNavigatingAway) {
            setIsNavigatingAway(false);
          }
        }
      );
    } catch (error) {
      console.log("Error al registrar usuario:", error);
      
      // Si hay un error, restablecer el flag para que el usuario pueda intentar de nuevo
      if (setIsNavigatingAway) {
        setIsNavigatingAway(false);
      }

      // Manejo de errores específicos
      if (error.code === "auth/email-already-in-use") {
        showAlert("Correo existente", "Este correo ya se encuentra registrado.", "error");
      } else if (error.code === "auth/weak-password") {
        showAlert("Contraseña débil", "La contraseña debe tener al menos 6 caracteres.", "error");
      } else if (error.code === "auth/invalid-email") {
        showAlert("Correo inválido", "Por favor, ingrese un formato de correo válido.", "error");
      } else {
        showAlert("Error", "Ocurrió un error al crear la cuenta. Intente nuevamente.", "error");
      }
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              <Text style={styles.title}>Crear cuenta</Text>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
              <Text style={styles.label}>Nombre</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Introduzca su nombre"
                  placeholderTextColor="#999"
                  value={nombre}
                  onChangeText={handleNombreChange}
                />
              </View>

              <Text style={styles.label}>Apellido</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Introduzca su apellido"
                  placeholderTextColor="#999"
                  value={apellido}
                  onChangeText={handleApellidoChange}
                />
              </View>

              <Text style={styles.label}>Correo electrónico</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
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

              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Introduzca su contraseña"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={handlePasswordChange}
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

              {/* Validaciones de contraseña */}
              <View style={styles.validationContainer}>
                <View style={styles.validationItem}>
                  <Ionicons 
                    name={validations.length ? "checkmark-circle" : "close-circle"} 
                    size={16} 
                    color={validations.length ? "#4CAF50" : "#999"} 
                  />
                  <Text style={validations.length ? styles.valid : styles.invalid}>
                    Mínimo 6 caracteres
                  </Text>
                </View>
                <View style={styles.validationItem}>
                  <Ionicons 
                    name={validations.upper ? "checkmark-circle" : "close-circle"} 
                    size={16} 
                    color={validations.upper ? "#4CAF50" : "#999"} 
                  />
                  <Text style={validations.upper ? styles.valid : styles.invalid}>
                    Al menos una mayúscula
                  </Text>
                </View>
                <View style={styles.validationItem}>
                  <Ionicons 
                    name={validations.lower ? "checkmark-circle" : "close-circle"} 
                    size={16} 
                    color={validations.lower ? "#4CAF50" : "#999"} 
                  />
                  <Text style={validations.lower ? styles.valid : styles.invalid}>
                    Al menos una minúscula
                  </Text>
                </View>
                <View style={styles.validationItem}>
                  <Ionicons 
                    name={validations.number ? "checkmark-circle" : "close-circle"} 
                    size={16} 
                    color={validations.number ? "#4CAF50" : "#999"} 
                  />
                  <Text style={validations.number ? styles.valid : styles.invalid}>
                    Al menos un número
                  </Text>
                </View>
              </View>

              <Text style={styles.label}>Confirmar contraseña</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirme su contraseña"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#666"
                    style={styles.iconRight}
                  />
                </TouchableOpacity>
              </View>

              {/* coincidencia de contraseñas */}
              {confirmPassword.length > 0 && (
                <View style={styles.matchContainer}>
                  <Ionicons 
                    name={passwordsMatch ? "checkmark-circle" : "close-circle"} 
                    size={16} 
                    color={passwordsMatch ? "#4CAF50" : "#C62828"} 
                  />
                  <Text style={passwordsMatch ? styles.matchText : styles.noMatchText}>
                    {passwordsMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.primaryButton, !isFormValid && styles.disabledButton]}
                onPress={handleSignUp}
                disabled={!isFormValid}
              >
                <Text style={styles.primaryButtonText}>Registrarse</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.link}>
                  ¿Ya tiene cuenta? <Text style={styles.linkBold}>Iniciar sesión</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
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
  paddingTop: 40,
},
  header: { 
  alignItems: "center", 
  marginBottom: 20, 
  marginTop: 20,
},
  imageWrapper: { position: "relative", top: -20 },
  headerImage: { width: 300, height: 105, resizeMode: "contain", marginBottom: 30 },
  title: { fontSize: 26, fontWeight: "700", color: "#222" },
  form: { alignItems: "center" },
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
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: "#111" },
  icon: { marginRight: 6 },
  iconRight: { marginLeft: 6 },
  validationContainer: { width: "100%", marginBottom: 14, paddingHorizontal: 4 },
  validationItem: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  valid: { color: "#4CAF50", fontSize: 13, marginLeft: 6, fontWeight: "500" },
  invalid: { color: "#999", fontSize: 13, marginLeft: 6 },
  matchContainer: { flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 14, paddingHorizontal: 4 },
  matchText: { color: "#4CAF50", fontSize: 13, marginLeft: 6, fontWeight: "500" },
  noMatchText: { color: "#C62828", fontSize: 13, marginLeft: 6, fontWeight: "500" },
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