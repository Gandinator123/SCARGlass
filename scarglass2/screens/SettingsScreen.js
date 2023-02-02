import React from 'react';
import {AppRegistry,Component,StyleSheet,Text,View,SafeAreaView,ScrollViewBase } from 'react-native';
import SwitchSelector from "react-native-switch-selector";

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
        <Text style={styles.hellotext}>Hello Rohan!</Text>
          <SafeAreaView>
            <View>
              <Text style={styles.sectionTitle}>
                {""}
                Font size
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
                Scroll speed
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
              <Text style={styles.sectionTitle}>
                {""}
                Some settings
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
      marginTop : 30,
      paddingTop: 5,
      paddingHorizontal : 5,
      fontSize: 50, 
      fontWeight: 'bold',
    }
  });

export default SettingsScreen
