import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Modal,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

type Snap = {
  _id: string;
  date: string;
  from: string;
  image: string;
  duration: number;
  fromUsername?: string; // Optional property for storing the username
};

export default function ReceivedSnap() {
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSnap, setSelectedSnap] = useState<Snap | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchSnaps();
  }, []);

  const fetchSnaps = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch("https://snapchat.epidoc.eu/snap", {
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
        const snapsWithUsernames = await Promise.all(
          json.data.map(async (snap: Snap) => {
            const username = await fetchUsername(snap.from);
            return { ...snap, fromUsername: username };
          })
        );
        setSnaps(snapsWithUsernames);
      } else {
        Alert.alert("Erreur", "Échec de la récupération des snaps");
      }
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la récupération des snaps");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsername = async (id: string): Promise<string> => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`https://snapchat.epidoc.eu/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhc3NpZHkubmd1eWVuQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjQwNjl9.GmU6Ur8xdyKF_orG358zEEHl9eF6AC5x2IxbDmne4mc",
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await response.json();
      if (response.ok) {
        return userData.username;
      } else {
        return "Utilisateur inconnu";
      }
    } catch (error) {
      return "Utilisateur inconnu";
    }
  };

  const viewSnap = async (id: string) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`https://snapchat.epidoc.eu/snap/${id}`, {
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
        const username = await fetchUsername(json.data.from);
        const snapWithUsername: Snap = { ...json.data, fromUsername: username };
        setSelectedSnap(snapWithUsername);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          markSnapAsSeen(snapWithUsername._id);
          setSnaps((prevSnaps) => prevSnaps.filter((snap) => snap._id !== id));
        }, json.data.duration * 1000);
      } else {
        Alert.alert("Erreur", "Échec de l'ouverture du snap");
      }
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de l'ouverture du snap");
    }
  };

  const markSnapAsSeen = async (id: string) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`https://snapchat.epidoc.eu/snap/seen/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhc3NpZHkubmd1eWVuQGVwaXRlY2guZXUiLCJpYXQiOjE3MTc3NjQwNjl9.GmU6Ur8xdyKF_orG358zEEHl9eF6AC5x2IxbDmne4mc",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        Alert.alert("Erreur", "Échec de la mise à jour du snap comme vu");
      }
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la mise à jour du snap comme vu");
    }
  };

  const renderSnap = ({ item }: { item: Snap }) => (
    <TouchableOpacity
      style={styles.snapItem}
      onPress={() => viewSnap(item._id)}
    >
      <Text style={styles.snapText}>De : {item.fromUsername || item.from}</Text>
      <Text style={styles.snapDate}>Reçu le : {new Date(item.date).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={snaps}
        renderItem={renderSnap}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>Aucun snap reçu.</Text>}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("(tabs)/home" as never)}
      >
        <Text style={styles.backButtonText}>Retourner à l'accueil</Text>
      </TouchableOpacity>
      {selectedSnap && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Image
              source={{ uri: selectedSnap.image }}
              style={styles.snapImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  snapItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  snapText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  snapDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  backButton: {
    backgroundColor: "#00a9ff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignSelf: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  snapImage: {
    width: "100%",
    height: "100%",
  },
});
