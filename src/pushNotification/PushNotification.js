import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const requestUserPermission = async () => {
  console.log("Requesting ...")
  const authStatus = await messaging().requestPermission();
  const registered = await messaging().registerDeviceForRemoteMessages();
  const enabled =
    (authStatus === messaging.AuthorizationStatus.AUTHORIZED && registered) ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
};
const getFcmTokenFromLocalStorage = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('old', fcmToken);
  if (!fcmToken) {
    fcmToken = await messaging().getToken();
    if (fcmToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
  }
};
const getFcmToken = async () => {
  try {
    const newFcmToken = await messaging().getToken();
    return newFcmToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};
const notificationListener = () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    })
    .catch(error => console.log('failed', error));
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  messaging().onMessage(async remoteMessage => {
    // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });
};

export {
  getFcmToken,
  getFcmTokenFromLocalStorage,
  requestUserPermission,
  notificationListener,
};
