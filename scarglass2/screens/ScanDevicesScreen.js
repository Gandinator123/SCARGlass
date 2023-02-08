// Import React and Component
import React, { useState, createRef, Component, navigation, useEffect } from "react";
import { Constants } from 'expo';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";

let BASE_URL = "http://54.234.70.84:8000/";

const ScanDevicesScreen = ({navigation,setPaired}) => {
  const [errortext, setErrortext] = useState("");
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);
  const [timeDelay, setDelay] = useState(false);
  const [broadcasting, setbroadcasting] = useState(false);

  if (isRegistraionSuccess) {

    setTimeout(() => {
        setPaired(true)
      }, 5000)

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Image
          source={require("./../assets/tick.png")}
          style={{
            height: 150,
            resizeMode: "contain",
            alignSelf: "center",
          }}
        />
        <Text style={styles.successTextStyle}>Pairing successful!</Text>

      </View>
      
    );
  }

  setTimeout(() => {
    setDelay(!timeDelay)
  }, 5000)

  const sendIPs = (ips) => {
    setbroadcasting(true);
    console.log("in broadcasting")
    for (var ip in ips) {
        //ips[ip].ip
        console.log(ips[ip].ip);
        let url = 'http://' + ips[ip].ip + ':8000/';
        console.log(url)
        axios
            .get(url, {timeout: 2000})
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }    
    setbroadcasting(false);
  };

  useEffect(() => {
    if (timeDelay && !broadcasting) {
      axios
      .get(BASE_URL + "pairings/", {params: {pair: true}})
      .then((response) => {
        //setIsRegistraionSuccess(true);
        console.log(response.data)
        sendIPs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [timeDelay])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View style={{ alignItems: "center", margin:100 }}>
        <Image
        source={require("../assets/loading.gif")} />
        <Text 
        style={styles.registerTextStyle}>
        Finding a device to pair</Text>
        </View>
      </ScrollView>
    </View>
  );
};
export default ScanDevicesScreen;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: "row",
    height: 50,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 2,
  },
  buttonStyle: {
    backgroundColor: "#000000",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 50,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 15,
    fontWeight: "bold",
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: "black",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  successTextStyle: {
    color: "black",
    textAlign: "center",
    fontSize: 18,
    padding: 30,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    backgroundColor: '#ecf0f1',
  },
  registerTextStyle: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
});
