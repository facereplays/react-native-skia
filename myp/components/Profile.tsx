import React, {useEffect, useRef, useState} from 'react';
import Carousel from 'react-native-reanimated-carousel';
import Auth from "../utils/Auth";
import {
  Animated,
  Text,
  View,
  StyleSheet,
  Button,
  SafeAreaView, ActivityIndicator, Pressable, useWindowDimensions,
} from 'react-native';
import StoryS from "./StoryS";
import {Sujet} from "../types/Sujet";
import StoryT from "./StoryT";
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
  const {height, width, scale, fontScale} = useWindowDimensions();
  const  userGet = async(f)=>{


      const res = await  fetch('https://buben-sha.herokuapp.com/api/records/users?exclude=password&join=story&filter=email,eq,'+f.email, {

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
      console.log(f);
      setToken(f["access_token"]);
      userGet(f);
    });
  }, []);
  // fadeAnim will be used as the value for opacity. Initial Value: 0




  return (
    <SafeAreaView style={styles.container}>
      {!user ? (
        <ActivityIndicator size="large" color="#0000ff"/>
      ) : (
        <View style={{ flex: 1 }}>
          <Carousel
            loop
            width={width}
            vertical={true}
            height={height}
            autoPlay={false}
            data={user.story}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => console.log('current index:', index)}
            renderItem={({ index }) =>

                (
              <View
                style={{
                  flex: 1,
                  borderWidth: 1,
                  justifyContent: 'center',
                }}
              >
                <StoryT  itemS={user.story[index]} />


              </View>)

            }

          />
        </View>
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
