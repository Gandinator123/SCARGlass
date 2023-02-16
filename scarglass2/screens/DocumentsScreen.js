import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
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
  Linking,
  Alert,
} from "react-native";
import axios from "axios";
import api from "../api";
import * as Sharing from "expo-sharing";

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

const makeDownload = async (image_url) => {
  let link = image_url.slice(0, -4);
  let pdf = link + ".pdf";

  const downloadPath = FileSystem.cacheDirectory + "test.pdf";
  // 1 - download the file to a local cache directory
  const { uri: localUrl } = await FileSystem.downloadAsync(pdf, downloadPath);
  // 2 - share it from your local storage :)
  Sharing.shareAsync(localUrl, {
    mimeType: "application/pdf", // Android
    dialogTitle: "share-dialog title", // Android and Web
    UTI: "public.item", // iOS
  });
};

const Documentsmodal = ({ photo }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [download, setDownload] = useState(false);

  console.log("PHOTO: ", photo);
  let translation = photo["text"];
  const source = {
    uri: "http://samples.leanpub.com/thereactnativebook-sample.pdf",
    cache: true,
  };
  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <Image
            style={{
              width: 350,
              height: 200,
              marginBottom: 100,
            }}
            source={{
              uri: photo["photo"],
            }}
          />
          <ScrollView style={styles.translationbox}></ScrollView>
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={styles.overlay}
        >
          <View></View>
        </TouchableOpacity>
      </Modal>
      <TouchableOpacity
        onPress={() => makeDownload(photo.photo)}
        onLongPress={() => deleteFunction(photo.id)}
      >
        <Image
          style={{
            width: 185,
            height: 181,
            resizeMode: "cover",
            margin: 2,
            borderRadius: 5,
          }}
          source={{
            uri: photo["photo"],
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const DocumentsScreen = () => {
  const [refreshing, setRefreshing] = useState(true);

  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    if (refreshing) {
      api
        .getPhotos(3)
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
    <Documentsmodal photo={photo} key={photo.id} />
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
    color: "white",
    paddingTop: 0,
    paddingHorizontal: 10,
    alignSelf: "baseline",
  },
  translationbox: {
    position: "absolute",
    top: 475,
    bottom: 2,
    paddingVertical: 2,
    borderRadius: 20,
    margin: 15,
    backgroundColor: "rgba(245, 235, 238, 0.7)",
    alignSelf: "baseline",
  },
});

export default DocumentsScreen;
