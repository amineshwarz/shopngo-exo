import { Dimensions, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'  // Hook spécifique à Expo Router pour récupérer les paramètres de l'URL/Navigation
import CommonHeader from '@/components/CommonHeader';
import { AppColors } from '@/constants/theme';
import { Product } from '@/type';
import { getProduct } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';
import Rating from '@/components/Rating';
import { AntDesign } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useCartStore } from '@/store/cartStore';
import { useFavoritesStore } from '@/store/favoriteStore';


const {width}= Dimensions.get('window');  // Récupère la largeur de l'écran (utile pour le responsive design, même si pas encore utilisé dans le JSX)

const SingleProductScreen = () => {

    // 1. Extraction de l'ID depuis les paramètres de navigation.
    const {id} = useLocalSearchParams<{id: string}>();            // Le type <{id: string}> assure que TypeScript sait que 'id' est une chaîne de caractères.
    // 2. Définition des états (States) 
    const [product,setProduct] = useState<Product | null>(null);  // Stocke l'objet produit ou null
    const [loading,setLoading] = useState(false);                 // Gère l'état de chargement
    const [error,setError] = useState<string | null>(null);       // Gère les erreurs potentielles
    const [quantity,setQuantity] = useState(1);                   // Gère la quantité sélectionnée par l'utilisateur
    const idNum = Number(id);                                     // Conversion de l'ID (string) en nombre pour l'appel API

    const router = useRouter();

    const {addItem} = useCartStore();                             // Récupère la fonction d'ajout au panier depuis le store

    const {isFavorite, toggleFavorite} = useFavoritesStore();  // Récupère les fonctions de gestion des favoris depuis le store

    console.log("Product ID:", id);

  //-----------------------------  Le Hook useEffect : se déclenche quand le composant monte ou quand 'id' change---------------------------------
    useEffect(()=> {
      const fetchProductData = async () => {
        setLoading(true);                                // Active l'état de chargement avant l'appel
        try {
          const data = await getProduct(idNum);          // Appel API pour récupérer les données du produit  
          setProduct (data);                             // Mise à jour du state avec les données reçues
        }catch (error) {
          setError('Failed to fetch product data');
          console.log('Error fetching product data:', error);
        } finally {
          setLoading(false);                            // S'exécute toujours (succès ou échec) pour arrêter le chargement
        }
      };
      if (id) {                               // Sécurité : on ne lance la recherche que si un ID existe
        fetchProductData();
      }
    }, [id]);                                 // Dépendance : relance l'effet si l'ID change
    console.log('product data', product)
     //------------------------ Affichage spinner de chargement si la requête est en cours ------------------------------------
     if (loading) {
      return (
      <View style={{flex: 1, alignItems:'center', justifyContent: 'center'}}>
        <LoadingSpinner fullScreen/>
      </View>
      );
    }

    //------------------------ Affiche un message d'erreur si le produit n’existe pas ou en cas d’échec------------------------
    if (error || !product) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Produit introuvable 😞'}</Text>
          <Button 
            title="Retour" 
            onPress={() =>router.back()}
            style={styles.errorButton}
          />
        </View>
      );
    }
  //------------------------------------------------------ Handler -------------------------------------------
    //ajout au panier : ajoute avec la quantité choisie et affiche une notification
    const isFav = isFavorite(product?.id);               // Vérifie si le produit est dans les favoris
    const handleAddToCart = () => {
        addItem(product, quantity);
        Toast.show({
          type: 'success',
          text1: `Produit ${product?.title} ajouté au panier 👋`,
          text2: "Voir le panier pour finaliser votre achat.",
          visibilityTime: 2000,
        });
    };

     // Handler ajout/retrait favoris
    const handleToggleFavorite = () => {
      if (product) {
        toggleFavorite(product);
      }
    }



//------------------------------------------ le Rendu jsx ------------------------------------------
  return (
    <View style={styles.headerContainerStyle}>
      <CommonHeader isFav={isFav} handleToggleFavorite={handleToggleFavorite} />
      {/* Header avec bouton favori */}
      <ScrollView showsVerticalScrollIndicator={false}>
          {/* Affichage image produit */}
          <View style={styles.imageContainer}>
              <Image  
                source={{uri: product?.image}} 
                style={styles.productImage} 
                resizeMode="contain"
              />
          </View>
          {/* Infos produit : catégorie, titre, note, prix, description */}
          <View style={styles.productInfo}>
              <Text style={styles.category}>
                  {product?.category?.charAt(0).toUpperCase() + product?.category?.slice(1)}
              </Text>
              <Text style={styles.title}>{product?.title}</Text>
              <View style={styles.ratingContainer}>
                  <Rating rating={product?.rating?.rate} count={product?.rating?.count}  /> 
              </View>
          </View>
          <Text style={styles.price}>€ {product?.price.toFixed(2)}</Text>
          <View style={styles.divider} />
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product?.description}</Text>
          {/* Gestion de la quantité à acheter */}
          <View style={styles.quantityContainer}>
              <Text style={styles.quantityTitle}>Quantité</Text>
              <View style={styles.quantityControls}>
                 <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity((prev) => prev-1)} disabled={quantity <= 1} >
                  <AntDesign 
                    name='minus'
                    size={20}
                    color={AppColors.text.primary[600]}
                  />
                 </TouchableOpacity>
                 <Text style={styles.quantityValue}>{quantity}</Text>
                 <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity((prev) => prev+1)}>
                  <AntDesign 
                    name='plus'
                    size={20}
                    color={AppColors.text.primary[600]}
                  />
                 </TouchableOpacity>
              </View>
          </View>
      </ScrollView>
      {/* Footer : bouton ajout panier et affichage du total */}
      <View style={styles.footer}>
          <Text style={styles.totalPrice}>Total: €{(product?.price * quantity).toFixed(2)}</Text>
          <Button 
            title= "Ajouter au panier"
            onPress={handleAddToCart}
            style={styles.addToCartButton}
          />
        </View>
    </View>
  )
}

export default SingleProductScreen
//------------------------------------------ Style ------------------------------------------
const styles = StyleSheet.create({
  addToCartButton: {
    width: "50%",
    backgroundColor: AppColors.primary[600],
  },
  totalPrice: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: AppColors.text.primary,
  },
  headerContainerStyle: {
    paddingTop: 30,
    backgroundColor: AppColors.background.primary,
  },
  errorButton: {
    marginTop: 8,
    color: AppColors.warning[600],
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: AppColors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24, 
  },
  footer: {
    position: 'absolute',
    bottom: 100,  // a verifier
    left: 0,
    right: 0,
    backgroundColor: AppColors.background.primary,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray[200],
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: AppColors.text.primary,
    paddingHorizontal: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  quantityTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: AppColors.text.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 200,  // a verifier
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: AppColors.text.secondary,
    lineHeight: 24,
    marginBottom: 24,
  }, 
  descriptionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray[200],
    // marginVertical: 16,
    marginBottom: 16
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: AppColors.primary[600],
    marginBottom: 16,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  category: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: AppColors.text.secondary,
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  productInfo: {
    paddingHorizontal: 24,
    paddingBottom: 120,
    paddingTop: 10,
    backgroundColor: AppColors.background.secondary,
  },
  productImage: {
    width: "80%",
    height: "80%",
  },
  imageContainer: {
    width: width,
    height: width, 
    alignItems: "center",
    justifyContent: 'center'   
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
    position: "relative",
  },
})