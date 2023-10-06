import React, {ReactNode, useState} from "react";
import {Pressable, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {Color, Colors, strokes, pen, pen1, brush, pencil, Brush, brushes} from "../types/Sujet";

import {MaterialCommunityIcons} from "@expo/vector-icons";

const Palette = ({setPalette,setColor})=>{
  const {height, width, scale, fontScale} = useWindowDimensions();
  const widthU = width>=360 ? 40 : 30;
  const brushes = [new Brush(pencil,'pencil'),new Brush(pen1,'pen'),new Brush(brush,'brush')];
  const swi = (it)=>{

  setColor(it);
  setPalette(false);
}

return <View style={{height:'100%',width:'100%',flex:1,alignItems:'center',justifyContent:'center'}}>
  <View   style={{margin:widthU,width:7*(widthU+5),justifyContent:'space-between',flexWrap:'wrap',flexDirection:'row'}}>
    {Colors.map((item, index) =>

      (

        <View key={index} style={{flexBasis:widthU+5,height:widthU+5}}>
          <Pressable style={{backgroundColor:item,padding:4,height:widthU,width:widthU,borderRadius:widthU/2}} onPress={(r)=>{swi(item)}}>

          </Pressable>
        </View>
      )

    )}
  </View>

  <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
    {strokes.map(a=>a+6).map((item, index) =>

      (

        <View key={index} style={{padding:4,height:item}}>
          <Pressable style={{backgroundColor:'black',padding:4,height:item,width:item,borderRadius:item/2}} onPress={(r)=>{swi(item)}}>

          </Pressable>
        </View>
      )

    )}
  </View>
  <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
    {brushes.map((item, index) =>
      (
        <View key={index} >
          {item.svg}

        </View>
      )
    )
    }
  </View>
  <View style={{position:'absolute',bottom:3,left:'50%',marginLeft:-16}}>
 <Pressable style={{padding:4, borderRadius:16,borderWidth: 1,borderColor: '#eee' }} onPress={()=>{setPalette(false)}}>
   <MaterialCommunityIcons name="close" size={18} color="black" />
 </Pressable>
  </View>
</View>


}
export default Palette;
