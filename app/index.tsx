//home (la primera pestaña que se ve al abrir la app)

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useCVContext } from "../context/CVContext";

export default function HomeScreen() {
  const router = useRouter();
  const { cvData } = useCVContext();

  console.log("CV Data cargado:", cvData); // Para debugging

  const isPersonalInfoComplete =
    cvData.personalInfo.fullName && cvData.personalInfo.email;
  const hasExperience = cvData.experience.length > 0;
  const hasEducation = cvData.education.length > 0;
  const hasSkills = cvData.skills.length > 0;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>Crea tu CV Profesional</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Información Personal</Text>
        <Text style={styles.status}>
          {isPersonalInfoComplete ? "✓ Completado" : "Pendiente"}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/personal-info")}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Experiencia</Text>
        <Text style={styles.status}>
          {hasExperience
            ? `✓ ${cvData.experience.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/experience")}
        >
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Educación</Text>
        <Text style={styles.status}>
          {hasEducation
            ? `✓ ${cvData.education.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/education")}
        >
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Habilidades</Text>
        <Text style={styles.status}>
          {hasSkills ? `✓ ${cvData.skills.length} agregada(s)` : "Pendiente"}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/skills")}
        >
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 30 }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#2ecc71" }]}
          onPress={() => router.push("/preview")}
        >
          <Text style={styles.buttonText}>Ver Vista Previa del CV</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: "#27ae60",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
