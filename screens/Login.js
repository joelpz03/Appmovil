import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.imgur.com/13yDa3Q.png' }}
      style={styles.background}
      blurRadius={5}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Instituto del Milagro</Text>
        <TextInput style={styles.input} placeholder="Correo" placeholderTextColor="#ccc" onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#ccc" secureTextEntry onChangeText={setPassword} />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
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