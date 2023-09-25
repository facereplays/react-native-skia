import React, {useEffect, useRef, useState} from 'react';
import Auth from "../utils/Auth";
import {
  Animated,
  Text,
  View,
  StyleSheet,
  Button,
  SafeAreaView, ActivityIndicator, Pressable,
} from 'react-native';
import StoryS from "./StoryS";
import {Sujet} from "../types/Sujet";
type Story = {
  id: number;
  name: string;
  sujet: Sujet[];
}
interface User {
  index: number;
  name: string;
  story: Story[];
}


const Profile = ({navigation}) => {
  const  userGet = async(f)=>{


      const res = await  fetch('https://buben-sha.herokuapp.com/api/records/users?exclude=password&join=story&&filter=email,eq,'+f.email, {

        headers: {
          Accept: 'application/json',
          "Content-Type": "application/json",
          Authorization: 'Bearer '+ f["access_token"]
        }

      });
      const  rres = await res.json();
   console.log(rres.records[0]);
setUser(rres.records[0]);

  }
  const [user, setUser] = useState<User>(null);

  const [token, setToken] = useState('');
  useEffect(() => {
Auth.login();
    Auth.check().then(f=> {
      setToken(f["access_token"]);
      userGet(f);
    });
  }, []);
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [totalLen, setTotalLen] = useState(0);
  fadeAnim.addListener(u=>{setTotalLen(u.value)});
  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1000,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  };
  const chF = () => {
    Animated.timing(fadeAnim, {
      toValue: 3000,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }
  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      {!user ? (
        <ActivityIndicator size="large" color="#0000ff"/>
      ) : (
       <>
        <View>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            // Bind opacity to animated value
            opacity: fadeAnim,
          },
        ]}>
        <Text style={styles.fadingText}>Fading View!</Text>
    </Animated.View>
      <View >
        <Text>{user.name}</Text>
        {user.story.map((st,i)=>

          (
            <Pressable style={{padding:8}} onPress={() => navigation.navigate('List',{story:st.id})} key={i}>
            <Text>{st.name}</Text>
          </Pressable>

          )



       )}
      </View>
        </View>
        </>
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fadingContainer: {
    padding: 20,
    backgroundColor: 'powderblue',
  },
  fadingText: {
    fontSize: 28,
  },
  buttonRow: {
    flexBasis: 100,
    justifyContent: 'space-evenly',
    marginVertical: 16,
  },
});

export default Profile;
