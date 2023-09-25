import React, {useEffect, useState} from "react";
import StoryS from "./StoryS";
import SujetS from "./SujetS";
import {ActivityIndicator, FlatList, Text, useWindowDimensions, View} from "react-native";

type Story = {
  id: number;
  name: string;
  sujet: Sujet[];
}
type Sujet = {
  id: number;
  name: string;

}
const List = ({navigation,route}) => {

  const [isLoading, setLoading] = useState(true);
  const {height, width, scale, fontScale} = useWindowDimensions();
  const [data, setData] = useState<Story[]>([]);
  const [storyS, setStory] = useState<Story>(null);
  const [sujetS, setSujet] = useState<Sujet>(null);
  const swi = (item) => {
    navigation.setOptions({title: item.name});
    setStory(item);

  }
 if(route.params && route.params.story) {
console.log(sujetS,storyS);
 }
  const swiSu = (item) => {
    navigation.setOptions({title: storyS.name + ' ' + item.name});
    setSujet(item);

  }
  const swiStory = () => {
   // navigation.setOptions({title:  storyS.name});
   // setSujet(item);
    setSujet(null);
  }
  const getMovies = async () => {
    try {
      const response = await fetch('https://buben-sha.herokuapp.com/api/records/story?filter=user,eq,11&include=name,id,user,sujet.name');
      const json = await response.json();
      setData(json.records);

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

    <View style={{flex: 1, padding: 0}}>
      {isLoading ? (
        <ActivityIndicator/>

      ) : (
        sujetS ?
          <SujetS itemS={sujetS}  swe={swiStory}/>
          :
          storyS ?
            <StoryS itemS={storyS} swe={swiSu}/>
            :
            <FlatList
              data={data}
              keyExtractor={({id}) => ('k' + id)}
              renderItem={({item}) => (
                <View>
                  <Text onPress={() =>
                    swi(item)
                  }>
                    {item.name}, {item.id}
                  </Text>
                </View>
              )}
            />

      )}
    </View>
  );
};
// @ts-ignore
export default List;
