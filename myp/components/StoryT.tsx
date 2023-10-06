import React, {useEffect, useState} from "react";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  ImageBackground,
  Text,
  useWindowDimensions,
  View,
  Pressable
} from "react-native";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";



const StoryT = ({itemS}) => {
  const [isLoading, setLoading] = useState(true);
  const {height, width, scale, fontScale} = useWindowDimensions();
  const [su, setSu] = useState(null);

  const getMovies = async () => {
    try {
      const response = await fetch('https://buben-sha.herokuapp.com/api/records/sujet?include=name,id,thumb&filter=story,eq,' + itemS.id);
      const json = await response.json();
      console.log(json.records);
      setSu(json.records[0]);
      //console.log(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);
  return (

    <View style={{flex: 1, padding: 0, alignItems: 'center', justifyContent: 'center'}}>
      {isLoading ? (
  <ActivityIndicator size="large"/>

      ) : (
        <Pressable style={styles.pre} onPress={() =>
         console.log(itemS)
        }>
        <ImageBackground source={{uri: su.thumb}} resizeMode="contain" style={styles.image}>
          <Text>{itemS.name}</Text>
        </ImageBackground>
        </Pressable>

      )}
    </View>
  );
};
const styles = StyleSheet.create({

  pre: {height: '100%',width:'100%'},
  image: {opacity:.6,
height:'100%',width:'100%'
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
export default StoryT;
