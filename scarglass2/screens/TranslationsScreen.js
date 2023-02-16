import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  RefreshControl,
  Alert,
} from "react-native";
import axios from "axios";
import api from "../api";

let BASE_URL = "http://54.234.70.84:8000/";

const deleteFunction = (photo_id) => {
  Alert.alert(
    "Delete?",
    "Are you sure you want to delete this?",
    [
      {
        text: "Delete",
        onPress: () => axios.delete(BASE_URL + `photos/${photo_id}/delete/`),
        style: "destructive",
      },
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
    ],
    {
      cancelable: true,
      onDismiss: () => console.log("dismissed"),
    }
  );
};

const Translationsmodal = ({ photo }) => {
  const [modalVisible, setModalVisible] = useState(false);

  console.log("PHOTO: ", photo);
  let translation = photo["text"];
  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <Image
            style={{
              width: 350,
              height: 200,
              alignSelf: 'center',
              marginTop: 200
            }}
            source={{
              uri: photo["photo"],
            }}
          />
          <ScrollView style={styles.translationbox}>
            <Text style={styles.translationfont}>{photo["text"]} </Text>
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={styles.overlay}
        >
          <View></View>
        </TouchableOpacity>
      </Modal>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        onLongPress={() => deleteFunction(photo.id)}
      >
        <Image
          style={{
            width: 91,
            height: 91,
            resizeMode: "cover",
            margin: 2,
          }}
          source={{
            uri: photo["photo"],
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const TranslationScreen = () => {
  const [refreshing, setRefreshing] = useState(true);

  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    if (refreshing) {
      api
        .getPhotos(1)
        .then((response) => {
          setPhotos([...response.data]);
          console.log(response.data);
          setRefreshing(false);
        })
        .catch((error) => {
          console.log(error);
          setRefreshing(false);
        });
    }
  }, [refreshing]);

  const renderPhotos = photos.map((photo) => (
    <Translationsmodal photo={photo} key={photo.id} />
  ));

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshing(!refreshing)}
        />
      }
      style={{ backgroundColor: "white" }}
    >
      <View style={styles.background}>{renderPhotos}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 2,
    backgroundColor: "white",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 0,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  translationfont: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    paddingHorizontal: 10,
    alignSelf: "baseline",
  },
  translationbox: {
    paddingVertical: 2,
    borderRadius: 25,
    margin: 15,
    backgroundColor: "#fafdfe",
    alignSelf: "baseline",
  },
});

export default TranslationScreen;
