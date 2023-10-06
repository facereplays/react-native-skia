import {
  Canvas,
  Path,
  SkPath,
  SkPoint,
  SkPaint,
  createPicture,
  Picture,
  SkPicture,
  Skia,
  TouchInfo,
  Group,
  useTouchHandler,
  Circle,
  SkContourMeasure,
  DisplacementMap,
  Turbulence,
  Drawing,
  SkColor,
  Morphology,
  SkRect, Rect,
  SkShader, Blend,
} from "@shopify/react-native-skia";
import getStroke from 'perfect-freehand';
import React, {useCallback, useEffect, useState,useMemo} from "react";
import {Pressable, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import getSvgPathFromStroke from "../utils/pathFromStroke";
import {Rectangle} from "paper";
import {Color, Colors, strokes, Brush} from "../types/Sujet";
import Toolbar from "../utils/ToolBar";
import Palette from "../utils/Palette";

class PathWithColorAndW  {
  path: SkPath =  Skia.Path.Make();
  color: Color;
  controlPath: SkPath = Skia.Path.Make();
  strokeWidth: number;
  drPoints:pathPoint[]=[];
  points: PointRecorded[]=[];
  pathPoints: SkPoint[]=[];
  status=0;
  rect: SkRect;
  pic: SkPicture;
brush: Brush;
  constructor(color,strokeWidth) {
    this.color = color;
    this.strokeWidth= strokeWidth;
  }
}

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
  tang:any;
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
const [paths, setPaths] = useState<PathWithColorAndW[]>([]);
   const [path, setPath] = useState<PathWithColorAndW>(null);
   const [color, setColor] = useState<Color>(Colors[0]);
   const [strokeWidth, setStrokeWidth] = useState(strokes[0]);
   const [path_S, setPath_S] = useState<SkPath>(null);
   const [showDialog,setShowDialog] = useState<boolean>(false);
   const [ani,setAni] = useState(0);
   const [brush,setBrush] = useState(null);

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
      const stat=0;
      const pa= new PathWithColorAndW(color,strokeWidth);

      setPaths((currentPaths) => {
        const { x, y } = touchInfo;

console.log('newpa',currentPaths.length);

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
sum <=0  ? stopAni() : requestAnimationFrame(animate);


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
const crePic = (pat_) =>{

  let xMin=10000;let yMin=10000;
  let xMax=-10000;let yMax=-10000;
  pat_.drPoints.map(po=>{
    xMin=Math.min(xMin,po.x);
    yMin=Math.min(yMin,po.y);
    xMax=Math.max(xMax,po.x);
    yMax=Math.max(yMax,po.y);
  })
const rect={ x: Math.max(xMin-80,0), y: Math.max(yMin-80,0), width: xMax-xMin+160, height: yMax -yMin+160 };

 return {rect: rect ,pic:createPicture(
    rect,
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
    })};

}
const makePic  = (pat_)=>{
 const source = crePic(pat_);
const pictur = source.pic;

  pat_.status=2;
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
           life = totL- Math.min(Math.max(s1.life, s.life), s.life + (s1.life - s.life) * delta);
         } else {
           life = totL - s.life;
           pressure = s.pressure;
         }

         currentPath.drPoints.push({x:xy[0].x, y:xy[0].y+life/10,pressure: pressure * 10 + life / 10,tang: xy[1]} as pathPoint);
        // currentPath.path.addCircle(xy[0].x, xy[0].y+life/10, pressure * 10 + life / 10);
         // pAr.push({xy:xy,sz:s.pressure*10});
       });
     }
       //this.contour = contour;
       // setPPoints(pAr);

     }


   }
   const pLine=(canvas,paint,p,path)=>{

     const cc= Skia.Color(0x22000000);
const ta=p.tang as SkPoint;
   const effect1 = Skia.Shader.MakeRadialGradient({x:p.x,y: p.y} as SkPoint,p.pressure*0.7,
     [cc,Skia.Color(0x11000000),Skia.Color(0x00000000)],[0,0.5,1],0)
   //  const paint = Skia.Paint();
      paint.setShader(effect1);

     //   paint.setColor(Skia.Color(path.color));
     canvas.drawCircle(p.x, p.y,  p.pressure*0.7,paint);
   Array(8).fill(1).map(
     o=>{
       const ran =(.5 - Math.random());
       const ran1 =(.5 - Math.random());
       const ta1 = ran *ta.x*p.pressure;
       const ta2 = ran1 *ta.y*p.pressure;

       canvas.drawCircle(p.x+ta2, p.y-ta1, 2, paint);
       //  canvas.drawCircle(p.x, p.y,5, paint);
    //  canvas.drawCircle(p.x-ta2, p.y+ta1, 2, paint);

   }
   );

    // canvas.drawCircle(p.x, p.y, p.pressure, paint);
   }
   const plPic_ = (path)=>{
     if(path.status!=2){
       const src = crePic(path);
       const rect = src.rect;
       const pic=src.pic.makeShader(3,3, 0);
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
       const source = Skia.RuntimeEffect.Make(`
uniform float  iTime;
uniform float2  offset;
uniform half3  color;
uniform shader iImage1;
    half4 main(float2 fragCoord) {
      half4 texColor = iImage1.eval(fragCoord-offset);

        return half4(color.rgb1*texColor.a);
      }
      `)
       // @ts-ignore
       const res =  source.makeShaderWithChildren([3,rect.x,rect.y,0.14,0.2,0.02],[pic]);
       path.rect=rect;
       const paint = Skia.Paint();
       paint.setBlendMode(3);
       paint.setShader(res);

       path.paint=res;
       const pict = createPicture(
         rect,
         (canvas) => {

           canvas.drawRect(rect,paint);

         }
       )
path.pic=pict;
       return  pict;

     }else{

       return  path.pic;
     }
     //canvas.drawPicture(pic);

   }
   const plPic = (canvas,paint,path)=>{
  if(path.status!=2){
     const src = crePic(path);
 const rect = src.rect;
  const pic=src.pic.makeShader(3,3, 0);
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
     const source = Skia.RuntimeEffect.Make(`
uniform float  iTime;
uniform float2  offset;
uniform half3  color;
uniform shader iImage1;
    half4 main(float2 fragCoord) {
      half4 texColor = iImage1.eval(fragCoord-offset);

        return half4(color,texColor.a);
      }
      `)
     // @ts-ignore
     const res =  source.makeShaderWithChildren([3,rect.x,rect.y,0.14,0.2,0.02],[pic]);
   paint.setShader(res);
canvas.drawRect(rect,paint);
path.rect=rect;
path.paint=res;
   }else{
//.log(path.rect);
    paint.setShader(path.paint);

    canvas.drawRect(path.rect,paint);
  }
  //canvas.drawPicture(pic);

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
      if (brush.name == 'pen1') {

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


  <Canvas style={style.container} onTouch={touchHandler}>
    <Rect x={0} y={0} width={width} height={height} color="white" />

    <Drawing
               drawing={({ canvas, paint }) => {
                 paths.filter(p=>p.status>=2).map(path=> {
                   path && path.pic ? canvas.drawPicture(path.pic) : null;
                 })
               }}
    />


    {/*

      pics.map((po, index) => (
        <Picture  key={index} picture={po.pic}/>

      ))

  */  }


    {paths.filter(p=>p.status<2).map((path, index) => (
      <Picture  key={index} picture={plPic_(path)}/>
     /* <Drawing   key={index}
        drawing={({ canvas, paint }) => {
plPic(canvas,paint,path);
}}
      />
      */
 ))}



  </Canvas>
      <Toolbar
        color={color}
        strokeWidth={strokeWidth}
        setColor={setColor}
        setStrokeWidth={setStrokeWidth}
        setPaths={setPaths}
        setPalette={setShowDialog}
      />
      {showDialog && (
      <View style={style.dialog}>
      <View style={{height:height,width:width,flex:1,alignItems:'center',justifyContent:'center'}}>
        <View style={{height:height/2,width:width*0.8,backgroundColor:'white',borderRadius:10}}>
          <Palette  setColor={setColor} setPalette={setShowDialog}/>
        </View>
      </View>
      </View>
        )}
  </View>
);
};



const style = StyleSheet.create({
  dialog:{position:"absolute",top:0,left:0,backgroundColor:'#99999999'},
  container: {
    flex: 1,
    width: "100%",

  },
  but:{padding:12},
  strokeOption: {
    fontSize: 18,
    backgroundColor: "#f7f7f7",
  },



});
 export default Draw;
