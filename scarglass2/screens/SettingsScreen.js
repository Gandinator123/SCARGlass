import React from "react";
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
} from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from "@react-native-async-storage/async-storage";

const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // saving error
  }
};

// stack components
function SettingsScreen({name, email, screenID}) {
  const navigation = useNavigation(); 
  return (
    <View style={{backgroundColor:'white'}}>
        <Text style={styles.hellotext}>Hello {name}!</Text>
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
              <Text style={styles.settingdata2text}>0.96 inch 80x160 RGB Oled display</Text>
              <Text style={styles.settingdata2text}>1080p 5MP Camera</Text>
              <Text style={styles.settingdata2text}>Air temperature and humidity sensor	 </Text>
          </View>
        
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={() => {
              removeData("access");
              removeData("refresh");
              removeData("screen");
              navigation.navigate('Auth', { screen: 'LoginScreenPage' })
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
    marginBottom: 10
 
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
    fontSize: 50,
    fontWeight: "bold",
  },
  settingtypetext : {
    alignSelf: 'baseline',
    fontSize: 25,
    fontWeight: "bold",
  },
  settingdatatext : {
    alignSelf: 'baseline',
    fontSize: 20,
    fontWeight: "200",
    marginVertical: 7
  },
  settingdata2text : {
    alignSelf: 'baseline',
    fontSize: 14,
    fontWeight: "200",
    marginVertical: 3
  },
  lighttext : {
    marginTop: 10,
    marginBottom: 200,
    alignSelf: 'center',
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