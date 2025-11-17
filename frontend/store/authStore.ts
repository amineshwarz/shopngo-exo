// importation du client Supabase préconfiguré
import {supabase} from '@/lib/supabase';

// importation de la fonction ' create ' se Zustand pour la gestion d'etat globale
import { create } from 'zustand';

// Definition du type utilisateur, avec id et email 

export interface User {
    id: string;
    email: string;
}

// Définition du type du store d'authentification 
// Il contient l'utilisateur, l'etat de chargement,
// un éventuel message d'erreur, et les méthodes d'authenfication

interface AuthState {
    user: User | null;      //utilisateur connecté ou null
    isLoading: boolean;     // Indique si une opération est en cours 
    error : string | null;  // Contient le message d'erreur éventuel 

    // Actions d'authenfication:
    signup: (email: string, password: string) => Promise<void>;     // créé un compte
    login: (email: string, password: string) => Promise <void>;     // connecte un user
    logout:() => Promise<void>;                                     // Déconnecter l'user 
    checkSession : () => Promise<void>;                             // Vérifier la session en cours
}

// Creation du store Zustand pour gérer l'authentification
export const useAuthStore = create<AuthState> ((set)=> ({
    user: null,                 // l'utilisateur est initialement déconnecté 
    isLoading:false,            // Aucuun chargement en cours
    error:null,                 // pas d'erreur à l'initialisation 

    // fonction de login par email et le mdp
    login : async (email:string, password:string) => {
        try {
            //Début du chargement, réinitialisation de l'erreur
            set ({isLoading:true, error:null});
            //appel à l'API Supabase pour se connecter
            const {data, error}= await supabase.auth.signInWithPassword({
                email,
                password,
            });
            // Gére l'erreur Supabase éventuelle 
            if (error) throw error;

            // Si connexuin réussie, met à jour l'utilisateur dans le store 
            if (data && data.user) {
                set({
                    user:{
                        id: data.user.id,
                        email: data.user.email || "",
                    },
                    isLoading:false,
                });
            }
        } catch (error:any){
            // En cas d'echec, stocké le message d'erreur et arrete le chargement 
            set ({ error: error.message, isLoading: false});
        }     
    },
    // Fonction de création de compte utilisateur
    signup: async (email: string, password: string) => {
        try {
            // Indique le début de processus et réinitialise les erreurs
            set({ isLoading: true, error: null });
            //Appel à l'API Supabase pour créer le compt
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            //Gére les erreurs éventuelles
            if (error) throw error;
            // si succés, stoke le nouvel utilisateur
            if (data && data.user) {
                set({
                    user: {
                        id: data.user.id,
                        email: data.user.email || "",
                    },
                    isLoading: false,
                });
            }
        } catch (error: any) {
            // Gére les erreurs lors de la création de compte
            set({ error: error.message, isLoading: false });
        }
    },

    // Fonction de déconnexion
    logout: async () => {
        try {
            // Début du process de déconnexion, nettoyage de l'erreur
            set({ isLoading: true, error: null });
            // Appel à l'API supabase pour se déconnecter 
            const { error } = await supabase.auth.signOut();
            // Gére les erreurs éventuelles
            if (error) throw error;
            // Réinitialise le store à l'etat déconncté 
            set({ user: null, isLoading: false });
        } catch (error: any) {
            //stoke l'erreur éventuelle
            set({ error: error.message, isLoading: false });
        }
    },

    // Fonction de vérification de session
    checkSession: async () => {
        try {
            // Début du chargement et réinitialisation de l'erreur
            set({ isLoading: true, error: null });
            // Appel à Supabase pour récupérer la session  courante
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error 
            // Si session existante, met a jour l'utilisateur dans le store 
            if (data && data.session ) {
                const {user} = data.session
                set({
                    user: {
                        id: user.id,
                        email: user.email || "",
                    },
                    isLoading: false,
                });
            } else {
                // si aucune session, on met l'utilisateur à null
                set({ user: null, isLoading: false });
            }
        } catch (error: any) {
            //Gestion des erreurs lors du check de session
            set({ user:null, error:error.message, isLoading:false });
        }
    },
}));