import { KeyboardAvoidingView, StyleSheet, Text, View, ScrollView  } from 'react-native'
import React, { useState } from 'react'
import { AppColors } from '@/constants/theme'
import Wrapper from '@/components/wrapper'
// import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated'
import { Foundation } from '@expo/vector-icons'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'expo-router'
import TextInput from '@/components/TextInput'
import Button from '@/components/Button'

const LoginScreen = () => {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");  
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const router = useRouter();
    const { login, isLoading, error } = useAuthStore();

//--------------------------------------------------------------------------------
const validateForm = (): boolean => {
    let isValid = true;
    //validation email
    if(!email.trim()) {
      setEmailError('Email obligatoire');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Adresse email invalide');
      isValid = false;
    } else {
      setEmailError("");
    }
    //validation mot de passe
    if(!password) {
      setPasswordError('Mot de passe obligatoire');
      isValid = false;
    } else if(password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      isValid = false;
    } else {
      setPasswordError("");
    }
    return isValid;
};
//--------------------------------------------------------------------------------  
    const handleLogin = async () => {
        if (validateForm()) {
        await login(email, password)
        router.push("/(tabs)/profile");
        // Reset des champs après connexion réussie
        setEmail("");
        setPassword("");
        }
    }

  return (
    <Wrapper>
        <KeyboardAvoidingView>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.header}>
                    <View style= {styles.logoContainer}>
                        <Foundation 
                            name='shopping-cart'
                            size={40}
                            color={AppColors.primary[500]}
                        />
                    </View>
                    <Text style={styles.title}>Shopngo</Text>
                    <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
                    <View style={styles.form}>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    <TextInput 
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder='entre votre email'
                        keyboardType='email-address'
                        autoCapitalize='none'
                        autoCorrect={false}
                        error={emailError}
                    />
                    <TextInput 
                        label="Mot de passe" 
                        value={password} 
                        onChangeText={setPassword}
                        placeholder='Entrez votre mot de passe'
                        error={passwordError}
                        secureTextEntry
                    />

                    <Button
                         onPress={handleLogin}
                         title="Conexion"
                         fullWidth
                         loading={isLoading}
                        style={styles.button}
                    />
                </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>


    </Wrapper>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: AppColors.background.primary,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingTop: 60,
      paddingBottom: 40,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: AppColors.primary[50],
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    title: {
      fontFamily: 'Inter-Bold',
      fontSize: 28,
      color: AppColors.text.primary,
      marginBottom: 8,
    },
    subtitle: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: AppColors.text.secondary,
    },
    form: {
      width: "100%",
    },
    button: {
      marginTop: 16,
      backgroundColor: AppColors.primary[500], 
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
    },
    footerText: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: AppColors.text.secondary,
    },
    link: {
      fontFamily: "Inter-SemiBold",
      fontSize: 14,
      color: AppColors.primary[500],
      marginLeft: 4,
    },
    errorText: {
      color: AppColors.error,
      fontFamily: "Inter-Regular",
      fontSize: 14,
      marginBottom: 16,
      textAlign: 'center'
    },
  })