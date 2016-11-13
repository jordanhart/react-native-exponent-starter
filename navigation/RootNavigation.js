import React from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  Alert,
} from 'react-native';
import {
  Notifications,
} from 'exponent';
import {
  StackNavigation,
  TabNavigation,
  TabNavigationItem,
} from '@exponent/ex-navigation';
import {
  FontAwesome,
} from '@exponent/vector-icons';
import LogInScreen from '../screens/LogInScreen';
import Alerts from '../constants/Alerts';
import Colors from '../constants/Colors';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

export default class RootNavigation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
    this.getLogin().then((json) => {
      Alert.alert('Did mount!',
        `Hi ${json}!`);
      this.state.login = json;
    }, function(error) {
      Alert.alert('Error!',
        `Hi ${error}!`);
    });
  }

  rerender(loginJSON) {
    this.setState({login: loginJSON});
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }
  async getLogin() {
  try {
     const value = await AsyncStorage.getItem('@EmployeeHelp:user');
     //if (value !== null){
    // We have data!!

    return value;
//  }

}
  catch (error) {
  // Error retrieving data
 }
}
  render() {
    if (this.state.login) {
    return (
      <TabNavigation
        tabBarHeight={56}
        initialTab="home">
        <TabNavigationItem
          id="home"
          renderIcon={isSelected => this._renderIcon('home', isSelected)}>
          <StackNavigation initialRoute="home" />
        </TabNavigationItem>

        <TabNavigationItem
          id="links"
          renderIcon={isSelected => this._renderIcon('book', isSelected)}>
          <StackNavigation initialRoute="links" />
        </TabNavigationItem>

        <TabNavigationItem
          id="settings"
          renderIcon={isSelected => this._renderIcon('cog', isSelected)}>
          <StackNavigation initialRoute="settings" />
        </TabNavigationItem>
      </TabNavigation>
    );
  }
  else {
        return (<LogInScreen rerender={this.rerender.bind(this)}/>);
   }
}

  _renderIcon(name, isSelected) {
    return (
      <FontAwesome
        name={name}
        size={32}
        color={isSelected ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({origin, data}) => {
    this.props.navigator.showLocalAlert(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`,
      Alerts.notice
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  selectedTab: {
    color: Colors.tabIconSelected,
  },
});
