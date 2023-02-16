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

const deleteFunction = (item_id) => {
  Alert.alert(
    "Delete?",
    "Are you sure you want to delete this?",
    [
      {
        text: "Delete",
        onPress: () => axios.delete(BASE_URL + `photos/${item_id}/delete/`),
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

const ChatGPTresponses = () => {
  const [refreshing, setRefreshing] = useState(true);

  const [responses, setResponse] = useState([]);
  useEffect(() => {
    api
      .getQuestions()
      .then((resp) => {
        setResponse([...resp.data]);
        console.log(resp.data);
        setRefreshing(false);
      })
      .catch((error) => {
        console.log(error);
        setRefreshing(false);
      });
  }, [refreshing]);

  const renderResponses = responses.map((response) => (
    <View key={response.id}>
      <TouchableOpacity
        style={styles.MainContainer}
        onLongPress={() => deleteFunction(response.id)}
      >
        <Text style={styles.QuestionStyle}>
          Question: {response.question}?{"\n"}
        </Text>
        <Text style={styles.Responsestyle}>ChatGPT: {response.response}</Text>
      </TouchableOpacity>
    </View>
  ));

  return (
    <ScrollView
      style={{ backgroundColor: "white" }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshing(!refreshing)}
        />
      }
    >
      <View style={{ backgroundColor: "white" }}>{renderResponses}</View>
    </ScrollView>
  );
};
//response.question
//response.response

const styles = StyleSheet.create({
  MainContainer: {
    alignItems: "flex-start",
    justifyCContent: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 20,
    margin: 15,
    elevation: 3,
    backgroundColor: "#CDD0D5",
  },
  QuestionStyle: {
    color: "#000",
    // Setting Up Background Color of Text component.
    // Adding padding on Text component.
    fontWeight: "bold",
    padding: 2,
    fontSize: 25,
    textAlign: "left",
  },
  Responsestyle: {
    borderRadius: 30,
    // Set border width.
    color: "#000",
    // Setting Up Background Color of Text component.
    // Adding padding on Text component.
    padding: 2,
    fontSize: 25,
    textAlign: "left",
    fontStyle: "italic",
  },
});

export default ChatGPTresponses;
