// permite elegir la foto de perfil desde la cámara o la galería (expo-image-picker)
import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { palette, theme } from "../constants/tuti-theme";

interface PhotoPickerProps {
  uri: string | null;
  onChange: (uri: string | null) => void;
}

// recorte cuadrado y compresión para que la foto pese poco
const OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.7,
};

export const PhotoPicker = ({ uri, onChange }: PhotoPickerProps) => {
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a la cámara para tomar tu foto.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ ...OPTIONS, cameraType: ImagePicker.CameraType.front });
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync(OPTIONS);
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} contentFit="cover" />
        ) : (
          <Text style={styles.placeholder}>👤</Text>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={takePhoto}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>📷 Cámara</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={pickFromGallery}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>🖼️ Galería</Text>
        </Pressable>
      </View>

      {!!uri && (
        <Pressable onPress={() => onChange(null)} hitSlop={8} accessibilityRole="button">
          <Text style={styles.remove}>Quitar foto</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.accent.base,
    backgroundColor: theme.background.brand,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    fontSize: 48,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: theme.radius.button,
    borderWidth: 1.5,
    borderColor: theme.secondary.base,
    backgroundColor: palette.white,
  },
  buttonPressed: {
    backgroundColor: theme.secondary.pressedBg,
  },
  buttonText: {
    color: theme.secondary.base,
    fontSize: 15,
    fontWeight: "600",
  },
  remove: {
    marginTop: 10,
    color: theme.feedback.error,
    fontSize: 14,
    fontWeight: "600",
  },
});
