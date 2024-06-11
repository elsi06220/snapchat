import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

let deviceHeight = Dimensions.get("window").height;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://snapchat.epidoc.eu/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhc3NpZHkubmd1eWVuQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjQwNjl9.GmU6Ur8xdyKF_orG358zEEHl9eF6AC5x2IxbDmne4mc'
        },
        body: JSON.stringify({ 
          email: email, 
          password: password,
        }),
      });
      const json = await response.json();
      console.log(json);
      if (response.ok && json.data && json.data.token) {
        await AsyncStorage.setItem('token', json.data.token);
        setSuccessMessage('Connexion réussie !'); 
        console.log('Connexion réussie !');
        setTimeout(() => {
          setSuccessMessage('');
          navigation.navigate("(tabs)/home" as never); 
        }, 1000);
      } else {
        setErrorMessage(json.message || 'Échec de la connexion');
        console.error('Échec de la connexion');
      }
    } catch (error) {
      setErrorMessage('Erreur lors de la connexion');
      console.error('Erreur lors de la connexion', error);
    } 
  };

  const register = () => {
    navigation.navigate("(tabs)/register" as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connectez-vous à MySnapchat !</Text>
      <Image
        source={require("../../assets/images/snapghost.png")}
        style={styles.image}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.yellowBox} onPress={handleLogin}>
        <Text style={styles.text}>Se connecter !</Text>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
      </TouchableOpacity>
      <Text style={styles.textlogin} onPress={register}>
        Pas encore de compte ? Inscrivez-vous !
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 200,
    resizeMode: "contain",
    bottom: deviceHeight / 6,
    marginBottom: -100,
  },
  text: {
    fontSize: 18,
    color: "#000000",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 25,
  },
  textlogin: {
    position: "absolute",
    fontSize: 18,
    color: "#000000",
    textAlign: "center",
    textAlignVertical: "center",
    bottom: deviceHeight / 10,
  },
  yellowBox: {
    position: "absolute",
    bottom: deviceHeight / 5.2,
    backgroundColor: "#FFFC00",
    height: deviceHeight / 10,
    borderRadius: 20,
    width: 130,
  },
  title: {
    fontSize: 24,
    position: "absolute",
    top: deviceHeight / 7,
    color: "#000000",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor : '#d3d3d3',
  },
  error: {
    position : 'absolute',
    color: "red",
    marginTop: - 200,
    textAlign: "center",
  },
  success: {
    position : 'absolute',
    color: "green",
    marginTop: - 200,
    textAlign: "center",
  },
});

export default Login;
