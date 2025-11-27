import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Link, useRouter } from 'expo-router';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import MainLayout from '@/components/MainLayout';
import EmptyState from '@/components/EmptyState';
import { AppColors } from '@/constants/theme';
import { Title } from '@/components/customText';
import CartItem from '@/components/CartItem';
import Button from '@/components/Button';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import axios from "axios";



export default function CartScreen() {
// ---------------------------------- Récupération des données et hooks --------------------------------
  const router = useRouter();                                       // Accès à l'objet router pour naviguer dans l’app
  const { items, getTotalPrice, clearCart } = useCartStore();       // Récupération des éléments du panier et des fonctions associées depuis le store cart
  const { user } = useAuthStore();                                   // Récupération de l’utilisateur connecté depuis le store auth
  const [loading, setLoading] = useState(false);                      // State local loading pour gérer l’état de la commande

  // Calculs des prix : sous-total des articles, frais de port conditionnels, total global
  const subtotal = getTotalPrice();
  const shippingCost = subtotal > 50 ? 5.99 : 0;
  const total = subtotal + shippingCost;

  // ---------------------------------Les handlers ------------------------------------------------
  const handlePlaceOrder = async () => {
       // Vérifie si l’utilisateur est connecté
      if(!user) {
          Toast.show({
            type: "error",
            text1: "Connexion requise",
            text2: "Svp connectez-vous pour passer une commande",
            position: "bottom",
            visibilityTime: 2000,
          });
          // arrêt si non connecté
          return;
      }
      try{
          setLoading(true);                             // Démarre le chargement  
          const orderData = {                           // Préparation des données de commande pour insertion dans Supabase
            user_email:user.email,
            total_price:total,
            items:items.map((item) =>({
              product_id:item.product.id,
              title:item.product.title,
              price:item.product.price,
              quantity:item.quantity,
              image:item.product.image,
            })),
            payment_status: "En attente",
          };
          // Insertion de la commande dans la table "orders" de Supabase
          const {data,error}=await supabase
            .from("orders")
            .insert([orderData])
            .select()
            .single();
            // Gestion erreur insertion
            if(error) {
              throw new Error(`Echec de sauvegarde de la commande: ${error.message}`);
          }
          // Préparation du payload à envoyer au serveur de paiement Stripe
          const payload = {
              price: total,
              email: user?.email,
          };
          // Envoi de la requête POST au serveur local qui gère le paiement (adresse à adapter)
          const response = await axios.post(
            // "http://localhost:8000/checkout",
            // "http://192.168.1.15:8000/checkout", //maison 
            "http://192.168.50.14:8000/checkout", //AFPA reseau wifi
            payload, 
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
          const { paymentIntent, ephemeralKey, customer} = response.data;   // Récupération des données de paiement Stripe dans la réponse
          // console.log("ressssssssss",paymentIntent, ephemeralKey, customer);
          // Vérification des données Stripe
          if (!paymentIntent || !ephemeralKey || !customer) {
              throw new Error("Données Stripe requises manquantes depuis le serveur");
          } else {
          // Affichage de la confirmation commande
            Toast.show({
              type: "success",
              text1: "Commande passée",
              text2: "Commande passée avec succés",
              position: "bottom",
              visibilityTime: 2000,
            });
            // Navigation vers l’écran de paiement avec données Stripe et Id commande Supabase
            router.push({
              pathname: "/(tabs)/payment",
              params:{
                paymentIntent,
                ephemeralKey,
                customer,
                orderId:data.id, // Id de la commande pour suivi/mise à jour
                total: total,
              },
            });
            // Vide le panier après passage commande
            clearCart();
          }
      } catch (error) {
          // Gestion des erreurs générales avec notification toast
          Toast.show({
            type: "error",
            text1: "Commande echoué",
            text2: "Echec de la commande",
            position: "bottom",
            visibilityTime: 2000,
          });
          console.log("Erreur de la commande", error);
      } finally {
            setLoading(false);                // Fin du chargement
      }
  }

  
 // ---------------------------------- Rendu du composant -------------------------------- 
 return (
  <MainLayout>
    {/* Affichage conditionnel si panier non vide */}
    {items?.length > 0 ? (
        <View style={styles.container}>
            {/* Header panier avec titre et bouton vider panier */}
            <View style={styles.headerView}>
                <View style={styles.header}>
                <Title>Produits du panier</Title>
                <Text style={styles.itemCount}>{items?.length} produits</Text>
            </View>
            <View>
                <TouchableOpacity onPress={() => clearCart()}>
                  <Text style={styles.resetText}>Vider le panier</Text>
                </TouchableOpacity>
            </View>
        </View>
        {/* Liste des articles du panier avec FlatList */}
        <FlatList 
            data={items}
            keyExtractor={(item) => item.product.id.toString()}
            renderItem={({item}) => ( 
              <CartItem product={item.product} quantity={item.quantity}/> 
            )}
            contentContainerStyle={styles.cartItemsContainer}
            showsVerticalScrollIndicator={false}
        />
        {/* Section résumé prix : sous-total, frais de port, total */}
        <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sous-total: </Text>
                <Text style={styles.summaryValue}>€{subtotal.toFixed(2)}</Text>
            </View>
            {/* Affiche frais de port seulement si > 0 */}
          {shippingCost > 0 && (
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Frais de port: </Text>
                <Text style={styles.summaryValue}>€{shippingCost.toFixed(2)}</Text>
            </View>
          )}
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total: </Text>
                <Text style={styles.summaryValue}>€{total.toFixed(2)}</Text>
            </View>
            {/* Bouton passer commande désactivé si pas connecté ou en chargement */}
            <Button
                title="Passer commande"
                fullWidth 
                style={styles.checkoutButton} 
                disabled = {!user || loading}
                onPress={handlePlaceOrder}
            />
            {/* Invitation à se connecter si non connecté */}
          {!user && (
            <View style={styles.alertView}>
              <Text style={styles.alertText}>
                Connectez-vous pour passer commande
              </Text>
              <Link href={"/(tabs)/login"}>
                <Text style={styles.loginText}>Connexion</Text>
              </Link>
            </View>
          )}
        </View>
      </View>
    ) : (
      // Si panier vide, affiche message et bouton redirection magasin
      <EmptyState 
        type="cart"
        message='Votre panier est vide'
        actionLabel='Commencez vos achats'
        onAction={() => router.push("/(tabs)/shop")}/>
    )}
  </MainLayout>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    // backgroundColor: AppColors.background.secondary,
  },
   resetText: {
    color: AppColors.error
  },
  headerView: {
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'flex-start'
  },
  header: {
    paddingBottom: 16,
    paddingTop: 7,
    backgroundColor: AppColors.background.primary,
  },
  itemCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: AppColors.text.secondary,
    marginTop: 4,
  },
  cartItemsContainer: {
    paddingVertical: 16,
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 200,
    width: "100%",
    backgroundColor: AppColors.background.primary,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray[200],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: AppColors.text.secondary
  },
  summaryValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: AppColors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray[200],
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.text.primary,
  },
  totalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: AppColors.primary[600],
  },
  checkoutButton: {
    marginTop: 16,
    // backgroundColor:"black",
    backgroundColor: AppColors.info,
  },
  alertView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText: {
    fontWeight: "500",
    textAlign: 'center',
    color: AppColors.error,
    marginRight: 3,
  },
  loginText: {
    fontWeight: "700",
    color: AppColors.primary[500]
  },
})