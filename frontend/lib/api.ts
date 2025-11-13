import { Product } from '@/type';

    const API_URL = 'https://fakestoreapi.com'; // Définition de l'URL de base de l'API utilisée

// -------------------ALL PRODUCTS-------------------
    
    const getProducts = async (): Promise<Product[]> => {          // Fonction asynchrone pour récupérer la liste des produits depuis l'API
        try {
            const response = await fetch(`${API_URL}/products`);  // On effectue une requête HTTP GET pour récupérer les produits
            if (!response.ok) {                                   // Vérification du succès de la requête (status HTTP dans la plage 200-299)
                throw new Error('Failed to fetch products');     // Si la réponse n'est pas OK, on lance une erreur personnalisée
            }
            return await response.json();                        // Si tout va bien, on transforme la réponse en JSON puis on la retourne
        } catch (error) {
            console.error('Error fetching products:', error);   // En cas d'erreur (réseau, parsing...), on affiche l'erreur dans la console
            throw error;                                        // On relance l'erreur pour qu'elle puisse être gérée par l'appelant
        }
    };

// -------------------- ALL CATEGORIES --------------------
    const getCategories = async (): Promise<string[]> => {                  // Fonction asynchrone pour récupérer les catégories de produits
        try {
            const response = await fetch(`${API_URL}/products/categories`); // Requête HTTP GET pour obtenir les catégories
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            return await response.json();                           // Transformation de la réponse en JSON et retour des données
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    export { getProducts, getCategories };


// Le type Promise<Product[]> indique que la fonction retourne une promesse contenant un tableau 
// d’objets Product, ce qui permet une autocomplétion et une vérification stricte des données côté TypeScript.

