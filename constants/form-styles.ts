// estilos compartidos de las pantallas de formulario (paleta Tiendas Tuti)
import { StyleSheet } from "react-native";
import { palette, theme } from "./tuti-theme";

export const formScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background.content,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.primary.base,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text.primary,
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: theme.background.card,
    borderRadius: theme.radius.card,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary.base,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: palette.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text.primary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: theme.text.secondary,
    marginBottom: 4,
  },
  cardInstitution: {
    fontSize: 14,
    color: theme.text.secondary,
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    color: theme.text.secondary,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.feedback.error,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
