import {
  Canvas,
  Path,
  SkPath,
  SkPoint,
  Skia,
  TouchInfo,Group,
  useTouchHandler,
} from "@shopify/react-native-skia";
import getStroke from 'perfect-freehand';
import React, {useCallback, useEffect, useState} from "react";
import { Pressable, StyleSheet,Text,  View } from "react-native";
import getSvgPathFromStroke from "../utils/pathFromStroke";

type PathWithColorAndWidth = {
  path: SkPath;
  color: Color;
  strokeWidth: number;
  d:string;
  points: PointRecorded[];
  pathPoints: SkPoint[];
};
type PointRecorded = {
  x: number;
  y: number;
  pressure: number;
};
const Draw = ({navigation}) => {

  const [points,setPoints]=useState<PointRecorded[]>([]);
  const [paths, setPaths] = useState<PathWithColorAndWidth[]>([]);
  const [color, setColor] = useState<Color>(Colors[0]);

  const [strokeWidth, setStrokeWidth] = useState(strokes[0]);
  const [d,setD] = useState('M0,0 Z');
  const brush = 'pen';
  const unsubscribe = navigation.addListener('tabPress', (e) => {
    // Prevent default action
    setPaths([]);
    navigation.navigate('Draw');

  });



  const onDrawingStart = useCallback(
    (touchInfo: TouchInfo) => {

      setPaths((currentPaths) => {
        const { x, y } = touchInfo;
        const newPath = Skia.Path.Make();

        return [
          ...currentPaths,
          {
            path: newPath,
            color,
            strokeWidth,
            d,points:[{x:touchInfo.x,y:touchInfo.y,pressure:touchInfo.force>1?touchInfo.force/10 : touchInfo.force}],
            pathPoints:[]
          },
        ];
      });
    },
    [color, strokeWidth]
  );
  const onDrawingEnd = useCallback((touchInfo: TouchInfo) => {


  },[]);

  useEffect(() => {
    console.log('ef');

  }, []);

  const onDrawingActive = useCallback((touchInfo: TouchInfo) => {



    setPaths((currentPaths) => {
      const { x, y } = touchInfo;
      const currentPath = currentPaths[currentPaths.length - 1];

      currentPath.points.push({x:touchInfo.x,y:touchInfo.y,pressure:touchInfo.force>1?touchInfo.force/10 : touchInfo.force});
      const dd=getStroke( currentPath.points,{size: 8.7 ,thinning:1, simulatePressure: false});
      const ddm=dd.map(t=>Skia.Point(t[0],t[1]));
      currentPath.pathPoints=ddm;
//const segs=dd.map(t=>new paper.Segment(t));

      currentPath.path.reset();
      if(brush == 'pen1'){

        currentPath.path.moveTo(currentPath.pathPoints[0].x,currentPath.pathPoints[0].y);
        currentPath.pathPoints.map((p,i)=>{
          if(i>0){
            const lastP= currentPath.pathPoints[i-1] ;
            const xMid = (lastP.x + p.x) / 2;
            const yMid = (lastP.y + p.y) / 2;
            currentPath.path.quadTo(lastP.x, lastP.y, xMid, yMid);
          }
        });
        currentPath.path.lineTo(currentPath.pathPoints[0].x,currentPath.pathPoints[0].y);
        currentPath.path.close();
      }else{
        currentPath.path.moveTo(currentPath.points[0].x,currentPath.points[0].y);
        currentPath.points.map((p,i)=>{
          if(i>0){
            const lastP= currentPath.pathPoints[i-1] ;
            const xMid = (lastP.x + p.x) / 2;
            const yMid = (lastP.y + p.y) / 2;
            currentPath.path.quadTo(lastP.x, lastP.y, xMid, yMid);
          }
        });


      }
      return [...currentPaths.slice(0, currentPaths.length - 1), currentPath];
    });
  }, []);

  const touchHandler = useTouchHandler(
    {
      onActive: onDrawingActive,
      onStart: onDrawingStart,
      onEnd:onDrawingEnd
    },
    [onDrawingActive, onDrawingStart]
  );

  return (
    <View style={style.container}>
    <Toolbar
      color={color}
  strokeWidth={strokeWidth}
  setColor={setColor}
  setStrokeWidth={setStrokeWidth}
  setPaths={setPaths}
  />

  <Canvas style={style.container} onTouch={touchHandler}>
    {paths.map((path, index) => (

        <Path
          key={index}
      path={path.path} style="stroke" strokeWidth={4}
      color={path.color}
  />
))}
  </Canvas>
  </View>
);
};

const Colors = ["black", "red", "blue", "green", "yellow", "white"] as const;

type Color = (typeof Colors)[number];

type ToolbarProps = {
  color: Color;
  strokeWidth: number;
  setColor: (color: Color) => void;
  setPaths: (paths:[])  => void;
  setStrokeWidth: (strokeWidth: number) => void;
};

const strokes = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

const Toolbar = ({
                   color,
                   strokeWidth,
                   setColor,
                   setStrokeWidth,
                   setPaths
                 }: ToolbarProps) => {
  const [showStrokes, setShowStrokes] = useState(false);

  const handleStrokeWidthChange = (stroke: number) => {
    setStrokeWidth(stroke);
    setShowStrokes(false);
  };
  const handleDel = () => {
    setPaths([]);

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
  style={style.currentStroke}
  onPress={() => handleDel()}
>
  <Text>del</Text>
  </Pressable>
  <View style={style.separator} />
  {Colors.map((item) => (
    <ColorButton
      isSelected={item === color}
    key={item}
    color={item}
    onPress={() => handleChangeColor(item)}
    />
  ))}
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
  container: {
    flex: 1,
    width: "100%",
  },
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
export default Draw;
