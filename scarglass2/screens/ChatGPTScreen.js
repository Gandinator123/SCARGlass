import React, {useEffect, useState} from "react";
import { Text, View, StyleSheet, Pressable, Image, ScrollView, TouchableOpacity, Modal} from "react-native";
import axios from "axios";

let BASE_URL = "http://54.234.70.84:8000/";

const ChatGPTresponses = () => {
  
    const [responses, setResponse] = useState([]);
    useEffect(() => {
      axios
        .get(BASE_URL + "questions/")
        .then((resp) => {
          setResponse([...resp.data]);
          console.log(resp.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, []);

    const renderResponses = responses.map((response) => (
        <View key={response.id}>
        <Text style={styles.MainContainer}>
        <Text style={styles.QuestionStyle}>Question: {response.question}?{'\n'}</Text>
        <Text style={styles.Responsestyle}>ChatGPT: {response.response}</Text>
        </Text>
        </View>      
    ));
  
      return (
        <ScrollView>
        <View style={styles.background}>
        {renderResponses}
        </View>
        </ScrollView>
      );
}
  //response.question
      //response.response

const styles = StyleSheet.create({
    MainContainer: {
 
        alignItems: "center",
        justifyCContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        margin : 15,
        elevation: 3,
        backgroundColor: "#CDD0D5",
     
    },
      QuestionStyle: {
        borderRadius: 30,
        color: '#000',
        // Setting Up Background Color of Text component.
        // Adding padding on Text component.
        fontWeight: "bold",
        padding : 2,
        fontSize: 25,
        textAlign: 'center',
        margin: 10
      },
      Responsestyle : {
        borderRadius: 30,
        // Set border width.
        color: '#000',
        // Setting Up Background Color of Text component.
        // Adding padding on Text component.
        padding : 2,
        fontSize: 25,
        textAlign: 'center',
        margin: 10,
        fontStyle: 'italic'
      }

});


export default ChatGPTresponses