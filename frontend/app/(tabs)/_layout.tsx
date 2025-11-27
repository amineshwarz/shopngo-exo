import { Tabs } from 'expo-router';                       // Composant de navigation pour créer des onglets avec expo-router
import React from 'react';
import { Ionicons,  Foundation, Feather } from '@expo/vector-icons';
import { HapticTab } from '@/components/haptic-tab';      // Composant personnalisé pour gérer les retours haptiques (vibration lorsqu'on appuie sur un onglet)
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme'; // Hook personnalisé pour détecter le mode "clair/sombre"


export default function TabLayout() {

  // Récupère le thème actuel ('light' ou 'dark')
  const colorScheme = useColorScheme();

  return (
    <Tabs
     //------------------------  Options globales applicables à tous les onglets
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,   // Couleur de l’icône active selon le thème
        headerShown: false,    // Cache l’en-tête (header) sur chaque écran
        tabBarButton: HapticTab,   // Utilise un bouton personnalisé pour déclencher un retour haptique
      }}
    >
    {/* ---------------- Onglet Accueil -------------------- */}
        <Tabs.Screen
          name="index"    // Correspond au fichier app/(tabs)/index.jsx
          options={{
            title: 'Home', // Nom affiché dans la barre d’onglets
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name="home" color={color} />
            ),
          }}
        />
    {/* ----------------Onglet Boutique ---------------- */}
        <Tabs.Screen
          name="shop"     //Correspond au fichier app/(tabs)/shop.jsx
          options={{
            title: 'shop',
            tabBarIcon: ({ color }) => (
              <Foundation size={28} name="shopping-cart" color={color} />
            ),
          }}
        />
    {/*----------------Onglet Profil----------------*/}

        <Tabs.Screen
          name="profile"    // Correspond au fichier app/(tabs)/profile.jsx
          options={{
            title: 'profile',
            tabBarIcon: ({ color }) => (
              <Feather size={28} name="user" color={color} />
            ),
          }}
        />
    {/* ----------------Onglets cachés----------------*/}
      {/* Ces onglets sont utilisés pour la navigation interne (sans apparaître dans la barre d’onglets) */}
      
        <Tabs.Screen name="search" options={{ href: null }}/>

        <Tabs.Screen name="favorite" options={{ href: null }}/>

        <Tabs.Screen name="cart" options={{ href: null }}/>

        <Tabs.Screen name="login" options={{ href: null }}/>

        <Tabs.Screen name="signup" options={{ href: null }}/>

        <Tabs.Screen name="orders" options={{ href: null }}/>

        <Tabs.Screen name="payment" options={{ href: null }}/>

        <Tabs.Screen name="product/[id]" options={{ href: null, tabBarStyle:{display:'none'} }}/> {/* tabBarStyle: Cache complètement la barre d’onglets sur cette page */}

    </Tabs>
  );
}
