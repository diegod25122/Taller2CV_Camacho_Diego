//se encarga de tomar la informacio  y diseñar diseñños atractivos simulando como se veria un cv real
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Image } from "expo-image";
import { CVData } from "../types/cv.types";
import { formatDate } from "../utils/date";

interface CVPreviewProps {
  cvData: CVData;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ cvData }) => {
  const { personalInfo, photoUri, experience, education, skills } = cvData;
  const hardSkills = skills.filter((s) => s.type === "hard");
  const softSkills = skills.filter((s) => s.type === "soft");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header con información personal */}
        <View style={styles.header}>
          {photoUri && (
            <Image source={{ uri: photoUri }} style={styles.photo} contentFit="cover" />
          )}
          <Text style={styles.name}>
            {personalInfo.fullName || "Tu Nombre"}
          </Text>
          <View style={styles.contactInfo}>
            {personalInfo.email && (
              <Text style={styles.contactText}>📧 {personalInfo.email}</Text>
            )}
            {personalInfo.phone && (
              <Text style={styles.contactText}>📱 {personalInfo.phone}</Text>
            )}
            {personalInfo.location && (
              <Text style={styles.contactText}>📍 {personalInfo.location}</Text>
            )}
          </View>
        </View>

        {/* Resumen profesional */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RESUMEN PROFESIONAL</Text>
            <Text style={styles.summaryText}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experiencia laboral */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPERIENCIA LABORAL</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.item}>
                <Text style={styles.itemTitle}>{exp.position}</Text>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                <Text style={styles.itemDate}>
                  {formatDate(exp.startDate)} -{" "}
                  {exp.endDate ? formatDate(exp.endDate) : "Actual"}
                </Text>
                {exp.description && (
                  <Text style={styles.itemDescription}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Educación */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCACIÓN</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.item}>
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                {edu.field && (
                  <Text style={styles.itemSubtitle}>{edu.field}</Text>
                )}
                <Text style={styles.itemInstitution}>{edu.institution}</Text>
                {edu.graduationDate && (
                  <Text style={styles.itemDate}>
                    {formatDate(edu.graduationDate)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Habilidades */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HABILIDADES</Text>
            {[
              { title: "Técnicas", list: hardSkills },
              { title: "Blandas", list: softSkills },
            ].map(
              (group) =>
                group.list.length > 0 && (
                  <View key={group.title} style={styles.item}>
                    <Text style={styles.itemSubtitle}>{group.title}</Text>
                    <Text style={styles.itemDescription}>
                      {group.list.map((s) => s.name).join(" · ")}
                    </Text>
                  </View>
                )
            )}
          </View>
        )}

        {/* Mensaje si no hay datos */}
        {!personalInfo.fullName &&
          experience.length === 0 &&
          education.length === 0 &&
          skills.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No hay información para mostrar.{"\n"}
                Completa las secciones para ver tu CV.
              </Text>
            </View>
          )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#3498db",
    paddingBottom: 16,
    marginBottom: 24,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 12,
  },
  contactInfo: {
    gap: 4,
  },
  contactText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 12,
    letterSpacing: 1,
  },
  summaryText: {
    fontSize: 14,
    color: "#34495e",
    lineHeight: 20,
  },
  item: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  itemInstitution: {
    fontSize: 14,
    color: "#95a5a6",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: "#95a5a6",
    fontStyle: "italic",
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 13,
    color: "#34495e",
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#95a5a6",
    textAlign: "center",
    lineHeight: 24,
  },
});
