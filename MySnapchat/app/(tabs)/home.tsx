import { Image, StyleSheet, View, Text, Dimensions, TouchableOpacity, Alert, FlatList, Modal, Button, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";


let deviceHeight = Dimensions.get("window").height;

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleLogout = () => {
    AsyncStorage.removeItem("token");
    navigation.navigate("(tabs)/login" as never);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.redBox} onPress={handleLogout}>
        <Text style={styles.text}>Se déconnecter</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.blueBox, { bottom: deviceHeight / 5 }]}
        onPress={() => navigation.navigate("(tabs)/sendsnap" as never)}
      >
        <Text style={styles.text}>Envoyer un snap</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.greenBox, { bottom: 0 }]}
        onPress={() => navigation.navigate("(tabs)/receivedsnap" as never)}
      >
        <Text style={styles.text}>Voir les snaps reçus</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFC00",
  },
  text: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 25,
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
});
