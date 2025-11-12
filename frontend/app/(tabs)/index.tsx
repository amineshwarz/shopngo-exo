// import { View, Text } from "react-native-reanimated/lib/typescript/Animated";
import HomeHeader from "@/components/HomeHeader";
import { useState } from "react";
import { View, StyleSheet} from "react-native";




export default function HomeScreen() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  return (
    <View>
      <HomeHeader />
    </View>

  );
}


