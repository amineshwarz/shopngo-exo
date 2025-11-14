// import { View, Text } from "react-native-reanimated/lib/typescript/Animated";
import HomeHeader from "@/components/HomeHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useProductStore } from "@/store/productStore";
import { Product } from "@/type";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity,FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from '@/constants/theme'
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ProductCard from "@/components/ProductCard";




export default function HomeScreen() {
  const router =useRouter();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]); // État pour stocker les produits en vedette 
  const { products, categories, fetchProducts, fetchCategories, loading, error } = useProductStore(); // Utilisation du store de produits


 //--------------- Premier effet : chargement des produits et catégories a l'ouverture de l'ecran 
  useEffect(() => {
    fetchProducts();                                  // Appel de la méthode pour récupérer les produits
    fetchCategories()                                 // Appel de la méthode pour récupérer les catégories
    }, []);

  // ------------ Deuxième effet : mise à jour des produits en vedette lorsque les produits changent
  useEffect(() => {
    if (products.length > 0) {                            // Vérifie si la liste des produits n'est pas vide
      const reverseProducts =[...products].reverse();     // Inverse l'ordre des produits
      setFeaturedProducts(reverseProducts as Product[]);  // Met à jour les produits en vedette avec les produits inversés
    }
  }, [products]);

  const navigateToCategory = (category: string) => {
    router.push({
      pathname :'/(tabs)/shop',
      params: { category: category },
    });
  }


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <LoadingSpinner fullScreen />
        </View>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <View style={styles.wrapper}>
      <HomeHeader/>
      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainerView} 
        >
          <View style={styles.categoriesSection}>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Catégories</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {categories?.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.categoryButton}
                   onPress={() => navigateToCategory (category)}
                >
                  <AntDesign name="tag" size={16} color={AppColors.primary[500]} />
                  <Text style={styles.categoryText}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

          </View>

          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Meilleures Ventes</Text>
              {/* <TouchableOpacity onPress={navigateToproducts}> */}
              <TouchableOpacity >
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featuredProducts}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredProductsContainer}
              renderItem ={({item}) => (
                <View style={styles.featuredProductContainer} >
                  <ProductCard product={item} compact/>
                </View>
              )}
            />
          </View>

          {/* Section produit les plus récents */}
          <View style={styles.newestSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nouveautés</Text>
              <TouchableOpacity >
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.productsGrid}>
            {products?.map((product) => (
              <View key={product.id} style={styles.productContainer}>
                <ProductCard product={product} customStyle={{width:"100%"}} />
              </View>
              ))}
          </View>

        </ScrollView>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex :1 ,
    backgroundColor: AppColors.background.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily:'Inter-Medium',
    fontSize: 16,
    color: AppColors.error,
    textAlign: 'center',
  },
  contentContainer : {
    paddingLeft:20,
  },
  scrollContainerView : {
    paddingBottom: 300,
  },
  categoriesSection:{
    marginTop:10,
    marginBottom:16,
  },
  categoryButton:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: AppColors.background.secondary,
    paddingVertical:10,
    paddingHorizontal:12,
    borderRadius:8,
    marginLeft:5,
    minWidth:100,
  },
  categoryText:{
    marginLeft:6,
    fontFamily:'Inter-Medium',
    fontSize:12,
    color: AppColors.text.primary,
    textTransform:'capitalize',
  },
  sectionHeader:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginBottom:16,
    paddingRight:20,
  },
  sectionTitle:{
    fontFamily:'Inter-Medium',
    fontSize:14,
    color: AppColors.primary[500],
  },
  wrapper:{
    flex:1,
    backgroundColor: AppColors.background.primary,
  },
  seeAllText:{
    fontFamily:'Inter-Medium',
    fontSize:12,
    color: AppColors.primary[500],
  },
  featuredProductsContainer:{
  },
  featuredProductContainer:{
  },
  title:{
    fontSize:14,
    fontWeight:'500',
    marginBottom:8,
    color: AppColors.text.primary,
  },
  category:{
    fontSize:12,
    color: AppColors.text.tertiary,
    textTransform:'capitalize',
    marginBottom:4,
  },
  productsGrid:{
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between',
    paddingRight:20,
  },
  newestSection:{
    marginVertical:16,
    marginBottom:8,
  },

  featuredSection:{
    marginVertical:16,
  },

  productContainer:{
    width:'48%',
  },
});


