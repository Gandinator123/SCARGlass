import React, {useEffect, useState} from "react";
import { Text, View, StyleSheet, Pressable, Image, ScrollView, TouchableOpacity, Modal} from "react-native";
import axios from "axios";

let BASE_URL = "http://54.234.70.84:8000/";

const PictureModal = ({photo}) => {
  const [modalVisible, setModalVisible] = useState(false);

  console.log("PHOTO: ", photo)
      
  return (
    <View>
    <Modal
    animationType="fade"
    transparent={true}
    visible={modalVisible}>
  <Image
    style={{
      width: 200,
      height: 200,
      alignItems: 'center'
    }}
    source={{
      uri: photo['photo']
    }}
  />
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

const PicturesScreen = () => {

  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "photos/")
      .then((response) => {
        setPhotos([...response.data]);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


    const renderPhotos = photos.map((photo) => (
      <PictureModal photo={photo} key={photo.id} />
    ));

    return (
      <ScrollView>
      <View style={styles.background}>
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
  });

export default PicturesScreen



// const [images, setImages] = useState([]);

// useEffect(() => {
//   let temp_images = images;

//   photos.map((photo) => {
//     obj = {'source': {}}
//     obj['source']['uri'] = photo['photo']
//     obj['width'] = 100
//     obj['height'] = 100
//     temp_images.push(obj)
//     }
//   )

//   setImages([...temp_images]);

// }, [photos])

// useEffect(() => {
//   console.log("IMAGES: ", images);
// }, [images])

// return (
//   <ScrollView>
//   <View style={styles.background}>
//   <ImageView
// images={images}
// imageIndex={0}
// isVisible={false}
//  renderFooter={(currentImage) => (<View><Text>My footer</Text></View>)}
// />
//   </View>
//   </ScrollView>
// );
