import React, {useEffect, useState} from "react";
import { Text, View, StyleSheet, Pressable, Image, ScrollView, TouchableOpacity, Modal, RefreshControl} from "react-native";
import axios from "axios";

let BASE_URL = "http://54.234.70.84:8000/";

const Translationsmodal = ({photo}) => {
  const [modalVisible, setModalVisible] = useState(false);

  console.log("PHOTO: ", photo)
      
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
      <View style={styles.modalView}> 
        <Image
          style={{
            width: 350,
            height: 200,
          }}
          source={{
            uri: photo['photo']
          }}
        />
        <View style={styles.translationbox}> 
        <Text style={styles.translationfont}>Translation: {photo['text']} </Text>
        </View>
      </View>
        <TouchableOpacity onPress={()=> setModalVisible(false)} style={styles.overlay}> 
          <View>
          </View>
        </TouchableOpacity>
      </Modal>
      <TouchableOpacity onPress={()=> setModalVisible(true)}>
        <Image
          style={{
            width: 91,
            height: 91,
            resizeMode: 'cover',
            margin: 2
          }}
          source={{
            uri: photo['photo']
          }}
        />
      </TouchableOpacity>
    </View>
)
}

const TranslationScreen = () => {
  const [refreshing, setRefreshing] = useState(true);

  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    if(refreshing){
      axios
      .get(BASE_URL + "photos/")
      .then((response) => {
        setPhotos([...response.data]);
        console.log(response.data);
        setRefreshing(false)
      })
      .catch((error) => {
        console.log(error);
        setRefreshing(false)
      });
    }
  }, [refreshing]);


    const renderPhotos = photos.map((photo) => (
      <Translationsmodal photo={photo} key={photo.id} />
    ));

    return (
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(!refreshing)} />
      }>
      <View style={styles.background}
      >
      {renderPhotos}

      </View>
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    background: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: "wrap",
      margin: 2

    },
    overlay : {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0)'
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0,
    },
    modalView: {
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },
    translationfont : {
      fontSize : 20,
      fontWeight : 'bold',
      color : 'white',
      paddingTop : 0,
      paddingHorizontal : 10,
      alignSelf : 'baseline'
    },
    translationbox : {
        paddingVertical: 12,
        paddingHorizontal: 0,
        borderRadius: 20,
        margin : 15,
        elevation: 3,
        backgroundColor: "rgba(245, 235, 238, 0.7)",
        alignSelf : 'baseline'
    }
  });

export default TranslationScreen