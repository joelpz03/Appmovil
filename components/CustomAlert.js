import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#800000";

export default function CustomAlert({ visible, title, message, type = "info", onClose }) {
  const iconName =
    type === "success"
      ? "checkmark-circle"
      : type === "error"
      ? "close-circle"
      : "information-circle";

  const iconColor =
    type === "success" ? "#4CAF50" : type === "error" ? "#C62828" : PRIMARY;

  const handleClose = () => {
    // Pequeño delay para que el usuario vea la animación de cierre
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 200);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Ionicons name={iconName} size={48} color={iconColor} style={{ marginBottom: 10 }} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#181818ff",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 18,
  },
  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});