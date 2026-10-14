---
name: tiendas-tuti
description: Sistema visual de Tiendas Tuti (paleta, roles de color y reglas UI de formularios). Úsala siempre que crees, refactorices o revises estilos de componentes o pantallas de esta app (InputField, DateField, FormFields, NavigationButton, CVPreview, pantallas en app/), o cuando el usuario pida aplicar la paleta, el tema o la marca Tuti.
---

# Skill: Tiendas Tuti — Sistema de diseño UI

## Rol de esta skill

Actúa como una **skill reutilizable de diseño**. Cada vez que crees o refactorices un componente o una pantalla de este proyecto:

1. Aplica **solo** los colores y roles definidos aquí. No inventes colores nuevos ni uses hex sueltos.
2. Consume los colores desde el archivo de tokens (`constants/tuti-theme.ts`). Si no existe, créalo primero con el bloque de la sección 5.
3. Cumple **todas** las reglas obligatorias de la sección 4. Al terminar, revisa el componente contra la checklist de la sección 6.
4. Conserva la lógica existente (react-hook-form, validadores en `utils/validators.ts`, `DateField`). Esta skill cambia la presentación, no el comportamiento.

## 1. Paleta oficial

| Token | Nombre | HEX | RGB |
|---|---|---|---|
| `navy` | Azul noche | `#110E59` | `rgb(17, 14, 89)` |
| `blue` | Azul Tuti | `#0F16A6` | `rgb(15, 22, 166)` |
| `periwinkle` | Azul lavanda | `#555BD9` | `rgb(85, 91, 217)` |
| `yellow` | Amarillo Tuti | `#F2E307` | `rgb(242, 227, 7)` |
| `gold` | Amarillo oro | `#F2CB05` | `rgb(242, 203, 5)` |

### Colores de soporte (no son de marca; solo para estos usos)

| Token | Uso | HEX | RGB |
|---|---|---|---|
| `white` | Superficies (cards, inputs) y texto sobre azules | `#FFFFFF` | `rgb(255, 255, 255)` |
| `surface` | Fondo general de pantallas con formularios | `#F4F5FC` | `rgb(244, 245, 252)` |
| `border` | Borde de inputs en reposo | `#C9CBEF` | `rgb(201, 203, 239)` |
| `muted` | Placeholders y texto secundario | `#6B6E9E` | `rgb(107, 110, 158)` |
| `error` | Errores de validación | `#D92D20` | `rgb(217, 45, 32)` |
| `errorBg` | Fondo suave para mensajes de error | `#FDECEA` | `rgb(253, 236, 234)` |

> La paleta de marca no incluye un rojo. Los errores **nunca** se señalan con amarillo, porque el amarillo es el color de acento y de la marca.

## 2. Roles de interfaz

| Rol | Token | Dónde se usa |
|---|---|---|
| **Fondo de marca** | `navy` `#110E59` | Header de navegación (`Stack` `headerStyle`), pantalla de inicio, cabecera del CV en `CVPreview` |
| **Fondo de contenido** | `surface` `#F4F5FC` | `backgroundColor` de los `ScrollView` de formularios |
| **Primario** | `blue` `#0F16A6` | Botón principal (Guardar/Agregar), borde del input con foco, títulos de sección, iconos activos |
| **Secundario** | `periwinkle` `#555BD9` | Botón secundario (Volver/Cancelar), enlaces, borde de input en hover/press, estado pressed del primario |
| **Acento** | `yellow` `#F2E307` | CTA destacado (máximo uno por pantalla, p. ej. "Ver Vista Previa"), badges, subrayado del título activo |
| **Hover / pressed del acento** | `gold` `#F2CB05` | Estado presionado de cualquier elemento amarillo |
| **Texto principal** | `navy` `#110E59` | Labels, títulos y valores de inputs sobre fondos claros |
| **Texto secundario** | `muted` `#6B6E9E` | Placeholders, fechas, subtítulos de cards |
| **Texto sobre azules** | `white` `#FFFFFF` | Sobre `navy`, `blue` y `periwinkle` |
| **Texto sobre amarillos** | `navy` `#110E59` | Sobre `yellow` y `gold` (nunca blanco) |
| **Texto destacado sobre navy** | `yellow` `#F2E307` | Nombre del candidato en el CV, palabra clave del header |

### Contraste verificado (WCAG 2.1)

