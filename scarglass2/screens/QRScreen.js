import React, {useEffect, useState} from "react";
import { Text, View, StyleSheet, Pressable, Image, ScrollView, TouchableOpacity, Modal, RefreshControl, Alert} from "react-native";
import axios from "axios";

let BASE_URL = "http://54.234.70.84:8000/";

const deleteFunction = (photo_id) => {
  Alert.alert(
    'Delete?',
    'Are you sure you want to delete this?',
    [
      {
        text: 'Delete',
        onPress: () =>  axios.delete((BASE_URL + `photos/${photo_id}/delete/`)),
        style: 'destructive',
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        console.log("dismissed")
    },
  );
}

const QRmodal = ({photo}) => {
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
            marginBottom : 100
          }}
          source={{
            uri: photo['photo']
          }}
        />
        <ScrollView style={styles.QRbox}> 
        <Text style={styles.QRfont}>{photo['text']} </Text>
        </ScrollView> 
      </View>
        <TouchableOpacity onPress={()=> setModalVisible(false)} style={styles.overlay}> 
          <View>
          </View>
        </TouchableOpacity>
      </Modal>
      <TouchableOpacity onPress={()=> setModalVisible(true)} onLongPress={()=> deleteFunction(photo.id)}>
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

const QRScreen = () => {
  const [refreshing, setRefreshing] = useState(true);

  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    if(refreshing){
      axios
      .get(BASE_URL + "photos/", {params: {img_type:2}})
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
      <QRmodal photo={photo} key={photo.id} />
    ));

    return (
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(!refreshing)} />
      } style={{backgroundColor:'white'}}>
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
      margin: 2,
      backgroundColor: 'white'

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
      marginTop: 22,
    },
    modalView: {
      margin: 0,
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
    QRfont : {
      fontSize : 20,
      fontWeight : 'bold',
      color : 'white',
      paddingTop : 0,
      paddingHorizontal : 10,
      alignSelf : 'baseline'
    },
    QRbox : {
        position: 'absolute',
        alignContent: 'center',
        top: 475,
        bottom: 250,
        paddingVertical: 2,
        borderRadius: 20,
        margin : 15,
        backgroundColor: "rgba(245, 235, 238, 0.7)",
    }
  });

export default QRScreen