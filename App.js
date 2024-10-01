import React, { Component, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from "react-native";
LogBox.ignoreLogs(["EventEmitter.removeListener"]);
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainStackScreen from './src/routes/mainStack';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
LogBox.ignoreLogs(['In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.']);

// import ForeGroundNotification from './src/pushNotification/ForeGroundNotification';

import {
  getFcmToken,
  getFcmTokenFromLocalStorage,
  notificationListener,
  requestUserPermission,
} from './src/pushNotification/PushNotification';

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

// PushNotification.configure({
//   onRegister: function (token) {
//     console.log("Token: -----", token)
//   },
//   onNotification: function (notification) {
//     console.log("Notification: -----", notification)
//     if(Platform.OS == 'android')
//       PushNotification.localNotification({
//         message: notification.message,
//         title: notification.title,
//       })
//   }
//   ,
//   // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
//   onAction: function (notification) {
//     // console.log("ACTION:", notification.action);
//     // console.log("NOTIFICATION:", notification);
//     // process the action
//   },
//   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
//   onRegistrationError: function (err) {
//     console.error(err.message, err);
//   },
//   permissions: {
//     alert: true,
//     badge: true,
//     sound: true
//   },
//   popInitialNotification: true,
//   requestPermissions: true
// })

// 



// class App extends Component {
function App() {

  useEffect(() => {
    getFcmToken();
    getFcmTokenFromLocalStorage();
    requestUserPermission();
    notificationListener();
  }, []);

  useEffect(() => {
    checkApplicationPermission()
  })

  // hasPushPermission = async () => {
  //   return await messaging().hasPermission();
  // };

  // async componentDidMount() {
  //   this.checkPermission();
  // }

  // async getToken() {
  //   let fcmToken = await AsyncStorage.getItem('fcmToken');
  //   console.log("saved_fcmToken", fcmToken)
  //   if (!fcmToken) {
  //       fcmToken = await messaging().getToken();
  //       console.log("fcmToken", fcmToken)
  //       if (fcmToken) {
  //           await AsyncStorage.setItem('fcmToken', fcmToken);
  //       }
  //   }
  //   //Update FCBTOKEN here

  // }

  // async requestPermission() {
  //   console.log("enabled 33")
  //   try {
  //      const authStatus = await messaging().requestPermission();
  //      const enabled =
  //        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //      if (enabled) {
  //       console.log('Authorization status:', authStatus);
  //        // User has authorised
  //        this.getToken();
  //      }
  //    } catch (error) {
  //        // User has rejected permissions
  //       console.log ('permission rejected');
  //    }
  //  }

  //  async checkPermission() {  
  //   const enabled = await messaging().hasPermission();

  //   console.log("enabled",enabled)

  //   if (enabled) {
  //       this.getToken();
  //   } else {
  //     console.log("enabled 22",enabled)
  //       this.requestPermission();
  //   }
  // }
  // render() {

  const requestUserPermissionFromUser = async () => {
    console.log("Requesting ...")
    const authStatus = await messaging().requestPermission();
    const registered = await messaging().registerDeviceForRemoteMessages();
    const enabled =
      (authStatus === messaging.AuthorizationStatus.AUTHORIZED && registered) ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  };

  const requestPermission = async () => {
    try {
      const isGranted = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);


      if (isGranted) return true;
      console.log("isGranted", isGranted)

      const granted = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          'title': 'DRRB App Access Push Notification Permission',
          'message': 'DRRB App needs to access your Push Notification permission to send you messages'
        });

      return granted === PermissionsAndroid.RESULTS.GRANTED
    }
    catch (err) {
      return false
    }
  }


  const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
        );
      } catch (error) {
      }
    }
  };

  return (

    <NavigationContainer>
      {/* <ForeGroundNotification /> */}
      <MainStackScreen />


    </NavigationContainer>
  );
  // }
}
export default App

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    flexDirection: 'column',
  },
  errorContainer: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    paddingBottom: 30,
    justifyContent: 'center',
  },
  rootContainer: { justifyContent: 'flex-start', padding: 10 },
  img: { height: 120, width: 120 },
  textContainer: {
    alignItems: 'center',
  },
  title: { marginBottom: 10, fontSize: 20, fontWeight: 'bold' },
  errorHead: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 50,
    textAlign: 'center',
  },
});