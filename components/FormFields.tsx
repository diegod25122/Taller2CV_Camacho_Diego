// conecta InputField y DateField con react-hook-form; el error se muestra debajo de cada campo
import React from "react";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { TextInputProps } from "react-native";
import { InputField } from "./InputField";
import { DateField } from "./DateField";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  rules?: RegisterOptions<T, FieldPath<T>>;
  label: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  rules,
  label,
  ...inputProps
}: FormFieldProps<T> & Omit<TextInputProps, "value" | "onChangeText" | "onBlur">) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <InputField
          label={label}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          {...inputProps}
        />
      )}
    />
  );
}

export function FormDate<T extends FieldValues>({
  control,
  name,
  rules,
  label,
  clearable,
  ...dateProps
}: FormFieldProps<T> & {
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  clearable?: boolean;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <DateField
          label={label}
          value={value}
          onChange={onChange}
          onClear={clearable ? () => onChange("") : undefined}
          error={error?.message}
          {...dateProps}
        />
      )}
    />
  );
}
