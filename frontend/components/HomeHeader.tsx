import { StyleSheet, Text, View, Platform, TouchableOpacity} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'  // gère les zones sûres (haut de l’écran, encoche sur iPhone, etc.)
import {AppColors} from '@/constants/theme'
import Logo from './Logo'
import {  Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'     // hook pour naviguer entre les pages dans Expo Router
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoriteStore'

const HomeHeader = () => {

    const routeur = useRouter(); // Hook pour accéder à la navigation (comme useNavigation) 
    const {items} =useCartStore(); // Récupère les éléments du panier depuis le store
    const {favoriteItems} = useFavoritesStore(); // Récupère les éléments favoris depuis le store

  return (
    // ------------ SafeAreaView protège le contenu des zones "non sûres" (haut de l'écran sur iPhone par ex.)
    <SafeAreaView style={styles.container}>        
      <View style={styles.header}> {/* Barre d'en-tête */}
          <Logo/>                  {/* Logo à gauche */}
          <View style={styles.iconContainer}>     {/* Conteneur des icônes (search, favorite, cart) */}

            {/* Bouton recherche */}
              <TouchableOpacity style={styles.searchButton} onPress={() => routeur.push('/(tabs)/search')}>  {/*navigation vers la page de recherche*/}
                  <Ionicons 
                      name="search-outline"   // icône de loupe
                      size={24} 
                      color={AppColors.primary[700]}
                  />
              </TouchableOpacity>

            {/* Bouton favoris */}  
              <TouchableOpacity style={styles.searchButton} onPress={() => routeur.push('/(tabs)/favorite')}> {/*navigation vers la page de favouris*/}
                  <Ionicons 
                      name="heart-outline" 
                      size={24} 
                      color={AppColors.primary[700]}
                  />
                  {/* Petit badge qui affiche le nombre d’éléments favoris */}
                  <View style={styles.itemsView}>
                      <Text style={styles.itemsText}>{favoriteItems?.length ? favoriteItems?.length : 0}</Text>
                  </View>
              </TouchableOpacity>

            {/* Bouton panier */}
              <TouchableOpacity style={styles.searchButton} onPress={() => routeur.push('/(tabs)/cart')}>
                  <Ionicons 
                      name="cart-outline" 
                      size={24} 
                      color={AppColors.primary[700]}
                  />
                  {/* Badge d’éléments dans le panier */}
                  <View style={styles.itemsView}>
                      <Text style={styles.itemsText}>{items?.length ? items?.length : 0}</Text>
                  </View>

              </TouchableOpacity>
          </View>
      </View>
    </SafeAreaView>
  )
}

export default HomeHeader

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.background.primary,
        marginTop: Platform.OS === "android" ? 35 : 0,
      },
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: AppColors.gray[300],
        paddingBottom: 5,
        paddingHorizontal: 20,
      },
      iconContainer: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "flex-end",
      },
      searchButton: {
        backgroundColor: AppColors.primary[50],
        borderRadius: 5,
        width: 35,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
        borderWidth: 1,
        borderColor: AppColors.primary[500],
        position: "relative",
      },
      itemsView: {
        position: "absolute",
        top: -5,
        right: -5,
        borderRadius: 50,
        width: 15,
        height: 15,
        backgroundColor: AppColors.background.primary,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: AppColors.primary[500],
      },
      itemsText: {
        fontSize: 10,
        color: AppColors.accent[500],
        fontWeight: 800,
      },
});