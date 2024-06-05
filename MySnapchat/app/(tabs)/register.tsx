import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
let deviceHeight = Dimensions.get("window").height;

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState('');


  const handleRegister = async () => {
    try {
      const response = await fetch("https://snapchat.epidoc.eu/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
          profilePicture: "",
        }),
      });
      let json = await response.json();
      console.log(json);
      if (response.ok) {
        setSuccessMessage('Inscription réussie !'); 
        console.log("Inscription réussie !");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Échec de l'inscription");
        console.error("Échec de l'inscription");
      }
    } catch (error) {
      setErrorMessage("Erreur lors de l'inscription");
      console.error("Erreur lors de l'inscription", error);
    }
  };

  const navigation = useNavigation();

  const login = () => {
    navigation.navigate("(tabs)/login" as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscrivez vous à My Snapchat !</Text>
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
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.yellowBox} onPress={handleRegister}>
        <Text style={styles.text}>S'inscrire !</Text>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
      </TouchableOpacity>
      <Text style={styles.textlogin} onPress={login}>
        Déjà inscrit ? Connectez-vous !
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
    bottom: deviceHeight / 10,
    marginBottom: -80,
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
    bottom: deviceHeight / 5.6,
    backgroundColor: "#FFFC00",
    height: deviceHeight / 10,
    borderRadius: 20,
    width: 100,
  },
  title: {
    fontSize: 24,
    position: "absolute",
    top: deviceHeight / 6,
    color: "#000000",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingTop: -20,
    paddingHorizontal: 8,
    backgroundColor : '#d3d3d3',
  },
  error: {
    position : 'absolute',
    color: "red",
    marginTop: - 220,
    textAlign: "center",
  },
  success: {
    position : 'absolute',
    color: "green",
    marginTop: - 220,
    textAlign: "center",
  },
});

export default Register;
