// sirvbe para la navegacion entre pantallas del creador de CV
import React from "react";
import {
    Pressable,
    Text,
    StyleSheet,
    ViewStyle,
} from "react-native";
import { palette, theme } from "../constants/tuti-theme";

type Variant = "primary" | "secondary" | "accent" | "danger";

interface NavigationButtonProps {
    title: string;
    onPress: () => void;
    // "accent" (amarillo) se usa como máximo una vez por pantalla
    variant?: Variant;
    disabled?: boolean;
    style?: ViewStyle;
}

const pressedStyles: Record<Variant, ViewStyle> = {
    primary: { backgroundColor: theme.primary.pressed },
    secondary: { backgroundColor: theme.secondary.pressedBg },
    accent: { backgroundColor: theme.accent.pressed },
    danger: { opacity: 0.85 },
};

export const NavigationButton = ({
    title,
    onPress,
    variant = "primary",
    disabled = false,
    style,
}: NavigationButtonProps) => (
    <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        style={({ pressed }) => [
            styles.button,
            styles[variant],
            pressed && !disabled && pressedStyles[variant],
            disabled && styles.disabled,
            style,
        ]}
    >
        <Text style={[styles.text, textStyles[variant]]}>{title}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    button: {
        minHeight: 48,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: theme.radius.button,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 8,
    },
    primary: {
        backgroundColor: theme.primary.base,
    },
    secondary: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: theme.secondary.base,
    },
    accent: {
        backgroundColor: theme.accent.base,
    },
    danger: {
        backgroundColor: theme.feedback.error,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
    },
});

const textStyles = StyleSheet.create({
    primary: { color: theme.primary.text },
    secondary: { color: theme.secondary.base },
    accent: { color: theme.accent.text },
    danger: { color: palette.white },
});
