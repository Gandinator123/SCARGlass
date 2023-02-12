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

import AsyncStorage from "@react-native-async-storage/async-storage";

const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // saving error
  }
};

// stack components
function SettingsScreen() {
  const switchoptions = [
    { label: "On", value: "tall" },
    { label: "Off", value: "average" },
  ];
  const fontoptions = [
    { label: "Normal", value: "tall" },
    { label: "Large", value: "average" },
  ];
  const scrolloptions = [
    { label: "Slow", value: "tall" },
    { label: "Normal", value: "average" },
    { label: "Fast", value: "average" },
  ];
  return (
    <View>
      <ScrollView>
        <Text style={styles.hellotext}>Hello Rohan!</Text>
        <SafeAreaView>
          <View>
            <Text style={styles.sectionTitle}>
              {""}
              Screen font size
            </Text>
          </View>
        </SafeAreaView>
        <View>
          <SwitchSelector
            buttonColor={"black"}
            options={fontoptions}
            initial={0}
            onPress={(value) => console.log(value)}
            buttonMargin={10}
          />
        </View>

        <SafeAreaView>
          <View>
            <Text style={styles.sectionTitle}>
              {""}
              Screen scroll speed
            </Text>
          </View>
        </SafeAreaView>
        <View>
          <SwitchSelector
            buttonColor={"black"}
            options={scrolloptions}
            initial={0}
            onPress={(value) => console.log(value)}
            buttonMargin={10}
          />
        </View>

        <SafeAreaView>
          <View>
            <Text style={styles.sectionTitle}>Some settings</Text>
          </View>
        </SafeAreaView>
        <View>
          <SwitchSelector
            buttonColor={"black"}
            options={switchoptions}
            initial={0}
            onPress={(value) => console.log(value)}
            buttonMargin={10}
          />
        </View>

        <SafeAreaView>
          <View>
            <Text style={styles.sectionTitle}>
              {""}
              Some more settings
            </Text>
          </View>
        </SafeAreaView>
        <View>
          <SwitchSelector
            buttonColor={"black"}
            options={switchoptions}
            initial={0}
            onPress={(value) => console.log(value)}
            buttonMargin={10}
          />
        </View>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => {
            removeData("access");
            removeData("refresh");
            removeData("screen");
          }}
        >
          <Text style={styles.buttonTextStyle}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    padding: 20,
  },
  hellotext: {
    marginTop: 30,
    paddingTop: 5,
    paddingHorizontal: 5,
    fontSize: 50,
    fontWeight: "bold",
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
});

export default SettingsScreen;
