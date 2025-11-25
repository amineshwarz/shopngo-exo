import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { AntDesign, Feather } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

interface RatingProps {
    rating:number;
    count?:number;
    size?:number;
    showCount?:boolean;
}



const Rating:React.FC<RatingProps> = ({rating, count=0, size=16, showCount=true}) => {

    const roundedRating = Math.round(rating * 2) / 2;  // Arrondir à 0.5 près (ex: 3.3 devient 3.5, 3.2 devient 3.0)
    const renderStars = () => {
        const stars =[];
        //full stars
        for (let i=1; i<=Math.floor(roundedRating); i++){
            stars.push(
                <AntDesign 
                    key={`full-${i}`} 
                    name="star" 
                    size={size} 
                    color={AppColors.accent[500]}
                    fill ={AppColors.accent[500]} 
                />
            );
        }
        //half star
        if (roundedRating % 1 !== 0) {
            stars.push(
                <View key="half-star" style={styles.halfStarContainer}>
                    <Feather 
                        name='star' 
                        size={size} 
                        color={AppColors.accent[500]}
                        style={styles.halfStarBackground}
                    />
                    <View style={[styles.halfStarOverlay, {height: size,}]}>
                        <AntDesign 
                            name="star" 
                            size={size} 
                            color={AppColors.accent[500]}
                            fill ={AppColors.accent[500]} 
                            style={styles.halfStarforeground}
                        />
                    </View>
                </View>
            );
        }
        //empty stars
        while (stars.length < 5) {
            stars.push(
                <Feather
                    key={`empty-${stars.length}`}
                    name='star'
                    size={size}
                    color={AppColors.accent[500]} 
                />
            );
        }

       
        return stars;


    }






    return(
        <View style={styles.container}>
            <View style={styles.starsContainer}>
            { renderStars()}
            </View>
          
        </View>
    )
}
export default Rating

const styles = StyleSheet.create({
    halfStarforeground: {
      position: "absolute"
    },
    halfStarOverlay: {
      position: "absolute",
      width: "50%",
      overflow: "hidden"
    },
    halfStarBackground: {
      // position: "absolute",
    },
    halfStarContainer: {
      position: "relative",
    },
    count: {
      marginLeft: 4,
      fontSize: 14,
      color: AppColors.text.secondary,
    },
    starsContainer: {
      flexDirection: 'row',
      alignItems: "center",
    },
    container: {
      flexDirection: 'row',
      alignItems: "center",
      paddingBottom:8,
    }
  })