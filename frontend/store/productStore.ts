import { getCategories,getProducts } from "@/lib/api";                  // Importation des fonctions pour récupérer les produits et catégories
import { Product } from "@/type";                                       // Importation du type Product
import AsyncStorage from "@react-native-async-storage/async-storage";   // Importation d'AsyncStorage pour le stockage persistant
import {create} from "zustand";                                         // Importation de la fonction create de Zustand pour créer le store
import { createJSONStorage, persist } from "zustand/middleware";        // Importation des middlewares de persistance d'etat

interface ProductsState {
    products: Product[];                     // Tableau des produits
    filtredProducts: Product[];              // Tableau des produits filtrés
    categories: string[];                    // Tableau des catégories
    loading: boolean;                        // Indicateur de chargement
    error: string | null;                    // Message d'erreur

  // Action to fetche products 
    fetchProducts: () => Promise<void>;     //Méthode pour récupérer les produits depuis l'API
    fetchCategories: () => Promise<void>;   // Méthode pour récupérer les catégories depuis l'API
}

//create the store avec Zustand et persist avec AsyncStorage
export const useProductStore = create<ProductsState>()(
    
    //middleware de persistance
    persist(
        (set, get) => ({  
            products: [], // Initialisation du tableau des produits
            filtredProducts: [], // Initialisation du tableau des produits filtrés
            categories: [], // Initialisation du tableau des catégories
            loading: false, // Initialisation de l'indicateur de chargement
            error: null, // Initialisation du message d'erreur
            // Méthode pour récupérer les produits depuis l'API
            fetchProducts: async () => {
                try {
                    set({ loading: true, error: null }); // Début du chargement
                    const products = await getProducts(); // Appel de l'API pour récupérer les produits
                    set({ products, 
                        filtredProducts: products, 
                        loading: false 
                    }); // Mise à jour des produits et fin du chargement

                } catch (error: any) {
                    // set({ error: (error as Error).message, loading: false }); // Gestion des erreurs
                    set ({ error: error.message, loading: false }); // Gestion des erreurs
                }
            },
            // Méthode pour récupérer les catégories depuis l'API
            fetchCategories: async () => {
                try {
                    set({ loading: true, error: null }); // Début du chargement
                    const categories = await getCategories(); // Appel de l'API pour récupérer les catégories
                    set({ categories, loading: false }); // Mise à jour des catégories et fin du chargement
                } catch (error: any) {
                    set({ error: error.message, loading: false }); // Gestion des erreurs
                }
            },
        }),
        
        // opption de middleware de persistance
        {
            name: 'product-storage', // Nom de la clé de stockage
            storage: createJSONStorage(() => AsyncStorage), // Utilisation d'AsyncStorage pour le stockage
        }
    )
);
// ProduitStore: centralise les states et les actions liées aux produits et catégories.