import {
  Canvas,
  Path,
  SkPath,
  SkPoint, SkPaint,
  createPicture,
  Picture,
  SkPicture,
  Skia,
  TouchInfo, Group,
  useTouchHandler, Circle, SkContourMeasure, DisplacementMap, Turbulence, Drawing, SkColor, Morphology,
} from "@shopify/react-native-skia";
import getStroke from 'perfect-freehand';
import React, {useCallback, useEffect, useState,useMemo} from "react";
import {Pressable, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import getSvgPathFromStroke from "../utils/pathFromStroke";

type PathWithColorAndWidth = {
  path: SkPath;

  color: Color;
  strokeWidth: number;
drPoints:pathPoint[];
  points: PointRecorded[];
  pathPoints: SkPoint[];
  status:number;
  controlPath: SkPath;
};
type PointRecorded = {
  dist: number;
  life:number;
  x: number;
  y: number;
  pressure: number;
};
type pathPoint = {
  color:SkColor;
  color0:SkColor;
  x: number;
  y: number;
  pressure: number;
};
type Layer = {
  x: number;
  y: number;
  pic: SkPicture;
};
 const Draw = ({navigation}) => {
   const totL=1000;
   const {height, width, scale, fontScale} = useWindowDimensions();
   const [pics,setPics]=useState<Layer[]>([]);
   const [pPoints,setPPoints]=useState<{xy:SkPoint,sz:number}[]>([]);
   const [points,setPoints]=useState<PointRecorded[]>([]);
const [paths, setPaths] = useState<PathWithColorAndWidth[]>([]);
   const [path, setPath] = useState<PathWithColorAndWidth>(null);
  const [color, setColor] = useState<Color>(Colors[0]);
   const [path_S, setPath_S] = useState<SkPath>(null);
  const [strokeWidth, setStrokeWidth] = useState(strokes[0]);
   const [ani,setAni] = useState(0);
const brush = 'pen';
   const unsubscribe = navigation.addListener('tabPress', (e) => {
     // Prevent default action
      setPaths([]);
     navigation.navigate('Draw');

   });
  const  lerp=(x, y, a)=> {
     const r = (1 - a) * x + a * y
     return Math.abs(x - y) < 0.001 ? y : r
   }
  const quadLerp = (p0, p1, p2, t)=>{
     return lerp(lerp(p0, p1, t),
       lerp(p1, p2, t),
       t);
   }

  const onDrawingStart = useCallback(
    (touchInfo: TouchInfo) => {
      const newPath = Skia.Path.Make();
      const cPath = Skia.Path.Make();
      const pa= {
        path: newPath,
        color,
        strokeWidth,
       points:[],
        pathPoints:[],drPoints:[],
        controlPath: cPath
      } as PathWithColorAndWidth;

      setPaths((currentPaths) => {
        const { x, y } = touchInfo;

console.log('newpa',currentPaths.length);
pa.status=0;
        return [
          ...currentPaths,
         pa,
        ];
      });
    },
    [color, strokeWidth]
  );

const animate = time=>{
let sum=0;
setPaths(currentPaths=>{
  currentPaths.filter(u=>u.status==1).map((pat_,i)=>{

pat_.points.filter(t=>t.life>=0).map(t=>t.life=t.life-5);
const subSu = pat_.points.reduce((a:number,v)=> a+Number(v.life),0 );
if(subSu<=0) makePic(pat_); else {
pat_.path.reset();
sum+=subSu;
if(pat_.status==1) drawAquaPath(pat_,1);
  }

});
  const pat_=currentPaths.pop();

  return [
    ...currentPaths,
    pat_,
  ];
})
  //console.log(sum);
sum >0 ? requestAnimationFrame(animate) : stopAni();


 /**/

}
const stopAni=()=>{
  cancelAnimationFrame(ani);
  setAni(0);

}
   const onDrawingEnd = useCallback((touchInfo: TouchInfo) => {
let pat;let pat_;
let bounds;
     setPaths(current => {
       pat_ = current.pop();
pat_.status=1;
       return [
         ...current,
         pat_,
       ];

     });
     console.log('stat',pat_.status);
 ani!=0 ? null : setAni(requestAnimationFrame(animate))

  //   console.log(pat_.points.reduce((a:number,v)=> a+Number(v.life),0 ))

     /*
          if(pat_){
          setPath_S(current => {
          pat = pat_.path;



          }
     /*

     */
   },[]);
const makePic = (pat_)=>{

 let xMin=10000;let yMin=10000;
  let xMax=-10000;let yMax=-10000;
  pat_.drPoints.map(po=>{
    xMin=Math.min(xMin,po.x);
    yMin=Math.min(yMin,po.y);
    xMax=Math.max(xMax,po.x);
    yMax=Math.max(yMax,po.y);
  })


pat_.status=2;
   const pictur = createPicture(
     { x: xMin, y: yMin, width: xMax-xMin, height: yMax -yMin },
     (canvas) => {
       const paint = Skia.Paint();

       pat_.drPoints.map( p => {
        pLine(canvas,paint,p,pat_);
       }     )
     /*  paint.setColor(Skia.Color(pat_.color));
       //paint.setStrokeWidth(8);
       paint.setStyle(2);
       pat_.path ? canvas.drawPath(pat_.path, paint) : null;

      */
     });

   setPics(current => {
     const rr = current.concat([{x:0,y:0,pic:pictur}]);

     return rr;});




 }
   useEffect(() => {
console.log('ef');
     setPoints([]);setPics([]);setPaths([]);
   }, []);
const drawAquaPath=(currentPath,s)=>{

     const it = Skia.ContourMeasureIter(currentPath.controlPath, false, 1);
     const contour: SkContourMeasure = it.next()!;
     //
     if(contour)  {   const totalLength = contour.length();
    //   s==1 ?  console.log(totalLength) : null;
      //
       //currentPath.points[currentPath.points.length-1].dist=totalLength;
       //currentPath.controlPath.reset();
       /*
      */
       if(currentPath.points) {
         //console.log('f',totalLength,currentPath.points.length);
         currentPath.points.filter(t=>t.life>=0).map(t=>t.life=t.life-5);
currentPath.drPoints=[];
       Array(Math.floor(totalLength / 4)).fill(1).map((f, i) => {
         const s = currentPath.points[Math.floor((i * 4) / totalLength * currentPath.points.length)];
         const s1 = currentPath.points[Math.ceil((i * 4) / totalLength * currentPath.points.length)];
         const xy = contour.getPosTan(i * 4);
         const dist0 = s.dist ? s.dist : 0;
         const dist1 = s1 ? s1.dist : dist0;
         let life;
         let pressure;
         if (dist1 - dist0 > 0) {
           const delta = (i * 4 - dist0) / (dist1 - dist0);
           pressure = Math.min(Math.max(s1.pressure, s.pressure), s.pressure + (s1.pressure - s.pressure) * delta);
           life = Math.min(Math.max(s1.life, s.life), s.life + (s1.life - s.life) * delta);
         } else {
           life = s.life;
           pressure = s.pressure;
         }
         currentPath.drPoints.push({x:xy[0].x, y:xy[0].y+life/10,pressure: pressure * 10 + life / 10} as pathPoint);
        // currentPath.path.addCircle(xy[0].x, xy[0].y+life/10, pressure * 10 + life / 10);
         // pAr.push({xy:xy,sz:s.pressure*10});
       });
     }
       //this.contour = contour;
       // setPPoints(pAr);

     }


   }
   const pLine=(canvas,paint,p,path)=>{
     const prog1 = `
    // Inputs supplied by shaders.skia.org:
    uniform float3 iResolution;      // Viewport resolution (pixels)
    uniform float  iTime;            // Shader playback time (s)
    uniform float4 iMouse;           // Mouse drag pos=.xy Click pos=.zw (pixels)
    uniform float3 iImageResolution; // iImage1 resolution (pixels)
    uniform shader iImage1;          // An input image.
    half4 main(float2 fragCoord) {
      float2 pct = fragCoord/iResolution.xy;
      float d = distance(pct, iMouse.xy/iResolution.xy);
      return half4(half3(1, 0, 0)*(1-d)*(1-d), 1);
    }
    `;
     const cc= Skia.Color(0x22000000);

   const effect1 = Skia.Shader.MakeRadialGradient({x:p.x,y: p.y} as SkPoint,p.pressure,
     [cc,Skia.Color(0x11000000),Skia.Color(0x00000000)],[0,0.5,1],0)



paint.setShader(effect1);
     //  paint.setColor(Skia.Color(path.color));
     canvas.drawCircle(p.x, p.y, p.pressure, paint);
   }
  const onDrawingActive = useCallback((touchInfo: TouchInfo) => {


    setPaths((cpaths) => {
      const {x, y} = touchInfo;
      const currentPath = cpaths[cpaths.length - 1];
   //   console.log(currentPath);
      currentPath.points.push({
        x: touchInfo.x,
        y: touchInfo.y,
        pressure: touchInfo.force > 1 ? touchInfo.force / 10 : touchInfo.force,
        dist: 0,
        life: totL
      });
      const dd = getStroke(currentPath.points, {size: 8.7, thinning: 1, simulatePressure: false});
      const ddm = dd.map(t => Skia.Point(t[0], t[1]));
      currentPath.pathPoints = ddm;

      currentPath.path ? currentPath.path.reset() : null;
      if (brush == 'pen1') {

        currentPath.path.moveTo(currentPath.pathPoints[0].x, currentPath.pathPoints[0].y);
        currentPath.pathPoints.map((p, i) => {
          if (i > 0) {
            const lastP = currentPath.pathPoints[i - 1];
            const xMid = (lastP.x + p.x) / 2;
            const yMid = (lastP.y + p.y) / 2;
            currentPath.path.quadTo(lastP.x, lastP.y, xMid, yMid);
          }
        });
        currentPath.path.lineTo(currentPath.pathPoints[0].x, currentPath.pathPoints[0].y);
        currentPath.path.close();
      } else {

        currentPath.controlPath ? currentPath.controlPath.reset() : null;
        currentPath.controlPath.moveTo(currentPath.points[0].x, currentPath.points[0].y);
        currentPath.points.map((p, i) => {
          if (i > 0) {
            const lastP = currentPath.points[i - 1];
            const xMid = (lastP.x + p.x) / 2;
            const yMid = (lastP.y + p.y) / 2;


            /*  */
            currentPath.controlPath.quadTo(lastP.x, lastP.y, xMid, yMid);
          }
        });
        const pAr = [];
        if (!currentPath.controlPath.isEmpty()) {
          drawAquaPath(currentPath, 0);
        }


        /*
        const cPx2 = quadLerp(lastP.x, xMid, p.x, 0.5);
        const  cPy2 = quadLerp(lastP.y, yMid, p.y, 0.5);

        if(!points.find(r=>{r.x==cPx2 && r.y==cPy2})){
          setPoints(current=>{

            return current.concat([{x:cPx2,y:cPy2,pressure:0}]);
          });
        }
 */

      }
      setPath_S(currentPath.path);
      return cpaths;
    })

    }, []);




  const touchHandler = useTouchHandler(
    {
      onActive: onDrawingActive,
      onStart: onDrawingStart,
      onEnd:onDrawingEnd
    },
    [onDrawingActive, onDrawingStart, onDrawingEnd]
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
    <Group>
    {

      pics.map((po, index) => (
        <Picture  key={index} picture={po.pic}/>

      ))

    }

    {

     pPoints.filter(po=>po.xy.x).map((po, index) => (

        <Circle
          key={index}
     r={po.sz} cx={po.xy.x} cy={po.xy.y}
      color={'red'}
        />
))

   }
    {paths.filter(p=>p.status<2).map((path, index) => (

      /* <Path

        path={path.path} style="fill"
        color={path.color}
      />
      */
      <Drawing   key={index}
        drawing={({ canvas, paint }) => {
path.drPoints.map( p => {
       pLine(canvas,paint,p,path)
        }     )
        }}
      />


    ))}


  </Group>
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
