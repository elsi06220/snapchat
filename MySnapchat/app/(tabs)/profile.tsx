import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

type User = {
  username: string;
  email: string;
};

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        console.log(storedUser);
      }
    };

    fetchUser();
  }, []);

  const navigation = useNavigation();

  const handleLogout = () => {
    AsyncStorage.removeItem("token");
    navigation.navigate("(tabs)/login" as never);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("(tabs)/home" as never)}
      >
        <Icon name="arrow-left" size={20} color="#fff" />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>        
      <View style={styles.roundBackground}>
        <Image
          source={require("../../assets/images/default.png")}
          style={styles.image}
        />
      </View>
      <Text style={[styles.title, styles.common]}>Nom d'utilisateur : {user ? user.username : ''}</Text>
      <Text style={[styles.title2, styles.common]}>Email : {user ? user.email : ''}</Text>
      <Text style={[styles.title3, styles.common]}>Mot de passe : *******</Text>
      <TouchableOpacity style={styles.redBox} onPress={handleLogout}>
        <Text style={styles.text}>Se déconnecter</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.blueBox}>
        <Text style={styles.text}>Modifier mon profil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  common: {
    backgroundColor: '#f0f0f0',
    padding: 10,      
    borderRadius : 20,         
    marginBottom: 10,    
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    textAlign :'center',       
  },
  backButton: {
    backgroundColor: "#00a9ff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignSelf: "center",
    top: deviceHeight / 28,
    left: deviceWidth / -3.3,
    flexDirection: "row",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
    marginTop: 1,
  },
  title: {
    fontSize: 20,
    position: "absolute",
    top: deviceHeight / 3.5,
    color: "#000000",
    fontWeight: "bold",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal : 10,
  },
  title2: {
    fontSize: 20,
    position: "absolute",
    top: deviceHeight / 2.77,
    color: "#000000",
    fontWeight: "bold",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal : 10,
  },
  title3: {
    fontSize: 20,
    position: "absolute",
    top: deviceHeight / 2.3,
    color: "#000000",
    fontWeight: "bold",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal : 10,
  },
  text: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 22,
  },
  roundBackground: {
    position: 'absolute',
    top : 105,
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    width: 150,
    height: 300,
    resizeMode: "contain",
    top: - 66,
  },
  redBox: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "red",
    width: "75%",
    height: deviceHeight / 12,
    borderRadius: 20,
  },
  blueBox: {
    position: 'absolute',
    bottom: deviceHeight / 10,
    backgroundColor: 'blue',
    width: '75%',
    height: deviceHeight / 12,
    borderRadius: 20,
  },
  iconarrow: {
    position: "absolute",
    top: deviceHeight / 25,
    left: deviceWidth / -2.3,
  },
  textback: {
    position: "absolute",
    top: deviceHeight / 21,
    left: deviceWidth / -3.3,
    fontSize: 20,
    color: "#000000",
    fontWeight: "bold",
  },
});
