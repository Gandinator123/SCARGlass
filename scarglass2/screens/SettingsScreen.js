import React from 'react';
import {AppRegistry,Component,StyleSheet,Text,View,SafeAreaView,ScrollViewBase } from 'react-native';
import SwitchSelector from "react-native-switch-selector";

// stack components
function SettingsScreen() {
    const switchoptions = [
        { label: "On", value: "tall" },
        { label: "Off", value: "average" },
    ]; 
    return (
        <View>
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
  });

export default SettingsScreen
