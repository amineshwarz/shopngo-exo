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

// -------------------SINGLE PRODUCT-------------------
    export const getProduct = async (id:number):Promise<Product> => {
        try {
            const response =await fetch (`${API_URL}/products/${id}`)
            if (!response.ok){
                throw new Error ('Network response was not OK');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching product with id ${id}', error);
            throw error;
        }
    }

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
// -------------------- Produit par Catégorie --------------------
    const getProductsByCategory = async ( category: string ): Promise<Product[]> => {
        try {
            // Effectue une requête fetch vers l'API pour obtenir les produits d'une catégorie donnée
            const response = await fetch(`${API_URL}/products/category/${category}`);
            // Vérifie que la réponse est correcte
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            // Retourne le tableau des produits récupérés
            return await response.json();
        } catch (error) {
            // Affiche une erreur si la récupération échoue, en affichant la catégorie concernée
            console.error(`Failed to fetch products in category ${category}:`, error);
            // Relance l'erreur
            throw error;
        }
    };
// -------------------- Search Product  --------------------
    const searchProductsApi = async (query: string): Promise<Product[]> => {
        try {
            // Effectue une requête fetch pour obtenir tous les produits
            const response = await fetch (`${API_URL}/products`);
            // Vérifie la validité de la réponse
            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            // Récupère la liste des produits
            const products = await response.json();
            // Prépare le terme de recherche en minuscule et sans espaces superflus
            const searchTerm = query.toLowerCase().trim();
            // Filtre les produits dont le titre, la description ou la catégorie contient le terme recherché
            return products.filter(
                (product :Product) => 
                    product.title.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm)
            );
        } catch (error) {
            // Affiche une erreur en cas d'échec de la recherche
            console.error("Failed to search  products:", error);
            // Relance l'erreur
            throw error;
        }
    };

    export { getProducts, getCategories, getProductsByCategory, searchProductsApi };


// Le type Promise<Product[]> indique que la fonction retourne une promesse contenant un tableau 
// d’objets Product, ce qui permet une autocomplétion et une vérification stricte des données côté TypeScript.

