import React, { useState } from "react";
import { View, Text,TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SignUp() {
  const navigation = useNavigation();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validations, setValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
  });

  const handleNombreChange = (text) => {
    const soloLetras = text.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    setNombre(soloLetras);
  };

  const handleApellidoChange = (text) => {
    const soloLetras = text.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s']/g, "");
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

  const handleSignUp = async () => {
    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Completá todos los campos.");
      return;
    }

    if (!passwordsMatch) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${nombre} ${apellido}`,
      });

      Alert.alert("Cuenta creada", "Registro exitoso. Ahora podés iniciar sesión.");
      navigation.navigate("Home");
    } catch (error) {
      console.log("Error al registrar usuario:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Crear cuenta</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={handleNombreChange}
              placeholder="Tu nombre"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellido</Text>
            <TextInput
              style={styles.input}
              value={apellido}
              onChangeText={handleApellidoChange}
              placeholder="Tu apellido"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/*Campo contraseña*/}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="Contraseña"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.validationContainer}>
              <Text style={validations.length ? styles.valid : styles.invalid}>• Mínimo 6 caracteres</Text>
              <Text style={validations.upper ? styles.valid : styles.invalid}>• Al menos una mayúscula</Text>
              <Text style={validations.lower ? styles.valid : styles.invalid}>• Al menos una minúscula</Text>
              <Text style={validations.number ? styles.valid : styles.invalid}>• Al menos un número</Text>
            </View>
          </View>

          {/*Confirmar contraseña*/}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repetí tu contraseña"
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {confirmPassword.length > 0 && (
              <Text style={passwordsMatch ? styles.matchText : styles.noMatchText}>
                {passwordsMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
              </Text>
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>¿Ya tenés cuenta? Iniciá sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#800000",
    marginBottom: 20,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  validationContainer: {
    marginTop: 5,
  },
  valid: { color: "green", fontSize: 13 },
  invalid: { color: "red", fontSize: 13 },
  matchText: { color: "green", marginTop: 5 },
  noMatchText: { color: "red", marginTop: 5 },
  button: {
    backgroundColor: "#800000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "#800000",
    marginTop: 15,
    textDecorationLine: "underline",
  },
});