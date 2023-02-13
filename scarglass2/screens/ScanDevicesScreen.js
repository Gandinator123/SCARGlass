import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import axios from "axios";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { back } from "react-native/Libraries/Animated/Easing";

const ScanDevicesScreen = ({ setPaired }) => {
  const [errortext, setErrortext] = useState("");
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);
  const [timeDelay, setDelay] = useState(false);
  const [broadcasting, setbroadcasting] = useState(false);

  useEffect(() => {
    if (isRegistraionSuccess) {
      setTimeout(() => {
        setPaired(true);
      }, 1000)
    }
  }, [isRegistraionSuccess])

  setTimeout(() => {
    setDelay(!timeDelay);
  }, 5000);

  const saveScreen = async (id, url) => {
    try {
      let res = await axios({
        url: url,
        method: "post",
        data: { id: id },
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        console.log("200 OK");
        AsyncStorage.setItem("screen_id", id.toString());
        setPaired(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createScreen = async (url) => {
    api
      .createScreen()
      .then((response) => {
        console.log(response.data);
        saveScreen(response.data["id"], url);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          // unauthorized: refresh cookie
          api.refresh().then((response) => {
            // refreshed: try again
            AsyncStorage.setItem("access", response.data["access"]).then(() => {
              api
                .createScreen()
                .then((resp) => {
                  console.log(resp.data);
                  saveScreen(resp.data["id"], url);
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          });
        } else {
          console.log(error);
        }
      });
  };

  const ping = async (ips) => {
    setbroadcasting(true);
    for (var ip in ips) {
      //ips[ip].ip
      let url = "http://" + ips[ip].ip + ":8000/";

      try {
        let res = await axios({
          url: url,
          method: "get",
          timeout: 2000,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status === 200) {
          console.log("200 OK");

          // post to create screen
          createScreen(url);
          break;
        }
      } catch (err) {
        console.log(err);
      }
    }
    setbroadcasting(false);
  };

  useEffect(() => {
    if (timeDelay && !broadcasting) {
      api
        .getAllPairings()
        .then((response) => {
          setIsRegistraionSuccess(true);
          console.log(response.data);
          //ping(response.data);
          // setPaired(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [timeDelay]);

  return isRegistraionSuccess ? <View
  style={{
    flex: 1,
    justifyContent: "center",
    backgroundColor: 'white'
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
</View> : (
    <View style={{ flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            alignItems: "center",
            margin: 100,
            alignSelf: "center",
            justifyContent: "center",
            top: 100,
          }}
        >
          <Image source={require("../assets/loading.gif")} />
          <Text style={styles.registerTextStyle}>Finding a device to pair</Text>
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
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    backgroundColor: "#ecf0f1",
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
