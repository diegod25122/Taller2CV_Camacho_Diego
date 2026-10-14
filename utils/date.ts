// utilidades para guardar fechas como "YYYY-MM-DD" y mostrarlas como "enero 2020"

const pad = (n: number) => n.toString().padStart(2, "0");

// usa la fecha local (no UTC) para no correr el día por la zona horaria
export const toISODate = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseDate = (value: string): Date | undefined => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

// fecha de hoy desplazada n años (negativo = hacia atrás)
export const yearsFromToday = (years: number): Date => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + years);
  return date;
};

// rango realista para fechas del CV
export const CV_DATE_LIMITS = {
  // nadie tiene una trayectoria activa de más de 50 años
  minDate: () => yearsFromToday(-50),
  // una graduación en curso puede terminar como máximo dentro de 6 años
  maxGraduationDate: () => yearsFromToday(6),
};

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// si el valor no es una fecha ISO (datos antiguos escritos a mano) se muestra tal cual
export const formatDate = (value: string): string => {
  const date = parseDate(value);
  if (!date) return value;
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};
