import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { useFavoritesStore } from '@/store/favoriteStore';
import { AppColors } from '@/constants/theme';
import HomeHeader from '@/components/HomeHeader';
import Wrapper from '@/components/wrapper';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';

export default function FavoriteScreen() {

    const router = useRouter();                                     // Hook de navigation pour gérer la redirection entre les écrans.
    const {favoriteItems, resetFavorite} = useFavoritesStore();     // Récupère les éléments favoris depuis le store
    const navigateToProducts = () => {router.push("/(tabs)/shop")}  // Fonction de redirection vers la page boutique.


//----------------- Affichage d'un état vide si l'utilisateur n'a aucun produit en favori.
    if(favoriteItems?.length === 0 ) {
      return <Wrapper>
        <HomeHeader />
        <EmptyState 
          type="favorites"
          message="Vous n'avez pas ajouté de produits a vos favoris"
          actionLabel='Voir les produits'
          // Redirection bouton "Voir les produits"
          onAction={navigateToProducts}
        />
      </Wrapper>
    }


//------------------------------------------- Render Jsx--------------------------------------------------
  return (
    <View style={{flex: 1}}>
      <HomeHeader/> 
        {favoriteItems.length > 0 && (
            <Wrapper>
                {/* En-tête affichant le titre et le nombre de favoris + bouton de réinitialisation */}
                <View style={styles.headerView}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Mes Favoris</Text>
                        <Text style={styles.itemCount}>{favoriteItems?.length} produits</Text>
                    </View>
                    {/* Bouton pour supprimer tous les favoris */}
                    <View>
                        <TouchableOpacity >
                            <Text style={styles.resetText}> Reset les favoris</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Liste affichant les produits favoris sous forme de grille */}
                <FlatList
                    data={favoriteItems}                         // Source de données : les produits favoris
                    keyExtractor={(item) => item.id.toString()}  // Clé unique pour chaque élément
                    numColumns={2}                               // Affichage en 2 colonnes
                    renderItem={({item}) => (
                        <View style={styles.productContainer}>
                            {/* Carte produit occupant toute la largeur de sa colonne*/}
                            <ProductCard product={item} customStyle={{width: '100%'}}/>
                        </View>
                    )}
                    columnWrapperStyle={styles.columnWrapper}   // Style pour espacer les colonnes
                    contentContainerStyle={styles.productsGrid} // Style pour la grille de produits
                    showsVerticalScrollIndicator={false}        // Masquer la barre de défilement verticale
                    ListFooterComponent={<View style={styles.footer} />} // Espace en bas de la liste
                />
            </Wrapper>
        )}
    </View>
  )
}

//------------------------------------------- STYLES ----------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  headerView: {
    paddingBottom: 5,
    backgroundColor: AppColors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  header: {

  },
  resetText: {
    color: AppColors.error,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: AppColors.text.primary,
  },
  itemCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: AppColors.text.secondary,
    marginTop: 2, 
  },
  productsGrid: { 
    paddingTop: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productContainer: {
    width: '48%',
  },
  footer: {
    height: 100,
  },
})