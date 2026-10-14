// reglas de validación reutilizables para react-hook-form (se evalúan en tiempo real con mode: "onChange")
import { FieldValues, RegisterOptions } from "react-hook-form";
import { parseDate, toISODate } from "./date";

const LETTERS = "A-Za-zÀ-ÖØ-öø-ÿ";

export const PATTERNS = {
  // solo letras y separadores propios de nombres: "María José O'Neil-Pérez"
  letters: new RegExp(`^[${LETTERS}\\s'.-]+$`),
  // texto general: letras, números y puntuación básica (empresas, instituciones, ciudades)
  text: new RegExp(`^[${LETTERS}0-9\\s'.,&()/#-]+$`),
  // dígitos con prefijo + opcional y espacios/guiones como separadores
  phone: /^\+?[0-9][0-9\s-]*$/,
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
};

export const MESSAGES = {
  required: "Este campo es obligatorio",
  number: "Ingrese un número válido",
  text: "Ingrese un texto válido",
  letters: "Solo se permiten letras",
  email: "Ingrese un correo electrónico válido",
  date: "Ingrese una fecha válida",
  futureDate: "La fecha no puede ser futura",
  endBeforeStart: "La fecha de fin no puede ser anterior a la de inicio",
  tooOld: (year: number) => `Ingrese una fecha real (desde ${year})`,
  tooFar: (year: number) => `Ingrese una fecha real (hasta ${year})`,
};

// subconjunto independiente del formulario, asignable a las reglas de cualquier campo de texto
type Rules = Pick<
  RegisterOptions<FieldValues, string>,
  "required" | "validate" | "maxLength" | "pattern"
>;

// ignora los campos opcionales vacíos para no exigir formato cuando no hay valor
const optional = (test: (v: string) => true | string) => (value: string) =>
  !value?.trim() ? true : test(value.trim());

// rechaza valores formados solo por espacios
const notBlank = (value: string) => !!value?.trim() || MESSAGES.required;

const minLength = (min: number) => (v: string) =>
  v.length >= min || `${MESSAGES.text} (mínimo ${min} caracteres)`;

export const rules = {
  // nombres, cargos, títulos: solo letras
  letters: ({ required = false, min = 2 } = {}): Rules => ({
    ...(required && { required: MESSAGES.required }),
    validate: {
      ...(required && { notBlank }),
      pattern: optional((v) => PATTERNS.letters.test(v) || MESSAGES.letters),
      minLength: optional(minLength(min)),
    },
    maxLength: { value: 80, message: `${MESSAGES.text} (máximo 80 caracteres)` },
  }),

  // empresas, instituciones, ubicaciones: letras, números y puntuación básica
  text: ({ required = false, min = 2 } = {}): Rules => ({
    ...(required && { required: MESSAGES.required }),
    validate: {
      ...(required && { notBlank }),
      pattern: optional((v) => PATTERNS.text.test(v) || MESSAGES.text),
      minLength: optional(minLength(min)),
    },
    maxLength: { value: 100, message: `${MESSAGES.text} (máximo 100 caracteres)` },
  }),

  // textos largos libres (resumen, descripción)
  longText: ({ min = 10, max = 500 } = {}): Rules => ({
    validate: { minLength: optional(minLength(min)) },
    maxLength: { value: max, message: `${MESSAGES.text} (máximo ${max} caracteres)` },
  }),

  email: ({ required = false } = {}): Rules => ({
    ...(required && { required: MESSAGES.required }),
    validate: { ...(required && { notBlank }) },
    pattern: { value: PATTERNS.email, message: MESSAGES.email },
  }),

  phone: ({ required = false } = {}): Rules => ({
    ...(required && { required: MESSAGES.required }),
    validate: {
      ...(required && { notBlank }),
      pattern: optional((v) => PATTERNS.phone.test(v) || MESSAGES.number),
      // entre 7 y 15 dígitos (estándar E.164)
      digits: optional((v) => {
        const digits = v.replace(/\D/g, "").length;
        return (digits >= 7 && digits <= 15) || MESSAGES.number;
      }),
    },
  }),

  // fechas guardadas como "YYYY-MM-DD"
  date: ({
    required = false,
    allowFuture = true,
    minDate,
    maxDate,
    notBefore,
  }: {
    required?: boolean;
    allowFuture?: boolean;
    minDate?: () => Date;
    maxDate?: () => Date;
    notBefore?: () => string;
  } = {}): Rules => ({
    ...(required && { required: MESSAGES.required }),
    validate: {
      valid: optional((v) => !!parseDate(v) || MESSAGES.date),
      future: optional((v) => allowFuture || v <= toISODate(new Date()) || MESSAGES.futureDate),
      // evita fechas irreales como 1950
      min: optional((v) => {
        const min = minDate?.();
        return !min || v >= toISODate(min) || MESSAGES.tooOld(min.getFullYear());
      }),
      max: optional((v) => {
        const max = maxDate?.();
        return !max || v <= toISODate(max) || MESSAGES.tooFar(max.getFullYear());
      }),
      order: optional((v) => {
        const start = notBefore?.();
        return !start || v >= start || MESSAGES.endBeforeStart;
      }),
    },
  }),
};
