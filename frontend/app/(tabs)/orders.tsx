import { Alert, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore';
import { useFocusEffect, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Wrapper from '@/components/wrapper';
import { AppColors } from '@/constants/theme';
import { Title } from '@/components/customText';
import EmptyState from '@/components/EmptyState';
import OrderItem from '@/components/OrderItem';
import Toast from 'react-native-toast-message';
import Loader from '@/components/Loader';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';


interface Order {
  id: number;
  total_price: number; 
  payment_status: string;
  created_at: string;
  items: {
    product_id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}
// -------------------------------------------le modal---------------------------------------------------

  const OrderDetailsModal = ({ visible,order, onClose } : {
      visible:boolean; 
      order:Order|null; 
      onClose: () => void;
  }) => {
      const translateY = useSharedValue(300);
      const opacity = useSharedValue(0);
      //Animate Modal open/close
      React.useEffect(() => {
        if (visible) {
          translateY.value = withSpring(0, {damping: 15, stiffness: 100});
          opacity.value = withTiming(1, {duration: 300});
        } else {
          translateY.value = withTiming(300, {duration: 200});
          opacity.value = withTiming(0, {duration: 200});
        }
      }, [visible]);

      const animatedModalStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value}],
        opacity: opacity.value,
      }));

      if (!order) return null;

      return(
      <Modal 
        animationType='none'
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, animatedModalStyle]}>
            <LinearGradient colors={[AppColors.primary[50], AppColors.primary[100]]}
                  style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Commande #${order.id} Détails</Text>
                <TouchableOpacity onPress={onClose}>
                  <Feather 
                    name= "x"
                    size={24}
                    color={AppColors.text.primary}
                    />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                <Text style={styles.modalText}>
                  Total: ${order?.total_price.toFixed(2)}
                </Text>
                <Text style={styles.modalText}>
                  Status: {" "}
                  {order.payment_status === "success"
                    ? "Paiement effectué"
                    : "En attente"
                  }
                </Text>
                <Text style={styles.modalText}>
                  Passée: {new Date(order.created_at).toLocaleDateString()}
                </Text>
                <Text style={styles.modalSectionTitle}>Articles: </Text>
                <FlatList 
                  data={order.items}
                  keyExtractor={(item) => item?.product_id.toString()}
                  renderItem={({ item }) =>(
                    <View style={styles.itemContainer}>
                      <Image
                        source={{ uri: item?.image }}
                        style={styles.itemImage}
                      />
                      <View style={styles.itemDetails}>
                        <Text style={styles.itemsTitle}>{item.title}</Text>
                        <Text style={styles.itemText}>Prix: €{item.price.toFixed(2)}</Text>
                        <Text style={styles.itemText}>Quantité: {item.quantity}</Text>
                        <Text style={styles.itemText}>Sous-total: €{(item.price * item.quantity).toFixed(2)}</Text>
                      </View>
                    </View>
                  )}
                  style={styles.itemList}
                  showsVerticalScrollIndicator={false}
                />
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButtonText}> Fermer</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
      )
  }

