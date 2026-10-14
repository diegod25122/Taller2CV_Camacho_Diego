//muestra la configuracion de como se van a mstrar las pantallas relacionadas con el CV

import {Stack} from "expo-router";
import {CVProvider} from "../context/CVContext";
import { theme } from "../constants/tuti-theme";

export default function RootLayout(){
    return(
        <CVProvider>
            <Stack
            screenOptions={{
                headerStyle:{
                    backgroundColor: theme.background.brand,
                },
                headerTintColor: theme.text.onDark,
                headerTitleStyle:{
                    fontWeight: "bold",
                },
            }}
            >
                <Stack.Screen
                name="index"
                options={{
                    title: "Crear CV",
                    headerShown: false,
                }}
                />
                <Stack.Screen
                name="personal-info"
                options={{
                    title: "Información Personal",
                }}
                />
                <Stack.Screen
                name="experience"
                options={{
                    title: "Experiencia Laboral",
                }}
                />
                <Stack.Screen
                name="education"
                options={{
                    title: "Educación",
                }}
                />
                <Stack.Screen
                name="preview"
                options={{
                    title: "Vista Previa",
                    presentation: "modal",
                }}
                />
    
            </Stack>
        </CVProvider>
    )
}