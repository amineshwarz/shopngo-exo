import { StyleSheet, Text, View, 
    StyleProp, ViewStyle, 
    TouchableOpacity, Image, 
    Alert} 
from 'react-native'
import Toast from 'react-native-toast-message';
import React from 'react'
import { Product } from '@/type'
import { AppColors } from '@/constants/theme';
import Button from './Button';
import { useRouter } from 'expo-router';
import Rating from './Rating';
import { useCartStore } from '@/store/cartStore';
import { useFavoritesStore } from '@/store/favoriteStore';
import { AntDesign, Feather } from '@expo/vector-icons';




interface ProductCardProps {
    product: Product;
    compact?: boolean;                      // Optionnel : pour afficher une version compacte de la carte
    customStyle?: StyleProp<ViewStyle>;     // Optionnel : pour des styles personnalisés
}




const ProductCard: React.FC<ProductCardProps> = ({ product, compact=false, customStyle}) => {
    
    const {id, title, price, category, image, rating} = product;

    const router = useRouter();
    const {addItem} = useCartStore();
    const {isFavorite, toggleFavorite} = useFavoritesStore();
    const isFav = isFavorite(id);             // Vérifie si le produit est dans les favoris

    const handleAddToCart = () => {
        //e.stopPropagation();                // Empêche la propagation de l'événement au TouchableOpacity parent
        addItem(product, 1);                // Ajoute le produit au panier avec une quantité de 1
        Toast.show({
            type: 'success',
            text1: `Produit ${title} a été ajouté au panier.`,
            text2: 'Vous pouvez le consulter dans votre panier.',
            visibilityTime: 2000,
        })
        console.log(`Product ${id} added to cart.`);
    };

    const handleProductRoute = () => {
        // Logique pour naviguer vers la page du produit
        //on ecrit la route de cette manière car expo router n'accepte pas les types dynamiques que static
        router.push(`/product/${id}`as any);
    }

    const handleToggleFavorite = () => {
        toggleFavorite(product);
    }

  return (

    <TouchableOpacity style={[styles.card, compact && styles.compactCard,customStyle]} activeOpacity={0.8} onPress={handleProductRoute}>
        <View style={styles.imageContainer}>
            <Image source={{uri: image}} style={styles.image} resizeMode="contain"/>
            <TouchableOpacity onPress={handleToggleFavorite} style={[styles.favoriteButton, {borderWidth: isFav ? 1 : 0}]}>
                <Feather
                    name='heart'
                    size={20}
                    color={AppColors.text.primary}
                />
            </TouchableOpacity>
        </View>
        <View style={styles.content}>
            <Text style={styles.category}>{category}</Text>
            <Text style={styles.title} numberOfLines={compact ? 1:2} ellipsizeMode='tail'>{title}</Text>
            <View style ={styles.footer}>
                <Text style={[styles.price, !compact && {marginBottom:6}]}>
                    € {price.toFixed(2)}
                </Text>
                <Rating rating={rating?.rate} count={rating?.count} size={12} />
                {!compact && (<Button title="Ajouter au panier" size='small' variant='outline' onPress={handleAddToCart}/>)}
            </View>
        </View>
        
    </TouchableOpacity>
  )
}

export default ProductCard

const styles = StyleSheet.create({
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: AppColors.primary[600],
        marginBottom:5,
    },
    footer: {
        justifyContent: 'space-between',
    },
    title :{
        fontSize:14,
        fontWeight: '500',
        color: AppColors.text.primary,
        marginBottom:8,
    },
    category:{
        fontSize:12,
        color: AppColors.text.tertiary,
        textTransform: 'capitalize',
    },
    content :{
        padding:12,
        backgroundColor: AppColors.background.secondary,
    },
    favoriteButton:{
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#fff',
        borderRadius:18,
        padding: 2,
        width:32,
        height:32,
        justifyContent:'center',
        alignItems:'center',
        borderColor: AppColors.error,
    },
    image:{
        width: '100%',
        height: '100%',
    },
    imageContainer:{
        position: 'relative',
        height:150,
        backgroundColor: AppColors.background.primary,
        padding:5,
    },
    compactCard:{
        width:150,
        marginRight:12,
    },
    card:{
        backgroundColor: AppColors.background.primary,
        borderRadius:12,
        overflow:'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        width: '48%',
        marginBottom:16,
        borderWidth:1,
        borderColor: AppColors.gray[200],

    },
    ratingText: {
        marginBottom: 8,
        textTransform: 'capitalize',
        color: AppColors.gray[600],
    },

})