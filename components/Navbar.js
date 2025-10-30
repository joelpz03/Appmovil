import React, { useEffect, useRef, useState } from "react";
import { Animated, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";
import CustomAlert from "../components/CustomAlert";

const PRIMARY = "#800000";

export default function Navbar({ visible = true }) {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: visible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: visible ? 0 : 30,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  const handleLogoutPress = () => {
    // Mostrar confirmación personalizada
    setConfirmVisible(true);
  };

  const handleConfirmLogout = async () => {
    setConfirmVisible(false);
    try {
      await signOut(auth);
      setAlertVisible(true);

      // Cerrar alert y volver al login luego de 2 s
      setTimeout(() => {
        setAlertVisible(false);
      }, 2000);
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <Animated.View
        style={[
          styles.navbar,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home-outline" size={26} color={PRIMARY} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Cursos")}>
          <Ionicons name="book-outline" size={26} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={26} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogoutPress}>
          <Ionicons name="log-out-outline" size={26} color="#333" />
        </TouchableOpacity>
      </Animated.View>

      {/* Confirmación de cierre */}
      <CustomAlert
        visible={confirmVisible}
        title="¿Cerrar sesión?"
        message="¿Seguro que querés salir de tu cuenta?"
        type="warning"
        confirmText="Sí, cerrar sesión"
        cancelText="Cancelar"
        onConfirm={handleConfirmLogout}
        onClose={() => setConfirmVisible(false)}
      />

      {/* Mensaje de cierre exitoso */}
      <CustomAlert
        visible={alertVisible}
        title="Sesión cerrada"
        message="Su sesión se ha cerrado correctamente."
        type="success"
        onClose={() => setAlertVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});