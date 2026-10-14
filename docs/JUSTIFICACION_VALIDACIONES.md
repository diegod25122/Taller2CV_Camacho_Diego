# Justificación técnica: validación de formularios con `react-hook-form`

## 1. Requerimiento

Agregar validadores de ingreso de datos que se ejecuten **en tiempo de ejecución** sobre los campos de los formularios de la aplicación (Información Personal, Experiencia Laboral y Educación), mostrando los errores directamente en la interfaz.

## 2. Librería seleccionada

**`react-hook-form` v7** (instalada con `npx expo install react-hook-form`).

## 3. Justificación

Se implementó `react-hook-form` porque el proyecto está construido sobre React (React Native + Expo). El criterio principal fue el **manejo de inputs y su rendimiento**, gestionando los errores directamente en la UI. Este argumento se sustenta en los siguientes puntos:

### 3.1 Rendimiento
- **Suscripción aislada por campo:** el estado del formulario vive en un *store* interno (refs), no en `useState` del componente. Al escribir en un campo, solo se vuelve a renderizar el `Controller` de ese campo, no la pantalla completa. Antes, cada pulsación de tecla ejecutaba `setFormData({...formData})` y re-renderizaba todo el formulario.
- **Proxy de `formState`:** solo se recalcula y notifica el estado que el componente lee (por ejemplo `errors`). Si no se lee `isDirty` o `touchedFields`, esos cálculos no disparan renders.
- **Tamaño reducido:** cerca de 10 kB gzip y sin dependencias, importante en un bundle móvil.

### 3.2 Validación en tiempo real
- `useForm({ mode: "onChange" })` ejecuta las reglas en cada cambio del valor, así que el mensaje de error aparece mientras el usuario escribe y desaparece apenas el dato se corrige.
- `deps` permite revalidar campos dependientes. Al cambiar la *Fecha de Inicio* se vuelve a validar la *Fecha de Fin*.

### 3.3 Gestión de errores en la UI
- Cada regla define su propio mensaje (`{ value, message }` o `validate` que retorna un `string`). El mensaje llega al componente como `fieldState.error.message` y se renderiza condicionalmente debajo del input, con el borde en rojo.
- `handleSubmit` valida todos los campos y bloquea el envío si existe algún error, mostrando los mensajes en los campos que aún no se habían tocado. Por eso se eliminaron los `Alert.alert("Error", ...)` manuales.

### 3.4 API declarativa y reutilizable
- Las reglas nativas (`required`, `pattern`, `minLength`, `maxLength`, `validate`) cubren todos los casos sin código imperativo.
- Las reglas se centralizaron en `utils/validators.ts` como funciones parametrizables (`rules.letters({ required, min })`) y se reutilizan en las tres pantallas.
- Tiene tipado completo con TypeScript: `name` solo acepta claves existentes del modelo (`PersonalInfo`, `Experience`, `Education`).

### 3.5 Comparación con alternativas

| Criterio | react-hook-form | Formik + Yup | Validación manual (`useState`) |
|---|---|---|---|
| Re-render por tecla | Solo el campo | Todo el formulario | Todo el formulario |
| Validación `onChange` | Nativa (`mode`) | `validateOnChange` | Manual |
| Dependencias | 0 | Formik + Yup | — |
| Soporte React Native | Oficial (`Controller`) | Sí | — |
| Mantenimiento activo | Alto | Bajo (última versión mayor en 2021) | — |

### 3.6 Adaptación a React Native
En web, `react-hook-form` usa inputs **no controlados** mediante `{...register("campo")}`, que se conecta al `ref` y a los eventos del DOM. En React Native, `TextInput` no expone esa interfaz DOM, por lo que la documentación oficial indica usar **`Controller`**. Este componente conserva la ventaja de rendimiento: el valor sigue en el *store* de react-hook-form y solo se re-renderiza el campo que cambia. Para no repetir código, se crearon los envoltorios `FormInput` y `FormDate` (`components/FormFields.tsx`).

## 4. Reglas implementadas

Todas las pantallas usan `mode: "onChange"`.

| Pantalla | Campo | Tipo semántico | Reglas | Mensajes |
|---|---|---|---|---|
| Información Personal | Nombre Completo * | Nombre | Obligatorio, sin solo espacios, solo letras, mín. 3, máx. 80 | Este campo es obligatorio / Solo se permiten letras / Ingrese un texto válido |
| | Email * | Correo | Obligatorio, `pattern` email | Ingrese un correo electrónico válido |
| | Teléfono * | Teléfono | Obligatorio, solo dígitos, `+`, espacios o guiones, entre 7 y 15 dígitos (E.164) | Ingrese un número válido |
| | Ubicación * | Texto | Obligatorio, letras, números y puntuación básica, mín. 3 | Ingrese un texto válido |
| | Resumen Profesional | Texto largo | Opcional, mín. 20, máx. 500 | Ingrese un texto válido |
| Experiencia | Empresa * | Texto | Obligatorio, letras, números y puntuación básica, mín. 2 | Ingrese un texto válido |
| | Cargo * | Nombre | Obligatorio, solo letras, mín. 3 | Solo se permiten letras |
| | Fecha de Inicio * | Fecha | Obligatoria, fecha válida, no futura, no más de 50 años atrás | Este campo es obligatorio / La fecha no puede ser futura / Ingrese una fecha real (desde AAAA) |
| | Fecha de Fin | Fecha | Opcional, no futura, no anterior al inicio, no más de 50 años atrás | La fecha de fin no puede ser anterior a la de inicio / Ingrese una fecha real (desde AAAA) |
| | Descripción | Texto largo | Opcional, mín. 10, máx. 1000 | Ingrese un texto válido |
| Educación | Institución * | Texto | Obligatorio, mín. 3 | Ingrese un texto válido |
| | Título/Grado * | Nombre | Obligatorio, solo letras, mín. 3 | Solo se permiten letras |
| | Área de Estudio | Nombre | Opcional, solo letras, mín. 3 | Solo se permiten letras |
| | Fecha de Graduación | Fecha | Opcional, fecha válida, entre 50 años atrás y 6 años adelante (graduación en curso) | Ingrese una fecha real (desde AAAA / hasta AAAA) |

Los límites de fecha se calculan desde la fecha actual (`CV_DATE_LIMITS` en `utils/date.ts`), así que siguen siendo válidos con el paso de los años. Además de validarse, se aplican como `minimumDate`/`maximumDate` del calendario, de modo que el usuario ni siquiera puede elegir fechas fuera de rango.

Los campos opcionales solo validan formato cuando tienen valor. Los obligatorios rechazan valores compuestos solo por espacios.

## 5. Archivos

- `utils/validators.ts`: patrones, mensajes y reglas reutilizables.
- `components/FormFields.tsx`: `FormInput` y `FormDate`, que conectan `Controller` con `InputField` y `DateField` y muestran el error.
- `app/personal-info.tsx`, `app/experience.tsx`, `app/education.tsx`: `useForm({ mode: "onChange" })` y `handleSubmit`.
