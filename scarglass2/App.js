import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import PicturesScreen from "./screens/PicturesScreen";
import ChatGPTresponses from "./screens/ChatGPTScreen";
import TranslationScreen from "./screens/TranslationsScreen";
import LoginScreenPage from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import QRScreen from "./screens/QRScreen";
import DocumentsScreen from "./screens/DocumentsScreen";
import ScanDevicesScreen from "./screens/ScanDevicesScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

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
    <View>
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
      <ResponsesStack.Screen
        name="DocumentsScreen"
        component={DocumentsScreen}
      />
      <ResponsesStack.Screen
        name="TranslationScreen"
        component={TranslationScreen}
      />
      <ResponsesStack.Screen name="QRScreen" component={QRScreen} />
    </ResponsesStack.Navigator>
  );
}

// style={{ flex: 1, justifyContent: "space-evenly", alignItems: "center"}}
//stack components
function ResponsesScreen({ navigation }) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "baseline",
        margin: 20,
        paddingTop: 30,
      }}
    >
      <Button
        title="Pictures"
        onPress={() => navigation.navigate("PicturesStack")}
        image="0"
      />
      <Button
        title="ChatGPT"
        onPress={() => navigation.navigate("ChatGPTStack")}
        image="1"
      />

      <Button
        title="Documents"
        onPress={() => navigation.navigate("DocumentsScreen")}
        image="2"
      />

      <Button
        title="Translations"
        onPress={() => navigation.navigate("TranslationScreen")}
        image="3"
      />

      <Button
        title="QRScreen"
        onPress={() => navigation.navigate("QRScreen")}
        image="4"
      />
    </View>
  );
}

// function DocumentsScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Text>DocumentsScreen</Text>
//     </View>
//   );
// }

// function TranslatesScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Text>TranslatesScreen</Text>
//     </View>
//   );
// }

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
  console.log(image);

  switch (image) {
    case "0":
      return (
        <View style={styles.button2}>
          <TouchableOpacity onPress={onPress}>
            <Image
              style={styles.deviceimage}
              source={require("./images/picture.png")}
            />
          </TouchableOpacity>
          <Text style={styles.icontext}>Pictures</Text>
        </View>
      );
    case "1":
      return (
        <View style={styles.button2}>
          <TouchableOpacity onPress={onPress}>
            <Image
              style={styles.deviceimage}
              source={require("./images/chatgpt.png")}
            />
          </TouchableOpacity>
          <Text style={styles.icontext}>ChatGPT</Text>
        </View>
      );
    case "2":
      return (
        <View style={styles.button2}>
          <TouchableOpacity onPress={onPress}>
            <Image
              style={styles.deviceimage}
              source={require("./images/documents.png")}
            />
          </TouchableOpacity>
          <Text style={styles.icontext}>Documents</Text>
        </View>
      );
    case "3":
      return (
        <View style={styles.button2}>
          <TouchableOpacity onPress={onPress}>
            <Image
              style={styles.deviceimage}
              source={require("./images/translate.png")}
            />
          </TouchableOpacity>
          <Text style={styles.icontext}>Translations</Text>
        </View>
      );
    case "4":
      return (
        <View style={styles.button2}>
          <TouchableOpacity onPress={onPress}>
            <Image
              style={styles.deviceimage}
              source={require("./images/qrcode.png")}
            />
          </TouchableOpacity>
          <Text style={styles.icontext}>QR codes</Text>
        </View>
      );
  }
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
    flexDirection: "column",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0)",
    borderRadius: 5,
    padding: 25,
    paddingHorizontal: 27,
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
    alignContent: "center",
    backgroundColor: "#859a9b", //change for dominant colour in the image.
    justifyContent: "flex-start",
  },
  deviceimage: {
    width: 110,
    height: 110,
  },
  icontext: {
    paddingVertical: 15,
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "bold",
  },
});

//////////////////////////////
//////////////////////////////

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainApp = () => {
  const [loading, setLoading] = useState(true);
  const [paired, setPaired] = useState(false);
  useEffect(() => {
    // check if user is associated with screen
    api
      .getUser()
      .then((response) => {
        console.log(response);
        if (response.data[0].screens.length > 0) {
          AsyncStorage.setItem(
            "screen",
            response.data[0].screens[0].id.toString()
          ).then(() => {
            setPaired(true);
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          // unauthorized: refresh cookie
          api.refresh().then((response) => {
            AsyncStorage.setItem("access", response.data["access"]).then(() => {
              // refreshed: try again
              api
                .getUser()
                .then((resp) => {
                  console.log(resp.data);
                  if (resp.data[0].screens.length > 0) {
                    AsyncStorage.setItem(
                      "screen",
                      resp.data[0].screens[0].id.toString()
                    ).then(() => {
                      setPaired(true);
                    });
                  }
                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);
                });
            });
          });
        } else {
          console.log(error);
          setLoading(false);
        }
      });
  }, []);

  return loading ? null : paired ? (
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
  ) : (
    <ScanDevicesScreen setPaired={setPaired} />
  );
};

const Auth = () => {
  // Stack Navigator for Login and Sign up Screen

  return (
    <Stack.Navigator initialRouteName="LoginScreenPage">
      <Stack.Screen
        name="LoginScreenPage"
        component={LoginScreenPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: "Register", //Set Header Title
          headerTintColor: "#000000", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainApp"
          component={MainApp}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
