import React, { useState } from "react";
import {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollViewBase,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // saving error
  }
};

// stack components
function SettingsScreen({ name, email, screenID, avatar, setAvatar, id }) {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const data = new FormData();
      data.append("avatar", {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName,
        type: "image/png",
      });
      axios
        .put("http://54.234.70.84:8000/users/" + id + "/", data)
        .then((response) => {
          console.log(response);
          setAvatar(result.assets[0].uri);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  };

  const navigation = useNavigation();
  return (
    <View style={{ backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.hellotext}>Hello {name}!</Text>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: avatar }}
            style={{ width: 75, height: 75, borderRadius: 50, marginLeft: 15 }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.MainContainer}>
        <Text style={styles.settingtypetext}>Email</Text>
        <Text style={styles.settingdatatext}>{email}</Text>
      </View>
      <View style={styles.MainContainer}>
        <Text style={styles.settingtypetext}>Screen ID</Text>
        <Text style={styles.settingdatatext}>{screenID}</Text>
      </View>
      <View style={styles.MainContainer}>
        <Text style={styles.settingtypetext}>Model</Text>
        <Text style={styles.settingdatatext}>SCARGlass 1</Text>
      </View>
      <View style={styles.MainContainer}>
        <Text style={styles.settingtypetext}>Specs</Text>
        <Text style={styles.settingdata2text}>
          0.96 inch 80x160 RGB Oled display
        </Text>
        <Text style={styles.settingdata2text}>1080p 5MP Camera</Text>
        <Text style={styles.settingdata2text}>
          Air temperature and humidity sensor{" "}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={() => {
          removeData("access");
          removeData("refresh");
          removeData("screen");
          navigation.navigate("Auth", { screen: "LoginScreenPage" });
        }}
      >
        <Text style={styles.buttonTextStyle}>Sign out</Text>
      </TouchableOpacity>

      <Text style={styles.lighttext}>Version 1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    alignItems: "center",
    justifyCContent: "center",
    padding: 10,
    elevation: 3,
    backgroundColor: "white",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    padding: 20,
  },
  hellotext: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 5,
    fontSize: 47,
    fontWeight: "bold",
  },
  settingtypetext: {
    alignSelf: "baseline",
    fontSize: 25,
    fontWeight: "bold",
  },
  settingdatatext: {
    alignSelf: "baseline",
    fontSize: 20,
    fontWeight: "200",
    marginVertical: 7,
  },
  settingdata2text: {
    alignSelf: "baseline",
    fontSize: 14,
    fontWeight: "200",
    marginVertical: 3,
  },
  lighttext: {
    marginTop: 10,
    marginBottom: 200,
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "100",
  },
  buttonStyle: {
    backgroundColor: "#000000",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 50,
    alignItems: "center",
    borderRadius: 20,
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
});

export default SettingsScreen;

// const switchoptions = [
//   { label: "On", value: "tall" },
//   { label: "Off", value: "average" },
// ];
// const fontoptions = [
//   { label: "Normal", value: "tall" },
//   { label: "Large", value: "average" },
// ];
// const scrolloptions = [
//   { label: "Slow", value: "tall" },
//   { label: "Normal", value: "average" },
//   { label: "Fast", value: "average" },
//   { label: "Fast", value: "average" },
// ];
// const timeformat = [
//   { label: "HH:MM:SS (24 hr)", value: 0 },
//   { label: "HH:MM (24 hr)", value: 1 },
//   { label: "HH:MM:SS AM/PM", value: 2 },
//   { label: "HH:MM AM/PM", value: 3 },
// ]

// <SafeAreaView>
//           <View>
//             <Text style={styles.sectionTitle}>
//               {""}
//               Screen font size
//             </Text>
//           </View>
//         </SafeAreaView>
//         <View>
//           <SwitchSelector
//             buttonColor={"black"}
//             options={fontoptions}
//             initial={0}
//             onPress={(value) => console.log(value)}
//             buttonMargin={10}
//           />
//         </View>

//         <SafeAreaView>
//           <View>
//             <Text style={styles.sectionTitle}>
//               {""}
//               Screen scroll speed
//             </Text>
//           </View>
//         </SafeAreaView>
//         <View>
//           <SwitchSelector
//             buttonColor={"black"}
//             options={timeformat}
//             initial={0}
//             onPress={(value) => console.log(value)}
//             buttonMargin={5}
//           />
//         </View>

//         <SafeAreaView>
//           <View>
//             <Text style={styles.sectionTitle}>Some settings</Text>
//           </View>
//         </SafeAreaView>
//         <View>
//           <SwitchSelector
//             buttonColor={"black"}
//             options={switchoptions}
//             initial={0}
//             onPress={(value) => console.log(value)}
//             buttonMargin={5}
//           />
//         </View>

//         <SafeAreaView>
//           <View>
//             <Text style={styles.sectionTitle}>
//               {""}
//               Some more settings
//             </Text>
//           </View>
//         </SafeAreaView>
//         <View>
//           <SwitchSelector
//             buttonColor={"black"}
//             options={switchoptions}
//             initial={0}
//             onPress={(value) => console.log(value)}
//             buttonMargin={10}
//           />
//         </View>
