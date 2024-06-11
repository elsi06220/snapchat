import { Image, StyleSheet, View, Text, Dimensions, TouchableOpacity, Alert, FlatList, Modal, Button, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Linking, Platform } from "react-native";
import * as FileSystem from 'expo-file-system';

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [users, setUsers] = useState<Array<any>>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>('5');

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission nécessaire",
            "Cette application souhaite accéder à votre caméra",
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

  const handleLogout = () => {
    AsyncStorage.removeItem("token");
    navigation.navigate("(tabs)/login" as never);
  };

  const openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission nécessaire",
        "Cette application souhaite accéder à votre galerie",
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
        "Cette application souhaite accéder à votre appareil photo",
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
      Alert.alert("Erreur", "Veuillez sélectionner une image, un utilisateur et une durée.");
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
        Alert.alert("Succès", "Snap envoyé !");
        setModalVisible(false);
        setSelectedImage(null);
      } else {
        Alert.alert("Erreur", json.message || "Envoie du snap impossible");
      }
    } catch (error) {
      Alert.alert("Erreur", "Envoie du snap impossible");
    }
  };

  const renderUser = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => setSelectedUser(item._id)}>
      <View style={[styles.userItem, selectedUser === item._id && styles.selectedUserItem]}>
        <Text>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
      )}
      <TouchableOpacity style={styles.redBox} onPress={handleLogout}>
        <Text style={styles.text}>Se déconnecter</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.blueBox, { bottom: deviceHeight / 5 }]}
        onPress={openImagePickerAsync}
      >
        <Text style={styles.text}>Choisir une image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.greenBox, { bottom: 0 }]}
        onPress={openCameraAsync}
      >
        <Text style={styles.text}>Prendre une photo</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Utilisateurs</Text>
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={(item) => item._id}
            style={styles.userList}
          />
          <TextInput
            style={styles.input}
            onChangeText={setDuration}
            value={duration}
            placeholder="Durée (sec)"
            keyboardType="numeric"
          />
          <Button title="Envoyer Snap" onPress={sendSnap} />
          <Button
            title="Fermer"
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFC00",
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
    bottom: deviceHeight / 10,
    backgroundColor: "#ff0049",
    width: "100%",
    height: deviceHeight / 10,
  },
  blueBox: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#00a9ff",
    width: "100%",
    height: deviceHeight / 10,
  },
  greenBox: {
    position: "absolute",
    bottom: deviceHeight / 5,
    backgroundColor: "#00ff00",
    width: "100%",
    height: deviceHeight / 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollViewContent: {
    alignItems: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  userList: {
    maxHeight: 200,
    width: "100%",
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedUserItem: {
    backgroundColor: "#cce5ff",
  },
  selectedImage: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 100,
    textAlign: 'center',
  },
});
