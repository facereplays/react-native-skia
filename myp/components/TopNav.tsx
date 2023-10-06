import React from "react";
import {View, Text} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

const TopNav = ({props}) => {
  const navigation = useNavigation();
  const route = useRoute();
console.log(route);
  return  <View style={{width:'100%',flexDirection:'row'}}>
    <Text>{route.name}</Text>
    {route.params && route.params['story'] ?
      (<Text> - {route.params['story'].name}</Text>) :
      ''

    }
    {route.params && route.params['sujet'] ?
      (<Text> - {route.params['sujet'].name}</Text>) :
      ''

    }
  </View>;

}
export default TopNav;
