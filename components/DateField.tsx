// campo de fecha que abre el selector nativo (DatePicker) y guarda la fecha como "YYYY-MM-DD"
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FieldError, FieldLabel, fieldStyles, splitRequired } from "./InputField";
import { palette, theme } from "../constants/tuti-theme";
import { formatDate, parseDate, toISODate } from "../utils/date";

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  // si se define, muestra un botón para borrar la fecha
  onClear?: () => void;
}

export const DateField = ({
  label,
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  error,
  minimumDate,
  maximumDate,
  onClear,
}: DateFieldProps) => {
  const [show, setShow] = useState(false);
  const [pressed, setPressed] = useState(false);
  const selected = parseDate(value);
  const [tempDate, setTempDate] = useState<Date>(selected ?? new Date());
  // mientras el calendario está abierto el campo se considera enfocado
  const focused = show;

  const open = () => {
    setTempDate(selected ?? maximumDate ?? new Date());
    setShow(true);
  };

  const confirm = (date: Date) => {
    setShow(false);
    onChange(toISODate(date));
  };

  // en web no existe el picker nativo: se usa el <input type="date"> del navegador
  if (Platform.OS === "web") {
    return (
      <View style={fieldStyles.container}>
        <FieldLabel label={label} />
        {React.createElement("input", {
          type: "date",
          value,
          "aria-label": splitRequired(label).text,
          min: minimumDate ? toISODate(minimumDate) : undefined,
          max: maximumDate ? toISODate(maximumDate) : undefined,
          onChange: (e: { target: { value: string } }) =>
            onChange(e.target.value),
          style: {
            border: `${error ? 2 : 1}px solid ${error ? theme.feedback.error : theme.input.border}`,
            borderRadius: theme.radius.input,
            padding: error ? 11 : 12,
            fontSize: 16,
            color: theme.text.primary,
            backgroundColor: theme.input.bg,
            accentColor: theme.primary.base,
            fontFamily: "inherit",
          },
        })}
        <FieldError error={error} />
      </View>
    );
  }

  return (
    <View style={fieldStyles.container}>
      <FieldLabel label={label} active={focused && !error} />
      <View
        style={[
          fieldStyles.input,
          styles.row,
          pressed && fieldStyles.inputHover,
          focused && fieldStyles.inputFocused,
          // el error tiene prioridad sobre el foco
          !!error && fieldStyles.inputError,
        ]}
      >
        <Pressable
          style={styles.pressable}
          onPress={open}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          accessibilityRole="button"
          accessibilityLabel={splitRequired(label).text}
          accessibilityHint="Abre el calendario"
        >
          <Text style={selected ? styles.valueText : styles.placeholderText}>
            {selected ? formatDate(value) : placeholder}
          </Text>
        </Pressable>
        {!!onClear && !!selected ? (
          <Pressable onPress={onClear} hitSlop={8} accessibilityLabel="Borrar fecha">
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        ) : (
          <Text style={styles.icon}>📅</Text>
        )}
      </View>
      <FieldError error={error} />

      {/* Android: el componente abre un diálogo nativo mientras está montado */}
      {show && Platform.OS === "android" && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          accentColor={theme.primary.base}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onValueChange={(_, date) => confirm(date)}
          onDismiss={() => setShow(false)}
        />
      )}

      {/* iOS: calendario dentro de una hoja inferior con botones de confirmación */}
      {Platform.OS === "ios" && (
        <Modal
          visible={show}
          transparent
          animationType="slide"
          onRequestClose={() => setShow(false)}
        >
          <Pressable style={styles.backdrop} onPress={() => setShow(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Pressable onPress={() => setShow(false)} hitSlop={8}>
                <Text style={styles.sheetCancel}>Cancelar</Text>
              </Pressable>
              <Text style={styles.sheetTitle}>{splitRequired(label).text}</Text>
              <Pressable onPress={() => confirm(tempDate)} hitSlop={8}>
                <Text style={styles.sheetDone}>Listo</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="inline"
              locale="es-ES"
              themeVariant="light"
              accentColor={theme.primary.base}
              textColor={theme.text.primary}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              onValueChange={(_, date) => setTempDate(date)}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // el padding vertical lo pone el Pressable para que toda el área sea táctil
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 0,
    paddingLeft: 0,
  },
  pressable: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 12,
  },
  valueText: {
    fontSize: 16,
    color: theme.text.primary,
    textTransform: "capitalize",
  },
  placeholderText: {
    fontSize: 16,
    color: theme.input.placeholder,
  },
  icon: {
    fontSize: 16,
  },
  clearText: {
    fontSize: 16,
    color: theme.text.secondary,
    fontWeight: "bold",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(17, 14, 89, 0.4)",
  },
  sheet: {
    backgroundColor: palette.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text.primary,
  },
  sheetCancel: {
    fontSize: 16,
    color: theme.secondary.base,
  },
  sheetDone: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.primary.base,
  },
});
