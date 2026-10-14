//ghestiona informacion de la educacion
import React from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { FormDate, FormInput } from "../components/FormFields";
import { NavigationButton } from "../components/NavigationButton";
import { formScreenStyles } from "../constants/form-styles";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";
import { CV_DATE_LIMITS, formatDate } from "../utils/date";
import { createId } from "../utils/id";
import { rules } from "../utils/validators";

type EducationForm = Omit<Education, "id">;

const EMPTY_FORM: EducationForm = {
  institution: "",
  degree: "",
  field: "",
  graduationDate: "",
};

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  // los errores se validan mientras el usuario escribe
  const { control, handleSubmit, reset } = useForm<EducationForm>({
    mode: "onChange",
    defaultValues: EMPTY_FORM,
  });

  const onAdd = (data: EducationForm) => {
    const newEducation: Education = {
      id: createId(),
      ...data,
    };

    addEducation(newEducation);

    // Limpiar formulario
    reset(EMPTY_FORM);

    Alert.alert("Éxito", "Educación agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta educación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteEducation(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Educación</Text>

        <FormInput
          control={control}
          name="institution"
          rules={rules.text({ required: true, min: 3 })}
          label="Institución *"
          placeholder="Nombre de la universidad/institución"
        />

        <FormInput
          control={control}
          name="degree"
          rules={rules.letters({ required: true, min: 3 })}
          label="Título/Grado *"
          placeholder="Ej: Licenciatura, Maestría"
        />

        <FormInput
          control={control}
          name="field"
          rules={rules.letters({ min: 3 })}
          label="Área de Estudio"
          placeholder="Ej: Ingeniería en Sistemas"
        />

        <FormDate
          control={control}
          name="graduationDate"
          // se permiten graduaciones en curso, pero dentro de un rango realista
          rules={rules.date({
            minDate: CV_DATE_LIMITS.minDate,
            maxDate: CV_DATE_LIMITS.maxGraduationDate,
          })}
          label="Fecha de Graduación"
          placeholder="Selecciona la fecha"
          minimumDate={CV_DATE_LIMITS.minDate()}
          maximumDate={CV_DATE_LIMITS.maxGraduationDate()}
          clearable
        />

        <NavigationButton
          title="Agregar Educación"
          onPress={handleSubmit(onAdd)}
        />

        {cvData.education.length > 0 && (
          <>
            <Text style={styles.listTitle}>Educación Agregada</Text>
            {cvData.education.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{edu.degree}</Text>
                  <Text style={styles.cardSubtitle}>{edu.field}</Text>
                  <Text style={styles.cardInstitution}>{edu.institution}</Text>
                  <Text style={styles.cardDate}>
                    {formatDate(edu.graduationDate)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel="Eliminar educación"
                  onPress={() => handleDelete(edu.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = formScreenStyles;
