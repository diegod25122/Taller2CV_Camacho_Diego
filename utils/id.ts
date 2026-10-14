// genera un identificador único para los elementos agregados al CV
export const createId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
