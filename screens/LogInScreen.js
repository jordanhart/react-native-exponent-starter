import React from 'react';
import Exponent from 'exponent';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  AsyncStorage
} from 'react-native';

import { MonoText } from '../components/StyledText';

export default class LogInScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    },
  }
  constructor(props) {
    super(props)
  }
  async logIn() {

    const { type, token } = await Exponent.Facebook.logInWithReadPermissionsAsync('719461758217610', {
      permissions: ['public_profile', 'email', 'user_friends'],
    });

    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,about,picture`);
      const responseJSON = JSON.stringify(await response.json());

      await AsyncStorage.setItem('@EmployeeHelp:user', responseJSON);
      Alert.alert('Logged in!',
                 `Hi ${this.props}!`);

       this.props.rerender(responseJSON);
      }
//       try {
//     const value = await AsyncStorage.getItem('@EmployeeHelp:user');
//         if (value !== null){
//     // We have data!!
//         Alert.alert('Logged in!',
//           `Hi ${value}!`);
//   }
// } catch (error) {
//   // Error retrieving data
// }
  }

  logMeIn() {
    this.logIn().then(user => {
      Alert.alert('props!',
        `Hi ${this.props}!`,
        `User: ${user}`);
      this.props.rerender(user);
    })
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.welcomeContainer}>
            <Image
              source={require('../assets/images/Peer-Tutoring-Logo.png')}
              style={styles.welcomeImage}
            />
          <TouchableOpacity onPress={this.logIn.bind(this)}>
              <Text style={{backgroundColor: 'blue', color: 'white', padding: 20}}>
                Sign in with Facebook
              </Text>
          </TouchableOpacity>
          </View>
    </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 15,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 80,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 200,
    //height: 34.5,
    marginTop: 3,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 23,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
