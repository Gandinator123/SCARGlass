import React from "react";
import { Text, View, StyleSheet, Pressable, ScrollView, Image, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import PicturesScreen from "./screens/PicturesScreen";
import ChatGPTresponses from "./screens/ChatGPTScreen";
import TranslationScreen from "./screens/TranslationsScreen";
import QRScreen from "./screens/QRScreen";

///////////////////////////////////////
//// EVERYTHING ABOUT HOMESCREEN STUFF

// TAB constaining stack components (everything on that screen)
const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen name="HomeStack" component={HomeScreen} />
      <HomeStack.Screen name="LayoutStack" component={LayoutScreen} />
    </HomeStack.Navigator>
  );
}

// Stack components

function LayoutScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Layout!</Text>
    </View>
  );
}
//////////////////////////////////////////
//////////////////////////////////////////

// TAB constaining stack components (everything on that screen)
const SettingsStack = createNativeStackNavigator();
function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SettingsStack.Screen name="SettingsStack" component={SettingsScreen} />
      <SettingsStack.Screen name="DetailsStack" component={DetailsScreen} />
    </SettingsStack.Navigator>
  );
}

function DetailsScreen() {
  return (
    <View >
      <Text>Layout!</Text>
    </View>
  );
}

//////////////////////////////////////
//////////////////////////////////////

// TAB constaining stack components (everything on that screen)
const ResponsesStack = createNativeStackNavigator();
function ResponsesStackScreen() {
  return (
    <ResponsesStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ResponsesStack.Screen
        name="ResponsesStack"
        component={ResponsesScreen}
      />
      <ResponsesStack.Screen name="PicturesStack" component={PicturesScreen} />
      <ResponsesStack.Screen name="ChatGPTStack" component={ChatGPTresponses} />
      <ResponsesStack.Screen name="DocumentsScreen" component={DocumentsScreen} />
      <ResponsesStack.Screen name="TranslationScreen" component={TranslationScreen} />
      <ResponsesStack.Screen name="QRScreen" component={QRScreen} />
    </ResponsesStack.Navigator>
  );
}

// style={{ flex: 1, justifyContent: "space-evenly", alignItems: "center"}}
//stack components
function ResponsesScreen({ navigation }) {
  return (
    <View
      style={{ flexDirection: 'row',  flexWrap: "wrap", justifyContent: "flex-start", alignItems: "baseline", margin: 20}}
    >
      <Button
        title="Pictures"
        onPress={() => navigation.navigate("PicturesStack")}
        image='./images/picture.png'
      />
      <Button
        title="ChatGPT"
        onPress={() => navigation.navigate("ChatGPTStack")}
        image='./images/chatgpt.png'
      />

      <Button
        title="Documents"
        onPress={() => navigation.navigate("DocumentsScreen")}
        image='./images/documents.png'
      />

      <Button
        title="Translations"
        onPress={() => navigation.navigate("TranslationScreen")}
        image='./images/translate.png'
      />

      <Button
        title="QRScreen"
        onPress={() => navigation.navigate("QRScreen")}
        image="./images/qrcode.png"
      />
    </View>
  );
}

function DocumentsScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>DocumentsScreen</Text>
    </View>
  );
}

// function TranslatesScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Text>TranslatesScreen</Text>
//     </View>
//   );
// }


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
//////////////////////////////
// Button styling
// function Button({ onPress, title }) {
//   // const { onPress, title = 'Save' } = props;
//   return (
//     <Pressable style={styles.button} onPress={onPress}>
//       <Text style={styles.text}>{title}</Text>
//     </Pressable>
//   );
// }

function Button({ onPress, title, image }) {
  // const { onPress, title = 'Save' } = props;
  console.log(image)
  return (
    <View style={styles.button2}>
    <TouchableOpacity onPress={onPress}>
        <Image
        style={styles.deviceimage}
          source={require('./images/picture.png')}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyCContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 40,
    elevation: 3,
    backgroundColor: "black",
  },
  button2: {
    flexDirection: 'row',
    justifyContent: "space-evenly",
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0)',
    borderRadius: 5,
    margin: 5,
  },
  text: {
    aligalignItems: "center",
    fontSize: 50,
    lineHeight: 80,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  containerprofile: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: '#859a9b', //change for dominant colour in the image.
    justifyContent: 'flex-start',
  },
  deviceimage: {
    width: 100,
    height: 100,
  },
});

//////////////////////////////
//////////////////////////////

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "ios-home" : "ios-home-outline";
            } else if (route.name === "Responses") {
              iconName = focused ? "ios-albums" : "ios-albums-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "ios-settings" : "ios-settings-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Responses" component={ResponsesStackScreen} />
        <Tab.Screen name="Settings" component={SettingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
