//-------- Importation des variables d'environnement contenant les identifiants Supabase
import {EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY,} from "@/config"
import { createClient} from "@supabase/supabase-js"
import * as SecureStore from  "expo-secure-store"
import { Platform } from "react-native"


// Implementation d'un adaptateur de stockage personnalisé pour SecureStore
// cet adaptateur permettre à supabase de stocker les tokens d'authentification
// de maniere sécurisée, selon la platforme.

const ExpoSecureStoreAdapter = { 
    // Recupére un elements deouis le stockage sécurisé 
    getItem : (key: string) => {
        // si on est sur le web, utiliser localStorage
        if (Platform.OS === "web") {
            return localStorage.getItem(key);
        }
        // sinon (mobile), utiliser SecureStore de maniére asynchrone 
        return SecureStore.getItemAsync(key);
    },
    setItem: (key: string, value: string) => {
        // utilisation de localStroge sur le web 
        if (Platform.OS === 'web') {
            localStorage.setItem(key,value);
            return;
        }
        // Utilisation de SecureStore sur mobile
        return SecureStore.setItemAsync(key,value);
    },
    // Supprime un élémént du stockage sécurisé 
    removeItem : (key:string) => {
        // Suppression avec localStorage sur le web 
        if (Platform.OS === "web") {
            localStorage.removeItem(key);
            return;
        }
        //suppression sécurisée avec SecureStore sur mobile
        return SecureStore.deleteItemAsync(key);
    }
};

// Initialisation des variable de la conexion a Supabase
// cet valeur proviennent de tes variables d'environement définies dans config.ts
const supabaseUrl = EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// creation du client Supabase avec configuration de l'authentification 
export const supabase = createClient(supabaseUrl,supabaseAnonKey, {
    auth: {
        // on indique à Supabase d'utiliser notre adaptateur personalisé 
        storage: ExpoSecureStoreAdapter,
        // Active le rafraîchissement automatique du token lorsqu'il expire 
        autoRefreshToken:true,
        // Rend la session persistante (l'utilisateur reste connecté entre les redémarrages)
        persistSession:true,
        // Desactive la détection de session à partir de l'Url, inutile sur mobile
        detectSessionInUrl: false,
    },
    realtime:{
        // Mettre transport: undefined signifie que  Supabase choisir le transport par défaut, donc WebSocket sera automatiquement utilisé.
        transport:undefined,
    },
} );



// la partie realtime dans la configuration de ton client Supabase permet de gérer les connexions en temps réel (websockets) 
// pour écouter les changements de données dans ta base (insertions, modifications, suppressions, etc.) ou pour interagir 
// avec des canaux (channels) en direct.