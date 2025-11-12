import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { Ionicons} from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

const Logo = () => {
    const routeur = useRouter(); // Hook pour la navigation
  return (
    // TouchableOpacity : Quand on clique sur le logo, on retourne à la page d'accueil 
   <TouchableOpacity style={styles.logoView} onPress={() => routeur.push('/')}> 
         {/* Composant (Librairie) MaterialIcons pour afficher une icône (à préciser par la suite dans les props) */}
        <Ionicons
            name='cart-outline'
            size={25}
            color={AppColors.primary[500]}
        /> 
        <Text style={styles.logoText}>ShopNGo</Text>
   </TouchableOpacity>
  )
}

export default Logo

const styles = StyleSheet.create({
    logoView:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText:{
        fontSize: 20,
        marginLeft: 2,
        fontFamily: 'Inter-Bold',
        color: AppColors.primary[700],
    }
})