import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const ShopScreen = () => {



  const [products,setProducts]=useState([]);
// ----------------- useEffect ------------------  
  useEffect(() => {
    const getProducts = async() => {
      const response = await fetch("https://fakestoreapi.com",{
        method: "GET",
        headers: {
          "content-Type" : "application/jason",
        },
      });
      const data =await response.json();
      setProducts(data);
    };
    getProducts();
  }, []);



  return (
    <SafeAreaView>
        <View>
            <Text>shop magasin </Text>
        </View>
    </SafeAreaView>

  )
}

export default ShopScreen

const styles = StyleSheet.create({})
