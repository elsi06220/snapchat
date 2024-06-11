import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

export default function ProfileScreen() {
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
      <Text style={styles.title}>Profil de : </Text>
      <TouchableOpacity style={styles.redBox} onPress={handleLogout}>
        <Text style={styles.text}>Se déconnecter</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.blueBox}>
        <Text style={styles.text}>S'inscrire</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFC00",
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
    fontSize: 24,
    position: "absolute",
    top: deviceHeight / 7,
    color: "#000000",
    fontWeight: "bold",
  },
  text: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 25,
  },
  image: {
    width: 100,
    height: 200,
    resizeMode: "contain",
    top: deviceHeight / 7,
  },
  redBox: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#ff0049",
    width: "100%",
    height: deviceHeight / 10,
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
