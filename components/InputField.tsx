// encapsula logica y diseño de un campo de texto (input o TextInput)
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TextInputProps,
} from "react-native";
import { theme } from "../constants/tuti-theme";

interface InputFieldProps extends TextInputProps{
    label: string;
    error?: string;
}

// separa el "*" final del label para pintarlo con el color primario
export const splitRequired = (label: string) => {
    const required = /\*\s*$/.test(label);
    return { text: label.replace(/\s*\*\s*$/, ""), required };
};

export const FieldLabel = ({ label, active }: { label: string; active?: boolean }) => {
    const { text, required } = splitRequired(label);
    return (
        <Text style={[styles.label, active && styles.labelActive]}>
            {text}
            {required && <Text style={styles.required}> *</Text>}
        </Text>
    );
};

export const FieldError = ({ error }: { error?: string }) =>
    error ? (
        <Text
            style={styles.errorText}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
        >
            ⚠ {error}
        </Text>
    ) : null;

export const InputField = ({label, error, style, onFocus, onBlur, editable = true, ...props}:InputFieldProps) =>{
    const [focused, setFocused] = useState(false);

    return(
        <View style={styles.container}>
            <FieldLabel label={label} active={focused && !error} />
            <TextInput
                style={[
                    styles.input,
                    focused && styles.inputFocused,
                    // el error tiene prioridad sobre el foco
                    !!error && styles.inputError,
                    !editable && styles.inputDisabled,
                    style,
                ]}
                placeholderTextColor={theme.input.placeholder}
                editable={editable}
                accessibilityLabel={splitRequired(label).text}
                // se conserva el onBlur de react-hook-form además del estado visual
                onFocus={(e) => { setFocused(true); onFocus?.(e); }}
                onBlur={(e) => { setFocused(false); onBlur?.(e); }}
                {...props}
            />
            <FieldError error={error} />
        </View>
    )
}


export const fieldStyles = StyleSheet.create({
    container:{
        marginBottom: 16,
    },
    label:{
        fontSize: 15,
        fontWeight: "600",
        color: theme.text.primary,
        marginBottom: 6,
    },
    labelActive:{
        color: theme.input.focus,
    },
    required:{
        color: theme.primary.base,
    },
    input:{
        borderWidth: 1,
        borderColor: theme.input.border,
        borderRadius: theme.radius.input,
        padding: 12,
        fontSize: 16,
        color: theme.text.primary,
        backgroundColor: theme.input.bg,
    },
    // borde de 2px con 1px menos de padding para que el contenido no salte
    inputFocused:{
        borderWidth: 2,
        borderColor: theme.input.focus,
        padding: 11,
    },
    inputHover:{
        borderColor: theme.input.hover,
    },
    inputError:{
        borderWidth: 2,
        borderColor: theme.feedback.error,
        padding: 11,
    },
    inputDisabled:{
        backgroundColor: theme.background.content,
        color: theme.text.secondary,
    },
    errorText:{
        color: theme.feedback.error,
        fontSize: 13,
        marginTop: 4,
    },
});

const styles = fieldStyles;
