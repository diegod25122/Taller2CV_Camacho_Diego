// permite agregar y eliminar habilidades blandas y duras
import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { FormInput } from "../components/FormFields";
import { NavigationButton } from "../components/NavigationButton";
import { formScreenStyles } from "../constants/form-styles";
import { palette, theme } from "../constants/tuti-theme";
import { useCVContext } from "../context/CVContext";
import { SkillType } from "../types/cv.types";
import { createId } from "../utils/id";
import { rules } from "../utils/validators";

const TYPES: { value: SkillType; label: string; hint: string }[] = [
  { value: "hard", label: "Duras", hint: "Ej: React, Excel, Inglés B2" },
  { value: "soft", label: "Blandas", hint: "Ej: Trabajo en equipo, Liderazgo" },
];

export default function SkillsScreen() {
  const router = useRouter();
  const { cvData, addSkill, deleteSkill } = useCVContext();
  const [type, setType] = useState<SkillType>("hard");

  const { control, handleSubmit, reset } = useForm<{ name: string }>({
    mode: "onChange",
    defaultValues: { name: "" },
  });

  const onAdd = ({ name }: { name: string }) => {
    addSkill({ id: createId(), name: name.trim(), type });
    reset({ name: "" });
  };

  // valida que la habilidad no esté repetida dentro del mismo tipo
  const notDuplicated = (value: string) =>
    !cvData.skills.some(
      (s) => s.type === type && s.name.toLowerCase() === value.trim().toLowerCase()
    ) || "Esta habilidad ya fue agregada";

  const nameRules = rules.text({ required: true, min: 2 });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Habilidad</Text>

        {/* selector de tipo de habilidad */}
        <View style={local.segment} accessibilityRole="radiogroup">
          {TYPES.map((t) => {
            const active = type === t.value;
            return (
              <Pressable
                key={t.value}
                onPress={() => setType(t.value)}
                style={[local.segmentItem, active && local.segmentActive]}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
              >
                <Text style={[local.segmentText, active && local.segmentTextActive]}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FormInput
          control={control}
          name="name"
          rules={{
            ...nameRules,
            validate: { ...(nameRules.validate as object), notDuplicated },
          }}
          label="Habilidad *"
          placeholder={TYPES.find((t) => t.value === type)?.hint}
          returnKeyType="done"
          onSubmitEditing={handleSubmit(onAdd)}
        />

        <NavigationButton title="Agregar Habilidad" onPress={handleSubmit(onAdd)} />

        {TYPES.map((t) => {
          const list = cvData.skills.filter((s) => s.type === t.value);
          if (list.length === 0) return null;
          return (
            <View key={t.value}>
              <Text style={styles.listTitle}>Habilidades {t.label}</Text>
              <View style={local.chips}>
                {list.map((skill) => (
                  <View key={skill.id} style={[local.chip, t.value === "soft" && local.chipSoft]}>
                    <Text style={[local.chipText, t.value === "soft" && local.chipTextSoft]}>
                      {skill.name}
                    </Text>
                    <Pressable
                      onPress={() => deleteSkill(skill.id)}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel={`Eliminar ${skill.name}`}
                    >
                      <Text style={[local.chipText, t.value === "soft" && local.chipTextSoft]}>✕</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

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

const local = StyleSheet.create({
  segment: {
    flexDirection: "row",
    backgroundColor: palette.white,
    borderRadius: theme.radius.button,
    borderWidth: 1,
    borderColor: theme.input.border,
    padding: 4,
    marginBottom: 16,
  },
  segmentItem: {
    flex: 1,
    minHeight: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentActive: {
    backgroundColor: theme.primary.base,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.secondary.base,
  },
  segmentTextActive: {
    color: theme.primary.text,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  // duras en azul, blandas en amarillo (texto navy por contraste)
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: theme.primary.base,
  },
  chipSoft: {
    backgroundColor: theme.accent.base,
  },
  chipText: {
    color: theme.primary.text,
    fontSize: 14,
    fontWeight: "600",
  },
  chipTextSoft: {
    color: theme.accent.text,
  },
});
