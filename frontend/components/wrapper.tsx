import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/theme';
import { 
   StyleSheet, // Pour créer des styles réutilisables
   View, // Pour créer des conteneurs de composants
   Platform // Pour détecter la plateforme (iOS ou Android)
} from 'react-native';


// Composant wrapper : sert de conteneur principal sécurisé pour tous les autres composants enfants
const wrapper = ({children} : {children: React.ReactNode}) => {
  return (
    // Utilisation de SafeAreaView pour éviter les chevauchements avec l'encoche ou la barre de statut
    <SafeAreaView style={styles.safeView}>
        {/* View principale pour organiser et styliser le contenu */}
        <View style={styles.container}>
            {children} {/* Affichage des composants enfants */}
        </View>
    </SafeAreaView>
  )
}


export default wrapper;

// Définition des styles pour le composant
const styles = StyleSheet.create({
    safeView: {
        flex: 1, // Le composant occupe tout l'espace disponible
        backgroundColor: AppColors.background.primary, // Couleur de fond selon le thème
        marginTop: Platform.OS === 'android' ? 25 : 0, // Décalage supérieur sur Android pour la barre de statut
    },
    container: {
        flex: 1, // Le conteneur interne occupe tout l'espace restant
        backgroundColor: AppColors.background.primary, // Utilisation de la couleur de fond du thème
        paddingHorizontal: 20, // Espacement horizontal
        paddingVertical: 10, // Espacement vertical
    },
});