//-------------------------------- Composant principal -------------------------------------------
const OrdersScreen = () => {
  // -------------------------------- States et Hooks -------------------------------------------
  const { user } = useAuthStore();
  const router = useRouter();
  const [ orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);


  const fetchOrders = async () => {
    if (!user) {
      setError("Connectez-vous pour voir vos commandes");
      setLoading(false);
      return;
    }
    try {
      setLoading(true)
      const {data: {user:supabaseUser },} = await supabase.auth.getUser();
      // console.log(supabaseUser?.email);
      const {data, error} = await supabase
        .from("orders")
        .select("id, total_price, payment_status, created_at, items, user_email")
        .eq("user_email",user.email)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch orders: ${error.message}`)
      }
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      setError(error.message || "Echec dans le chargement de vos commandes");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [user, router])
  );

 // -------------------------------- les handlers -------------------------------------------
  const handleDeletOrder = async (orderId:number) => {
    try {
      if (!user) {
        throw new Error("User non connecté");
      }
      //Verify the order exists
      const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("id,user_email")
        .eq("id", orderId)
        .single();

        if (fetchError || !order) {
          throw new Error("Commmande non trouvée");
        }
        
        //Perform the deletion
        const { error } = await supabase
          .from("orders")
          .delete()
          .eq("id", orderId);

          if (error) {
            throw new Error(`Echec de suppression de commande:${error?.message}`);
          }
          fetchOrders();
          Toast.show({
            type: "success",
            text1: "Commande supprimé",
            text2: `La commande #${orderId} à été supprimé`,
            position: "bottom",
            visibilityTime: 2000,
          });
    } catch (error) {
      console.error("Erreur dans la suppressin de commande:", error);
      Alert.alert("Error","Echec lors de la suppression, Réssayez encore.");
    }
  };

  const handleViewDetails = (order:Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  }
  //-------------------------------- Render TSX-------------------------------------------

  if (loading) {
    return <Loader />
  }

  if(error) {
    return (
      <Wrapper>
          <Title>Mes Commandes</Title>
          <View style={styles.erroContainer}>
            <Text style={styles.errorText}>Erreur</Text>
          </View>
      </Wrapper>
    )
  }
  return (
    <Wrapper>
        {/* <TitleHeader title="Mes commandes" /> */}
        <Title>Mes Commandes</Title>
        {orders?.length > 0 ? (
          <FlatList  
              data={orders}
              contentContainerStyle={{marginTop: 10, paddingBottom: 10}}
              keyExtractor={(item) => item.id.toString()}
              refreshing={refreshing}
              onRefresh={() => {
                 fetchOrders()
              }}
              renderItem={({item}) => (
                <OrderItem
                  order={item}
                  email={user?.email} 
                  onDelete={handleDeletOrder}
                  onViewDetails={handleViewDetails}
                />
              )}
              showsHorizontalScrollIndicator={false}
        />
        ) : (
          <EmptyState
            type="cart" 
            message="Voous n'avez pas de commandes" 
            actionLabel='Commencez le shopping' 
            onAction={() => router.push("/(tabs)/shop")} 
          />
        )}
        <OrderDetailsModal 
            visible={showModal}
            order={selectedOrder}
            onClose={handleCloseModal}
        />
    </Wrapper>
  )
}

export default OrdersScreen

const styles = StyleSheet.create({
  erroContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: AppColors.error,
    textAlign: "center",
  },
  listContainer: {
    paddingVertical: 16,
  },
  modalSectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    color: AppColors.text.primary,
    marginTop: 12,
    marginBottom: 10,
  },
  modalText: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: AppColors.text.primary,
    marginBottom: 10,
  },
  modalBody: {
    marginBottom: 16, 
  },
  modalTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: AppColors.text.primary
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent:'space-between',
    alignItems: "center",
    marginBottom: 16,
  },
  modalGradient: {
    padding: 20,
  },
  modalContent: {
    width: "92%",
    maxHeight: "85%",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalOverlay: {
    alignItems: "center",
    marginTop: 100,
  },
  closeButtonText: {
    fontFamily: "Inter-Meduim",
    color: "#fff",
    fontSize: 15,
  },
  closeButton: {
    backgroundColor: AppColors.primary[500],
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemsTitle: {
    fontFamily: "Inter-medium",
    fontSize: 15,
    color: AppColors.text.primary,
    marginBottom: 6,
  },
  itemDetails: {
    flex: 1,
  },
  itemImage: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginRight: 12,
    borderRadius: 8,
  },
  itemContainer: {
    paddingBottom: 12,
    backgroundColor: AppColors.background.primary + "80",
    borderRadius: 8,
    padding: 8,
  },
  itemList: {
    maxHeight: 320,
  },
  itemText: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: AppColors.text.secondary,
    marginBottom: 4,
  }
})