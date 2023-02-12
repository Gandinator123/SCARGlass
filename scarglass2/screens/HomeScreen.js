import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import ColorPicker from "react-native-wheel-color-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

let BASE_URL = "http://54.234.70.84:8000/";

const HomeScreen = () => {
  const [id, setId] = useState(null);
  useEffect(() => {
    const setScreen = async () => {
      let screen = await AsyncStorage.getItem("screen_id");
      setId(screen);
    };
    setScreen();
  }, []);
  const [loaded, setLoaded] = useState(false);

  const [homePageData, setHomePageData] = useState(null);
  useEffect(() => {
    if (id) {
      axios
        .get(BASE_URL + "screens/" + id + "/")
        .then((response) => {
          setHomePageData(response.data);
          setLoaded(true);
          // console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          setLoaded(true);
        });
    }
  }, [id]);

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
  ]);
  const [dayFormatOpen, setDayFormatOpen] = useState(false);
  const [dayFormatValue, setDayFormatValue] = useState(0);
  const [dayFormatItems, setDayFormatItems] = useState([
    { label: "Full (e.g. Wednesday)", value: 0 },
    { label: "Short (e.g. Wed)", value: 1 },
    { label: "None", value: 2 },
  ]);

  const [backgroundRed, setBackgroundRed] = useState(0);
  const [backgroundGreen, setBackgroundGreen] = useState(0);
  const [backgroundBlue, setBackgroundBlue] = useState(0);

  const [fontRed, setFontRed] = useState(0);
  const [fontGreen, setFontGreen] = useState(0);
  const [fontBlue, setFontBlue] = useState(0);

  const updateScreen = () => {
    axios
      .put(BASE_URL + "screens/" + id + "/update/", {
        date_format: dateFormatValue,
        time_format: timeFormatValue,
        day_format: dayFormatValue,
        background_red: backgroundRed,
        background_green: backgroundGreen,
        background_blue: backgroundBlue,
        font_red: fontRed,
        font_green: fontGreen,
        font_blue: fontBlue,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (homePageData) {
      setTimeFormatValue(homePageData["time_format"]);
      setDateFormatValue(homePageData["date_format"]);
      setDayFormatValue(homePageData["day_format"]);
      setBackgroundRed(homePageData["background_red"]);
      setBackgroundGreen(homePageData["background_green"]);
      setBackgroundBlue(homePageData["background_blue"]);
      setFontRed(homePageData["font_red"]);
      setFontGreen(homePageData["font_green"]);
      setFontBlue(homePageData["font_blue"]);
    }
  }, [homePageData]);

  useEffect(() => {
    if (loaded) {
      updateScreen();
    }
  }, [
    timeFormatValue,
    dateFormatValue,
    dayFormatValue,
    backgroundRed,
    backgroundBlue,
    backgroundGreen,
    fontRed,
    fontBlue,
    fontGreen,
  ]);

  let date = new Date();

  let days = [
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  ];
  let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minute =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let second =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  let ampm = date.getHours() > 12 ? "PM" : "AM";
  let dayText = dayFormatValue < 2 ? days[dayFormatValue][date.getDay()] : null;
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let month =
    date.getMonth() < 10
      ? "0" + parseInt(date.getMonth() + 1)
      : parseInt(date.getMonth() + 1);
  let year = date.getFullYear();

  let timeText =
    timeFormatValue === 0 ? hour + ":" + minute + ":" + second : null;
  let dateText =
    dayText +
    "\n" +
    (dateFormatValue === 0 ? day + "/" + month + "/" + year : null);

  let SCREEN_WIDTH = 161;
  let SCREEN_HEIGHT = 84;

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text>Time format:</Text>
      <DropDownPicker
        zIndex={3000}
        open={timeFormatOpen}
        value={timeFormatValue}
        items={timeFormatItems}
        setOpen={setTimeFormatOpen}
        setValue={setTimeFormatValue}
        setItems={setTimeFormatItems}
      />
      <Text>Date format:</Text>
      <DropDownPicker
        zIndex={2000}
        open={dateFormatOpen}
        value={dateFormatValue}
        items={dateFormatItems}
        setOpen={setDateFormatOpen}
        setValue={setDateFormatValue}
        setItems={setDateFormatItems}
      />
      <Text>Day format:</Text>
      <DropDownPicker
        zIndex={1000}
        open={dayFormatOpen}
        value={dayFormatValue}
        items={dayFormatItems}
        setOpen={setDayFormatOpen}
        setValue={setDayFormatValue}
        setItems={setDayFormatItems}
        s
      />
      <View style={{ height: 300, margin: 20, flexDirection: "row" }}>
        <View>
          <Text>Background color:</Text>
          <ColorPicker
            color={
              "#" +
              (
                (1 << 24) |
                (backgroundRed << 16) |
                (backgroundGreen << 8) |
                (backgroundBlue & 255)
              )
                .toString(16)
                .slice(1)
            }
            onColorChangeComplete={(c) => {
              console.log("c: ", c);
              c = c.substring(1).split("");
              c = "0x" + c.join("");
              setBackgroundRed((c >> 16) & 255);
              setBackgroundGreen((c >> 8) & 255);
              setBackgroundBlue(c & 255);
            }}
            thumbSize={30}
            sliderSize={30}
            noSnap={true}
            row={false}
            swatches={false}
          />
        </View>
        <View>
          <Text>Font color:</Text>
          <ColorPicker
            color={
              "#" +
              (
                (1 << 24) |
                (fontRed << 16) |
                (fontGreen << 8) |
                (fontBlue & 255)
              )
                .toString(16)
                .slice(1)
            }
            onColorChangeComplete={(c) => {
              console.log("c: ", c);
              c = c.substring(1).split("");
              c = "0x" + c.join("");
              setFontRed((c >> 16) & 255);
              setFontGreen((c >> 8) & 255);
              setFontBlue(c & 255);
            }}
            thumbSize={30}
            sliderSize={30}
            noSnap={true}
            row={false}
            swatches={false}
          />
        </View>
      </View>
      <Text>Preview:</Text>
      <View
        style={{
          borderColor: "black",
          borderWidth: 1,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          backgroundColor:
            "#" +
            (
              (1 << 24) |
              (backgroundRed << 16) |
              (backgroundGreen << 8) |
              (backgroundBlue & 255)
            )
              .toString(16)
              .slice(1),
        }}
      >
        <Text
          style={{
            position: "absolute",
            left: 0,
            top: SCREEN_HEIGHT / 4,
            color:
              "#" +
              (
                (1 << 24) |
                (fontRed << 16) |
                (fontGreen << 8) |
                (fontBlue & 255)
              )
                .toString(16)
                .slice(1),
            fontSize: 16,
          }}
        >
          {timeText}
        </Text>
        <Text
          style={{
            left: 0,
            top: SCREEN_HEIGHT / 2,
            color:
              "#" +
              (
                (1 << 24) |
                (fontRed << 16) |
                (fontGreen << 8) |
                (fontBlue & 255)
              )
                .toString(16)
                .slice(1),
            fontSize: 12,
          }}
        >
          {dateText}
        </Text>
      </View>
    </View>
  );
};

export default HomeScreen;
