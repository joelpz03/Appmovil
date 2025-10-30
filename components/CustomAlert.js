import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#800000";

export default function CustomAlert({
  visible,
  title,
  message,
  type = "info",
  onClose,
  onConfirm,
  confirmText = "Aceptar",
  cancelText,
}) {
  const iconName =
    type === "success"
      ? "checkmark-circle"
      : type === "error"
      ? "close-circle"
      : type === "warning"
      ? "alert-circle"
      : "information-circle";

  const iconColor =
    type === "success" ? "#4CAF50" :
    type === "error" ? "#C62828" :
    type === "warning" ? "#E67E22" : PRIMARY;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Ionicons name={iconName} size={48} color={iconColor} style={{ marginBottom: 10 }} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            {cancelText && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.cancelText]}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm || onClose}
            >
              <Text style={styles.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
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
    width: "82%",
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
    color: "#181818",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 18,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: PRIMARY,
  },
  cancelButton: {
    backgroundColor: "#eee",
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 15,
    color: "#fff",
  },
  cancelText: {
    color: "#444",
  },
});