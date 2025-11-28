import { Alert, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppColors } from '@/constants/theme'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase'
import Button from '@/components/Button'
// Composant React Native pour gérer l'ajout d'une adresse de livraison à une commande existante.
const DeliveryAdressScreen: React.FC = () => {
    // Récupération des informations d'utilisateur depuis le store d'authentification.
    const { user } = useAuthStore();
    // Hook de navigation pour rediriger ou revenir à l'écran précédent.
    const router = useRouter();
    // États locaux pour gérer :
    // - address : l'adresse saisie par l'utilisateur
    // - loading : l'état de chargement des requêtes asynchrones
    // - orderId : l'identifiant de la dernière commande de l'utilisateur
    const [address, setAdress] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    // useEffect exécuté au montage du composant ou chaque fois que 'user' change.
    // Il récupère la dernière commande de l'utilisateur connecté.
    useEffect(() => {
        const fetchLastOrder = async () => {
            // Si aucun utilisateur n'est connecté, on quitte la fonction.
            if (!user) return;
            // Démarrage du chargement pendant la requête.
            setLoading(true);
            // Requête vers la table "orders" pour obtenir la dernière commande de l'utilisateur.
            // const { data, error } = await supabase
            //     .from("orders")
            //     .select('id')
            //     .eq("user_id", user.id)
            //     // Trie par date de création décroissante.
            //     .order("created_at", {ascending: false})
            //     // On ne récupère qu'une seule commande.
            //     .limit(1)
            //     // Résultat attendu : un seul objet (et non un tableau).
            //     .single();
            // // Fin du chargement.
            //test avec user.email qui est la colonne d'association qu'on utilise dans la OrdersScreen donc 
            //logiquement c'est cele ci qu'il faut utiliser ici aussi
            const { data, error } = await supabase
                .from("orders")
                .select('id')
                .eq("user_email", user.email)
                // Trie par date de création décroissante.
                .order("created_at", {ascending: false})
                // On ne récupère qu'une seule commande.
                .limit(1)
                // Résultat attendu : un seul objet (et non un tableau).
                .single();

            setLoading(false);
            // Gestion des erreurs ou mise à jour du state selon la réponse.
            if (error) {
                Alert.alert("Erreur", "Impossible de récupérer votre commande");
            } else if (data) {
                // On mémorise l'ID de la commande trouvée.
                setOrderId(data.id);
            }
        };
        // Appel immédiat au chargement du composant.
        fetchLastOrder();
    }, [user]);
    // Fonction déclenchée lors du clic sur le bouton "Ajouter l'adresse".
    const handleAddAddress = async () => {
        console.log('User:', user?.id, 'OrderId:', orderId); //verification
        
        // Vérifie s'il y a bien une commande active pour cet utilisateur.
        if (!orderId) {
            Alert.alert("Erreur", "Aucune commande trouvée pour l'ajout d'addresse");
            return;
        }
        // if (!user?.email) {
        //     Alert.alert("Erreur", "Utilisateur non connecté");
        //     return;
        // }
        // Vérifie que le champ adresse n'est pas vide ou composé uniquement d'espaces.
        if (!address.trim) {
            Alert.alert("Validation", "l'adresse ne peut pas être vide");
            return;
        }
        // Indicateur de chargement activé.
        setLoading(true);
        // Mise à jour de toutes les commandes avec la nouvelle adresse de livraison.
        const {error} = await supabase
            .from("orders")
            .update({delivery_address: address})
            // .eq("user_email", user.email);
            .eq("id", orderId);
        // Chargement terminé.
        setLoading(false);
        // Gestion de la réponse de la base de données.
        if (error) {
            Alert.alert("Erreur", "Impossible d'ajouter l'adresse");
        } else {
            Alert.alert("Succés", "Adresse ajouté avec succés");
            // Retour à la page précédente.
            router.back();
        }
    };
// Interface utilisateur avec champ de saisie et bouton d'action.
  return (
    <View style={styles.container}>
        <Text style={styles.containerTitle}>Ajouter une adresse de livraison</Text>
        <TextInput
            style={styles.input}
            placeholder='Entrez votre adresse'
            value={address}
            onChangeText={setAdress}
            multiline
            // Champ désactivé pendant le chargement.
            editable={!loading}
        />
        <Button
            onPress={handleAddAddress}
            title={loading ? 'Chargement...' : "Ajouter l'adresse"}
            fullWidth
            style={styles.button}
        />
    </View>
  );
};

export default DeliveryAdressScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 20,
        backgroundColor: AppColors.background.primary,
    },
    containerTitle: {
        fontFamily: "Inter-Regular",
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        height: 100,
        borderColor: AppColors.gray[300],
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        padding: 10,
        textAlignVertical: 'top',
    }, 
    button: {
    marginTop: 16,
    backgroundColor: AppColors.info,
  },
})