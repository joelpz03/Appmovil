import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";

export default function SignUp({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validatePassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return regex.test(pass);
  };

  const handleSignUp = () => {
    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert("Error", "La contraseña debe tener mínimo 6 caracteres, una mayúscula y una minúscula");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert("Éxito", "Usuario registrado correctamente");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (

    <ImageBackground
          source={{ uri: 'https://i.imgur.com/13yDa3Q.png' }}
          style={styles.background}
          blurRadius={5}
        >
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput style={styles.input} placeholder="Nombre *" placeholderTextColor="#ccc" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Apellido *" placeholderTextColor="#ccc" value={apellido} onChangeText={setApellido} />
      <TextInput style={styles.input} placeholder="Email *" placeholderTextColor="#ccc" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Contraseña *" placeholderTextColor="#ccc" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirmar Contraseña *" placeholderTextColor="#ccc" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center' },
  container: { alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 30 },
  input: { backgroundColor: '#333', color: '#fff', borderRadius: 10, width: '100%', padding: 15, marginBottom: 15 },
  button: { backgroundColor: '#800000', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { marginTop: 15, color: '#fff' },
});