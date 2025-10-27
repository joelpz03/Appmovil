import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";

export default function Navbar({ visible = true }) {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: visible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: visible ? 0 : 30, // se desliza 30px hacia abajo al ocultarse
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  return (
    <Animated.View
      style={[
        styles.navbar,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home-outline" size={26} color="#a40000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Cursos")}>
        <Ionicons name="book-outline" size={26} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Ionicons name="person-outline" size={26} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={26} color="#333" />
      </TouchableOpacity>
    </Animated.View>
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