| Combinación | Ratio | Resultado |
|---|---|---|
| `white` sobre `blue` | 12.5:1 | AAA |
| `white` sobre `navy` | 17.1:1 | AAA |
| `white` sobre `periwinkle` | 5.4:1 | AA |
| `navy` sobre `yellow` | 12.8:1 | AAA |
| `yellow` sobre `navy` | 12.8:1 | AAA |
| `navy` sobre `surface` | 15.7:1 | AAA |
| `error` sobre `white` | 4.8:1 | AA |
| `muted` sobre `white` | 4.8:1 | AA |
| `yellow` sobre `white` | 1.3:1 | **PROHIBIDO para texto** |
| `white` sobre `yellow` | 1.3:1 | **PROHIBIDO** |

## 3. Tipografía y forma

- Labels: 14–16 px, `fontWeight: "600"`, color `navy`.
- Títulos de sección: 20 px, `fontWeight: "bold"`, color `blue`.
- Valor del input: 16 px, color `navy`. No bajes de 16 px, porque iOS hace zoom en inputs más pequeños en web.
- Radio de borde: 10 px en inputs y botones, 12 px en cards.
- Espaciado: 16 px entre campos y 20 px de padding de pantalla.

## 4. Reglas obligatorias para formularios

### 4.1 Botones (`NavigationButton`)
- **Primario:** fondo `blue`, texto `white`, `fontWeight: "600"`. Pressed: fondo `periwinkle`.
- **Secundario:** fondo transparente, borde 1.5 px `periwinkle`, texto `periwinkle`. Pressed: fondo `rgba(85, 91, 217, 0.08)`.
- **Acento (CTA):** fondo `yellow`, texto `navy`. Pressed: fondo `gold`. Solo uno por pantalla.
- **Peligro (eliminar):** fondo `error`, texto `white`.
- **Deshabilitado:** `opacity: 0.5` y sin feedback de press.
- Altura táctil mínima de 48 px (Android) / 44 pt (iOS), y `accessibilityRole="button"`.
- Usa `Pressable` con estilo en función de `pressed` en lugar de `activeOpacity`, para que se vean los colores de estado.

### 4.2 Inputs (`InputField`, `DateField`)
- Reposo: fondo `white`, borde 1 px `border`, texto `navy`, placeholder `muted`.
- **Foco:** borde 2 px `blue`. Compensa con `padding` 1 px menor para que el contenido no salte. El label cambia a color `blue`. Controla el foco con `onFocus`/`onBlur` sin perder el `onBlur` que entrega react-hook-form: llama a ambos.
- Hover/press (DateField y web): borde `periwinkle`.
- Deshabilitado: fondo `surface`, texto `muted`.
- Un campo obligatorio marca el `*` del label en color `blue`.

### 4.3 Estado de error
- Borde 2 px `error`. El estado de error **tiene prioridad sobre el foco**.
- El mensaje va **debajo del input**: 12–13 px, color `error`, con un icono `⚠` delante del texto, y `accessibilityRole="alert"` y `accessibilityLiveRegion="polite"` para que el lector de pantalla lo anuncie.
- No uses `Alert` para errores de validación. Los mensajes vienen de `utils/validators.ts` (`MESSAGES`) y se muestran tal cual.
- El amarillo nunca indica error.

### 4.4 Estado de éxito / guardado
- Confirmaciones con fondo `navy` y texto `white`, con el énfasis en `yellow` (p. ej. el icono ✓).

### 4.5 Cards de listas (experiencia, educación)
- Fondo `white`, radio 12 px, borde izquierdo de 4 px en `blue`, título `navy`, subtítulo y fecha `muted`.

## 5. Tokens (crear en `constants/tuti-theme.ts`)

```ts
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
```

## 6. Checklist de verificación

- [ ] No queda ningún hex suelto en el componente; todo viene de `theme`/`palette`.
- [ ] Ningún texto blanco sobre amarillo, ni amarillo sobre blanco.
- [ ] El input tiene tres estados visibles: reposo, foco (`blue`) y error (`error`, con prioridad).
- [ ] El mensaje de error aparece debajo del campo y viene de `MESSAGES`.
- [ ] Hay como máximo un botón amarillo por pantalla.
- [ ] Los botones miden al menos 44–48 px de alto y tienen estado pressed visible.
- [ ] Se conserva `onBlur` de react-hook-form y `mode: "onChange"` sigue funcionando.
- [ ] `npx tsc --noEmit` y `npx expo lint` pasan.
