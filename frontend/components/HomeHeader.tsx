import { StyleSheet, Text, View, Platform, TouchableOpacity} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {AppColors} from '@/constants/theme'
import Logo from './Logo'
import {  Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const HomeHeader = () => {
    const routeur = useRouter();
  return (
    <SafeAreaView style={styles.container}>

        <View style={styles.header}>
            <Logo/>
            <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.searchButton} onPress={() => routeur.push('/(tabs)/search')}>
                    <Ionicons 
                        name="search-outline" 
                        size={24} 
                        color={AppColors.primary[700]}
                    />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.searchButton} onPress={() => routeur.push('/(tabs)/favorite')}>
                    <Ionicons 
                        name="heart-outline" 
                        size={24} 
                        color={AppColors.primary[700]}
                    />
                    <View style={styles.itemsView}>
                        <Text style={styles.itemsText}>0</Text>
                    </View>

                </TouchableOpacity>

                <TouchableOpacity style={styles.searchButton} onPress={() => routeur.push('/(tabs)/cart')}>
                    <Ionicons 
                        name="cart-outline" 
                        size={24} 
                        color={AppColors.primary[700]}
                    />
                    <View style={styles.itemsView}>
                        <Text style={styles.itemsText}>0</Text>
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