//gestion de la interfaz y logica para la iteractividad del usuario

import React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import {useRouter} from "expo-router";
import { useForm } from "react-hook-form";
import { FormInput } from "../components/FormFields";
import { PhotoPicker } from "../components/PhotoPicker";
import {NavigationButton} from "../components/NavigationButton";
import { formScreenStyles } from "../constants/form-styles";
import { useCVContext } from "../context/CVContext";
import { PersonalInfo } from "../types/cv.types";
import { rules } from "../utils/validators";

export  default function PersonalInfoScreen(){
    const router = useRouter();
    const { cvData, updatePersonalInfo, updatePhoto}= useCVContext();
    // el formulario se inicializa con los datos guardados; los errores se validan mientras se escribe
    const { control, handleSubmit } = useForm<PersonalInfo>({
        mode: "onChange",
        defaultValues: cvData.personalInfo,
    });

    const onSave = (data: PersonalInfo) =>{
        updatePersonalInfo(data);
        Alert.alert("Exito", "Información guardada correctamente", [
            {text: "OK", onPress: ()=> router.back()},
        ]);
    }
    return(
        <ScrollView style={styles.container}>
        <View style={styles.content}>
            {/* la foto se guarda al instante, independiente del botón Guardar */}
            <PhotoPicker uri={cvData.photoUri} onChange={updatePhoto} />
            <Text style={styles.sectionTitle}>Datos de Contacto</Text>
            <FormInput
            control={control}
            name="fullName"
            rules={rules.letters({ required: true, min: 3 })}
            label= "Nombre Completo *"
            placeholder= "Juan Perez"
            autoCapitalize= "words"
            />
            <FormInput
            control={control}
            name="email"
            rules={rules.email({ required: true })}
            label= "Email *"
            placeholder= "juan@email.com"
            keyboardType= "email-address"
            autoCapitalize= "none"
            />
            <FormInput
            control={control}
            name="phone"
            rules={rules.phone({ required: true })}
            label= "Telefono *"
            placeholder= "+593 99 999 9999"
            keyboardType= "phone-pad"
            />
            <FormInput
            control={control}
            name="location"
            rules={rules.text({ required: true, min: 3 })}
            label= "Ubicacion *"
            placeholder= "Quito - Ecuador"
            />
            <FormInput
            control={control}
            name="summary"
            rules={rules.longText({ min: 20, max: 500 })}
            label= "Resumen Profesional"
            placeholder= "Describe brevemente tu perfil profesional"
            multiline
            />
            <NavigationButton title="Guardar Informacion " onPress={handleSubmit(onSave)}/>
            <NavigationButton
            title = "Cancelar"
            onPress={()=> router.back()}
            variant="secondary"
            />
            </View>
        </ScrollView>
    )
}

const styles = formScreenStyles;
