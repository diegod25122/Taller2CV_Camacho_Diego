//permite al usuario agregar ver y eliminbar experienca laboral

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, useWatch } from "react-hook-form";
import { FormDate, FormInput } from "../components/FormFields";
import { NavigationButton } from "../components/NavigationButton";
import { formScreenStyles } from "../constants/form-styles";
import { useCVContext } from "../context/CVContext";
import { Experience } from "../types/cv.types";
import { CV_DATE_LIMITS, formatDate, parseDate } from "../utils/date";
import { createId } from "../utils/id";
import { rules } from "../utils/validators";

type ExperienceForm = Omit<Experience, "id">;

const EMPTY_FORM: ExperienceForm = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  description: "",
};

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();

  // los errores se validan mientras el usuario escribe
  const { control, handleSubmit, reset, getValues } = useForm<ExperienceForm>({
    mode: "onChange",
    defaultValues: EMPTY_FORM,
  });
  const startDate = useWatch({ control, name: "startDate" });

  const onAdd = (data: ExperienceForm) => {
    const newExperience: Experience = {
      id: createId(),
      ...data,
    };

    addExperience(newExperience);

    // Limpiar formulario
    reset(EMPTY_FORM);

    Alert.alert("Éxito", "Experiencia agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteExperience(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

        <FormInput
          control={control}
          name="company"
          rules={rules.text({ required: true, min: 2 })}
          label="Empresa *"
          placeholder="Nombre de la empresa"
        />

        <FormInput
          control={control}
          name="position"
          rules={rules.letters({ required: true, min: 3 })}
          label="Cargo *"
          placeholder="Tu posición"
        />

        <FormDate
          control={control}
          name="startDate"
          // al cambiar el inicio se vuelve a validar la fecha de fin
          rules={{
            ...rules.date({
              required: true,
              allowFuture: false,
              minDate: CV_DATE_LIMITS.minDate,
            }),
            deps: "endDate",
          }}
          label="Fecha de Inicio *"
          placeholder="Selecciona la fecha de inicio"
          minimumDate={CV_DATE_LIMITS.minDate()}
          maximumDate={new Date()}
        />

        <FormDate
          control={control}
          name="endDate"
          rules={rules.date({
            allowFuture: false,
            minDate: CV_DATE_LIMITS.minDate,
            notBefore: () => getValues("startDate"),
          })}
          label="Fecha de Fin"
          placeholder="Vacío si es tu trabajo actual"
          minimumDate={parseDate(startDate) ?? CV_DATE_LIMITS.minDate()}
          maximumDate={new Date()}
          clearable
        />

        <FormInput
          control={control}
          name="description"
          rules={rules.longText({ min: 10, max: 1000 })}
          label="Descripción"
          placeholder="Describe tus responsabilidades y logros..."
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }}
        />

        <NavigationButton
          title="Agregar Experiencia"
          onPress={handleSubmit(onAdd)}
        />

        {cvData.experience.length > 0 && (
          <>
            <Text style={styles.listTitle}>Experiencias Agregadas</Text>
            {cvData.experience.map((exp) => (
              <View key={exp.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSubtitle}>{exp.company}</Text>
                  <Text style={styles.cardDate}>
                    {formatDate(exp.startDate)} -{" "}
                    {exp.endDate ? formatDate(exp.endDate) : "Actual"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel="Eliminar experiencia"
                  onPress={() => handleDelete(exp.id)}
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
