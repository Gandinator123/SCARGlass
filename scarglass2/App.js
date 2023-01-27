import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";

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
const HomeScreen = () => {
  const [timeFormatOpen, setTimeFormatOpen] = useState(false);
  const [timeFormatValue, setTimeFormatValue] = useState(0);
  const [timeFormatItems, setTimeFormatItems] = useState([
    { label: "HH:MM:SS (24 hr)", value: 0 },
    { label: "HH:MM (24 hr)", value: 1 },
    { label: "HH:MM:SS AM/PM", value: 2 },
    { label: "HH:MM AM/PM", value: 3 },
  ]);
  const [dateFormatOpen, setDateFormatOpen] = useState(false);
  const [dateFormatValue, setDateFormatValue] = useState(0);
  const [dateFormatItems, setDateFormatItems] = useState([
    { label: "dd/mm/yyyy", value: 0 },
    { label: "dd/mm/yy", value: 1 },
  ]);
  const [dayFormatOpen, setDayFormatOpen] = useState(false);
  const [dayFormatValue, setDayFormatValue] = useState(0);
  const [dayFormatItems, setDayFormatItems] = useState([
    { label: "Full (e.g. Wednesday)", value: 0 },
    { label: "Short (e.g. Wed)", value: 1 },
    { label: "None", value: 2 },
  ]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Time format:</Text>
      <DropDownPicker
        open={timeFormatOpen}
        value={timeFormatValue}
        items={timeFormatItems}
        setOpen={setTimeFormatOpen}
        setValue={setTimeFormatValue}
        setItems={setTimeFormatItems}
      />
      <Text>Date format:</Text>
      <DropDownPicker
        open={dateFormatOpen}
        value={dateFormatValue}
        items={dateFormatItems}
        setOpen={setDateFormatOpen}
        setValue={setDateFormatValue}
        setItems={setDateFormatItems}
      />
      <Text>Day format:</Text>
      <DropDownPicker
        open={dayFormatOpen}
        value={dayFormatValue}
        items={dayFormatItems}
        setOpen={setDayFormatOpen}
        setValue={setDayFormatValue}
        setItems={setDayFormatItems}
      />
    </View>
  );
};

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

// stack components
function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings!</Text>
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
    </ResponsesStack.Navigator>
  );
}

//stack components
function ResponsesScreen({ navigation }) {
  return (
    <View
      style={{ flex: 1, justifyContent: "space-evenly", alignItems: "center" }}
    >
      <Button
        title="Pictures"
        onPress={() => navigation.navigate("PicturesStack")}
      />
      <Button
        title="ChatGPT"
        onPress={() => navigation.navigate("ChatGPTStack")}
      />

      <Button
        title="Coming Soon..."
        onPress={() => navigation.navigate("ChatGPTStack")}
      />
    </View>
  );
}
function PicturesScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Pictures</Text>
    </View>
  );
}

function ChatGPTresponses() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>ChatGPTresponses</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
//////////////////////////////
// Button styling
function Button({ onPress, title }) {
  // const { onPress, title = 'Save' } = props;
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
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
  text: {
    aligalignItems: "center",
    fontSize: 50,
    lineHeight: 80,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
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

            if (route.name === "HomeScreen") {
              iconName = focused ? "ios-home" : "ios-home-outline";
            } else if (route.name === "ResponsesScreen") {
              iconName = focused ? "ios-albums" : "ios-albums-outline";
            } else if (route.name === "SettingsScreen") {
              iconName = focused ? "ios-settings" : "ios-settings-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="HomeScreen" component={HomeStackScreen} />
        <Tab.Screen name="ResponsesScreen" component={ResponsesStackScreen} />
        <Tab.Screen name="SettingsScreen" component={SettingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
