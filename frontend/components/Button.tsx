import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'
import { AppColors } from '@/constants/theme'



interface ButtonProps {
    title: string;
    onPress: () => void;
    size?: 'small' | 'medium' | 'large';
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    disabled?: boolean;
    fullWidth?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}



const Button:React.FC<ButtonProps> = ( {title, onPress, style, textStyle, size='medium', variant='primary', disabled=false, fullWidth=false, loading=false}) => {

    const buttonStyles = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
    ];
    const textStyles = [
        styles.text,
        styles[`${variant}Text`],
        textStyle,
    ];

  return (
    <TouchableOpacity
        style={buttonStyles}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
    >
        {loading ? (
            <ActivityIndicator 
                    color={
                        variant === 'primary'
                        ? AppColors.background.primary
                        : AppColors.primary[500] 
                    } 
        />
        ):(
            <Text style={textStyles}>{title}</Text>
        )}
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text:{
        fontWeight: '600',
    },
    fullWidth:{
        width: '100%',
    },
    disabled:{
        opacity: 0.6,
    },
    //variant du bouton
    primary:{
        borderEndColor: AppColors.primary[500],
    },
    secondary:{
        borderEndColor: AppColors.accent[500],
    },
    outline :{
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: AppColors.primary[500],
    },
    ghost:{
        backgroundColor: 'transparent',
    },
    //style du bouton 
    primaryText:{
        color: AppColors.background.primary,
    },
    secondaryText:{
        color: AppColors.background.primary,
    },
    outlineText:{
        color: AppColors.primary[500],
    },
    ghostText:{
        color: AppColors.primary[500],
    },
    //taille du bouton
    small:{
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    medium :{
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    large:{
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
})