import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ScrollView, TouchableOpacity } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { signOut } from "firebase/auth";
import { auth } from '../src/config/firebaseConfig';

export default function Home({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://img.freepik.com/foto-gratis/fondo-desenfocado-interior-escuela_23-2148723407.jpg' }}
      style={styles.background}
      blurRadius={5}
    >
      <View style={styles.logoContainer}>
        <Image source={require("../assets/logoenpng.png")} style={styles.logo} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Instituto del Milagro</Text>
        
        <Text style={styles.subtitle}>Bienvenido a la aplicación móvil institucional</Text>

        <View style={styles.videoContainer}>
          <YoutubePlayer height={200} play={false} videoId={'Qg4VitUVPyY'} />
        </View>

        <Text style={styles.sectionTitle}>Noticias</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inscripciones 2025</Text>
          <Text>Ya se encuentran abiertas las inscripciones para el ciclo lectivo 2025.</Text>
        </View>

        <Text style={styles.sectionTitle}>Eventos próximos</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Acto de fin de curso</Text>
          <Text>Fecha: 20 de diciembre - 18:00 hs</Text>
        </View>
      </ScrollView>

      {/* BARRA INFERIOR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Cursos")} style={styles.bottomButton}>
          <Text style={styles.bottomText}>Cursos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.bottomButton}> 
          <Text style={styles.bottomText}>Cerrar sesión</Text> 
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 100,
  },
  logo: {
    width: 90, 
    height: 95,
    resizeMode: "contain",
    marginBottom: 10,
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#fff',
  },
  videoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#fff',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomButton: {
    paddingHorizontal: 20,
  },
  bottomText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});