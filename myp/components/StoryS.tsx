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


type Sujet = {
  id: number;
  name: string;
  thumb: string;
}
const StoryS = ({itemS, swe}) => {
  const [isLoading, setLoading] = useState(true);
  const {height, width, scale, fontScale} = useWindowDimensions();
  const [data, setData] = useState<Sujet[]>([]);


  const getMovies = async () => {
    try {
      const response = await fetch('https://buben-sha.herokuapp.com/api/records/sujet?include=name,id,thumb&filter=story,eq,' + itemS.id);
      const json = await response.json();
      setData(json.records);
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


        <FlatList style={{width: width,height:height}}
                  data={data.filter(m=>m.thumb)}
                  keyExtractor={({id}) => ('k' + id)}
                  renderItem={({item}) => (

                    <View style={{height:height}}>

                      <Pressable style={styles.pre} onPress={() =>
                        swe({name: item.name, id: item.id})
                      }>
                        <ImageBackground source={{uri: item.thumb}} resizeMode="contain" style={styles.image}>
                        </ImageBackground>

                      </Pressable>
                    </View>
                  )}
        />


      )}
    </View>
  );
};
const styles = StyleSheet.create({

  pre: {height: '100%'},
  image: {
    flex: 1,
    justifyContent: 'center',height:'100%'
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
export default StoryS;
