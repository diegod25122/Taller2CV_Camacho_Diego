// paleta y roles de Tiendas Tuti; único origen de colores de la app
export const palette = {
  navy: "#110E59",
  blue: "#0F16A6",
  periwinkle: "#555BD9",
  yellow: "#F2E307",
  gold: "#F2CB05",
  white: "#FFFFFF",
  surface: "#F4F5FC",
  border: "#C9CBEF",
  muted: "#6B6E9E",
  error: "#D92D20",
  errorBg: "#FDECEA",
} as const;

export const theme = {
  background: { brand: palette.navy, content: palette.surface, card: palette.white },
  primary: { base: palette.blue, pressed: palette.periwinkle, text: palette.white },
  secondary: { base: palette.periwinkle, pressedBg: "rgba(85, 91, 217, 0.08)" },
  accent: { base: palette.yellow, pressed: palette.gold, text: palette.navy },
  text: { primary: palette.navy, secondary: palette.muted, onDark: palette.white, highlight: palette.yellow },
  input: { bg: palette.white, border: palette.border, focus: palette.blue, hover: palette.periwinkle, placeholder: palette.muted },
  feedback: { error: palette.error, errorBg: palette.errorBg },
  radius: { input: 10, button: 10, card: 12 },
} as const;
