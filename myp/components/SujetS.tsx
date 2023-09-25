import React, {useEffect, useMemo, useRef, useState} from "react";
import getStroke from 'perfect-freehand';
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  Text,
  View,
  Pressable,
  FlatList,
  Animated
} from "react-native";

import {
  Canvas,
  Path,Circle,
  Group,
  vec, SkiaValue,

} from "@shopify/react-native-skia";
import * as paper from "paper";
import {Sujet,Objet} from "../types/Sujet";
import getSvgPathFromStroke from "../utils/pathFromStroke";
import Auth from "../utils/Auth";
interface RingProps {
  index: number;
  progress: number;
  stroke: PathS;
  delta: number;
}
interface PathS {
  index: number;
  id:number;
  start: number;
  dots: [][];
  color: string;
  objet: number;
  len: number;
  pth: string;
  startS:number;
  rendered: boolean;
  delta: number;
}
interface ObjetS {
  id: number;
  transform: string;

}
const Ring = ({ index, progress, stroke, delta }: RingProps) => {
let pth;
if(progress>stroke.startS && stroke.dots && progress<=stroke.startS+stroke.len){
  const locProg = Math.max(0,Math.min(1,(progress - stroke.startS)/stroke.delta));
 // console.log('t',Math.ceil(locProg*stroke.dots.length));
const ln=stroke.dots.slice(0,Math.ceil(locProg*stroke.dots.length));
 pth = getSvgPathFromStroke((getStroke(ln,{size: 0.7 ,thinning:1, simulatePressure: false})));
}
  return progress>stroke.startS+stroke.len ?
     <Path color={stroke.color} path={stroke.pth}/>
     :
    progress>stroke.startS && stroke.dots && progress<=stroke.startS+stroke.len ?
      <Path color={stroke.color} path={pth}/>
      : '';
};

const SujetS = ({itemS,swe}) => {

  const [progress, setProgress] = useState(0);
const delta = 40;
const step=12;
const speed=6;
  const [isLoading, setLoading] = useState(true);
  const {height, width, scale, fontScale} = useWindowDimensions();
  const [sujetS, setSujetS] = useState<Sujet>(null);
  const [paths, setPaths] = useState<PathS[]>([]);
  const [objets, setObjets] = useState<ObjetS[]>([]);
  const [scaleS, setScaleS] = useState(null);
  const [totalLen, setTotalLen] = useState(0);
  const [sLen, setSLen] = useState(0);
  const [drawInt, setDrawInt] = useState(null);
  const stopProg = ()=> {
    clearInterval(drawInt);

  }

  const fadeAnim = useRef(new Animated.Value(0)).current;


  const fadeIn = (t) => {
    // Will change fadeAnim value to 1 in 5 seconds

    setProgress(0);
    console.log(t,4);
    Animated.timing(fadeAnim, {

      toValue: t/2,
      duration: t/2,
      useNativeDriver: true,
    }).start();
  };

  const startProg = (st, totalLen_)=>{
    console.log('ddd');
    fadeAnim.setValue(0);
    fadeIn(totalLen_);
    fadeAnim.addListener(u=>{setProgress(u.value*2)});
  }

  const getObjet = async (id,start,tot) => {
    try {
      const response = await fetch('https://buben-sha.herokuapp.com/api/records/strokes?order=start&page='+start+','+step+'&filter=objet,eq,' + id );
      const json = await response.json();

  json.records.map(s=>{

        const pp=s.dots ? JSON.parse(s.dots.replace(/}/g,']').replace(/{/g,'[')) : JSON.parse(s.line);
s.dots=pp;
    if(s.delta){
      s.len = s.delta;
      setSLen(current=>{
      s.startS=current;
return current + s.delta+40;
      })
    }else{
let len=0;
  pp.map((po,ix)=>{
          if(ix>0){
            const pre= pp[ix-1];
            const x= pre[0]-po[0];
            const y= pre[1]-po[1];
            len += Math.sqrt(x*x + y*y);
          }
        });


        s.len = s.delta = Math.ceil(len);
      setSLen(current=>{
        s.startS=current;
        return current + Math.ceil(len)+40;
      })
       //Auth.update('strokes',s.id,'{delta:'+s.len+'}');
  }


        s.pth = getSvgPathFromStroke((getStroke(pp,{size: 0.7 ,thinning:1, simulatePressure: false})));

      })
console.log(start,json.records.map(j=>j.id).join(','));
      setPaths(currentPaths=>currentPaths.concat(json.records));

if(start==1) {
startProg(0,tot);
}
      json.results > start*step ? await getObjet(id,start+1,tot) : null;
    }catch(er){



    }
  }
  const getSujet = async () => {
    try {
      const response = await fetch('https://buben-sha.herokuapp.com/api/records/sujet/' + itemS.id + '?join=objet&exclude=code');
      const json = await response.json();
      const szAr = json.size.split(',');
     width<height && szAr[0]<szAr[1] ? setScaleS(width/szAr[0]) :
       width>height && szAr[0]>szAr[1] ? setScaleS(height/szAr[1]) :
         width>height && szAr[1]>szAr[0] ? setScaleS(height/szAr[1]) : setScaleS(0.6);
      setTotalLen(json.totaltime);
    setSujetS(json);


      setObjets(json.objet);
      json.objet.map(o=> {

       getObjet(o.id,1,json.totaltime);
      })

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
 /* {data.objet.map((d, i) => {return }
  )};
  *
    useEffect(() => {
    r.value = withRepeat(withTiming(size * 0.33, { duration: 1000 }), -1);
  }, []);
  */
  useEffect(() => {
console.log(sujetS);
    //fadeAnim.stopAnimation();
  totalLen === 0 ?  getSujet() : startProg(0,totalLen);

  }, []);

  return (
    <View >
      {isLoading ? (
 <ActivityIndicator size="small" color="#0000ff"/>
  ) : (
        <View>

          {/*<View style={{ padding: 0, alignItems: 'center', justifyContent: 'center',flexDirection:'row'}}>

<Text>{totalLen}</Text><Text> | {progress}</Text>
          <Pressable style={{padding:8,backgroundColor:'#eeeeee'}} onPress={()=>startProg(0,totalLen)} >
           <Text>restart1</Text>

          </Pressable>
            <Pressable onPress={()=>swe()} >
              <Text>stop</Text>
            </Pressable>
          </View>*/}
   <View>
            <Animated.View
              style={[
                styles.fadingContainer,
                {
                  // Bind opacity to animated value
                  opacity: fadeAnim,
                },
              ]}>

            </Animated.View>
            <Canvas style={{ height: height-30, width: width}}>

                <Group transform={[{ scale: scaleS ? scaleS : 1 }]}>

                  {objets ? objets.map((pr,i)=> (
                    <Group key={i}>
   {

                        paths.filter(p=>(p.objet  === pr.id )).map((pp,ii)=>(

                            <Ring key={ii} index={ii} stroke={pp} delta={delta} progress={progress} />

                          )

                        )}
                    </Group>
                  )) : null}
                </Group>




            </Canvas>

          </View>


          {/*
          <View >
          {objets ? objets.map((pr,i)=>(
            <View key={i} style={{flexDirection:'row',flexWrap:'wrap'}}>
              {  paths.filter(p => (p.objet === pr.id && p.startS < progress)).map((pp, ii) => (

                <Text key={pp.id}>{pp.startS}, {totalLen}; </Text>

              ))
              }

            </View>

            )
            ) :
          ''
          }
          </View>
          */}
        </View>
)
}
</View>
)
  ;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fadingContainer:{height:20,backgroundColor:'blue'},
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});
export default SujetS;
