import { Product } from '@/type';

const API_URL = 'https://fakestoreapi.com';

//pour récupérer la liste des produits depuis l'API
const getProducts = async (): Promise<Product[]> => {
    try {
        // appel API au endpoint /products
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            // gestion de l'erreur
            throw new Error('Failed to fetch products');
        }
        //conversion de la réponse en JSON
        return await response.json() ;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

