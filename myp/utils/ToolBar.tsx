import React, {useState} from "react";
import {Pressable, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {Color, Colors, strokes} from "../types/Sujet";
import {MaterialIcons} from "@expo/vector-icons";



type ToolbarProps = {
  color: Color;
  strokeWidth: number;
  setColor: (color: Color) => void;
  setPalette:(b:boolean)=>void;
  setPaths: (paths:[])  => void;
  setStrokeWidth: (strokeWidth: number) => void;
};



const Toolbar = ({
                   color,
                   strokeWidth,
                   setColor,
                   setStrokeWidth,
                   setPaths,
  setPalette
                 }: ToolbarProps) => {

  const [showStrokes, setShowStrokes] = useState(false);

  const handleStrokeWidthChange = (stroke: number) => {
    setStrokeWidth(stroke);
    setShowStrokes(false);
  };
  const handleDel = () => {
    setPaths([]);

  };
  const handlePal = () => {
    setPalette(true);

  };
  const handleChangeColor = (color: Color) => {
    setColor(color);
  };

  return (
    <>
      {showStrokes && (
        <View style={[style.toolbar, style.strokeToolbar]}>
          {strokes.map((stroke) => (
            <Pressable
              onPress={() => handleStrokeWidthChange(stroke)}
              key={stroke}
            >
              <Text style={style.strokeOption}>{stroke}</Text>
            </Pressable>
          ))}
        </View>
      )}
      <View style={[style.toolbar]}>
        <Pressable
          style={style.currentStroke}
          onPress={() => setShowStrokes(!showStrokes)}
        >
          <Text>{strokeWidth}</Text>
        </Pressable>
        <Pressable
          style={style.but}
          onPress={() => handleDel()}
        >
          <Text>del</Text>
        </Pressable>
        <Pressable
          style={style.but}
          onPress={() => handlePal()}
        >
          <MaterialIcons name="palette" size={18} color="black" />
        </Pressable>
        <View style={style.separator} />
        <ColorButton
          isSelected={false}

          color={color}
          onPress={() => handleChangeColor(color)}
        />
        {
          /*Colors.map((item) => (
          <ColorButton
            isSelected={item === color}
            key={item}
            color={item}
            onPress={() => handleChangeColor(item)}
          />
        ))*/
        }
      </View>
    </>
  );
};

type ColorButtonProps = {
  color: Color;
  isSelected: boolean;
  onPress: () => void;
};

const ColorButton = ({ color, onPress, isSelected }: ColorButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        style.colorButton,
        { backgroundColor: color },
        isSelected && {
          borderWidth: 2,
          borderColor: "black",
        },
      ]}
    />
  );
};
const style = StyleSheet.create({

  but:{padding:12},
  strokeOption: {
    fontSize: 18,
    backgroundColor: "#f7f7f7",
  },
  toolbar: {
    backgroundColor: "#ffffff",
    height: 50,
    width: 300,
    borderRadius: 100,
    borderColor: "#f0f0f0",
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  separator: {
    height: 30,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginHorizontal: 10,
  },
  currentStroke: {
    backgroundColor: "#f7f7f7",
    borderRadius: 5,
  },
  strokeToolbar: {
    position: "absolute",
    top: 70,
    justifyContent: "space-between",
    zIndex: 100,
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 100,
    marginHorizontal: 5,
  },
});
export default Toolbar;
