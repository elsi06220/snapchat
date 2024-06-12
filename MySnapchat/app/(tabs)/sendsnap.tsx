import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  FlatList,
  Image,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Linking, Platform } from "react-native";
import * as FileSystem from "expo-file-system";

type User = {
  _id: string;
  username: string;
};

export default function SendSnapScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>("5");
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission nécessaire",
            "Cette application a besoin d'accéder à votre caméra",
            [
              { text: "Annuler", style: "cancel" },
              {
                text: "Ouvrir les paramètres",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        }
      }
    })();
  }, []);

  const openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission nécessaire",
        "Cette application a besoin d'accéder à votre galerie",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Ouvrir les paramètres",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.canceled === true) {
      return;
    }

    if (pickerResult.assets && pickerResult.assets.length > 0) {
      setSelectedImage(pickerResult.assets[0].uri);
      fetchUsers();
    }
  };

  const openCameraAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission nécessaire",
        "Cette application a besoin d'accéder à votre appareil photo",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Ouvrir les paramètres",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return;
    }

    let cameraResult = await ImagePicker.launchCameraAsync();
    if (cameraResult.canceled === true) {
      return;
    }

    if (cameraResult.assets && cameraResult.assets.length > 0) {
      setSelectedImage(cameraResult.assets[0].uri);
      fetchUsers();
    }
  };

  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch("https://snapchat.epidoc.eu/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhc3NpZHkubmd1eWVuQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjQwNjl9.GmU6Ur8xdyKF_orG358zEEHl9eF6AC5x2IxbDmne4mc",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setUsers(json.data);
        setModalVisible(true);
      } else {
        Alert.alert("Erreur", "Échec de la récupération des utilisateurs");
      }
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la récupération des utilisateurs");
    }
  };

  const sendSnap = async () => {
    if (!selectedImage || !selectedUser || !duration) {
      Alert.alert(
        "Erreur",
        "Veuillez sélectionner une image, un utilisateur et une durée."
      );
      return;
    }

    const token = await AsyncStorage.getItem("token");
    const base64Image = await FileSystem.readAsStringAsync(selectedImage, {
      encoding: FileSystem.EncodingType.Base64,
    });

    try {
      const response = await fetch("https://snapchat.epidoc.eu/snap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhc3NpZHkubmd1eWVuQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjQwNjl9.GmU6Ur8xdyKF_orG358zEEHl9eF6AC5x2IxbDmne4mc",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: selectedUser,
          image: `data:image/jpeg;base64,${base64Image}`,
          duration: parseInt(duration),
        }),
      });

      const json = await response.json();
      if (response.ok) {
        Alert.alert("Succès", "Snap envoyé avec succès");
        setModalVisible(false);
        setSelectedImage(null);
      } else {
        Alert.alert("Erreur", json.message || "Erreur lors de l'envoi du snap");
      }
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de l'envoi du snap");
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => setSelectedUser(item._id)}
    >
      <Text style={styles.username}>{item.username}</Text>
    </TouchableOpacity>
  );

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          ) : (
            <Text style={styles.placeholderText}></Text>
          )}
        </View>
        <View style={styles.buttonCenterContainer}>
          <Button
            title="Sélectionner depuis la galerie"
            onPress={openImagePickerAsync}
          />
          <Button title="Prendre une photo" onPress={openCameraAsync} />
        </View>
        {modalVisible && (
          <View style={styles.modalContainer}>
            <FlatList
              style={styles.userList}
              data={users}
              renderItem={renderUser}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={<Text>Aucun utilisateur trouvé.</Text>}
            />
            <View style={styles.durationInputContainer}>
              <Text>durée : </Text>
              <TextInput
                style={styles.durationInput}
                onChangeText={setDuration}
                value={duration}
                keyboardType="numeric"
              />
              <TouchableOpacity
                onPress={() => {
                  setDuration("");
                  dismissKeyboard();
                }}
                style={styles.closeButton}
              >
                <Text>Annuler</Text>
              </TouchableOpacity>
            </View>
            <Button title="Envoyer" onPress={sendSnap} />
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("(tabs)/home" as never)}
      >
        <Text style={styles.homeButtonText}>Retour à Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 10,
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "cover",
  },
  placeholderText: {
    fontSize: 18,
    color: "gray",
  },
  buttonCenterContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    flex: 1,
  },
  userList: {
    flex: 1,
    marginBottom: 20,
  },
  userItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  username: {
    fontSize: 16,
  },
  durationInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  durationInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 5,
    width: 50,
  },
  homeButton: {
    backgroundColor: "#00a9ff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignSelf: "center",
  },
  homeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    marginLeft: 10,
  },
});
