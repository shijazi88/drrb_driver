import {View, Text, Alert} from 'react-native';
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

import PushNotification from 'react-native-push-notification';
const ForeGroundNotification = () => {
  useEffect(() => {
    const unSubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      // console.log('() A new FCM message arrived!', JSON.stringify(remoteMessage));
      const {messageId, notification} = remoteMessage;
      console.log('remoteMessage', remoteMessage);

      PushNotification.localNotification({
        vibrate: true,
        playSound: true,
        title: "notification.title",
        channelId: 'your-channel-id',
        // id: messageId,
        message: "notification.body",
      });
    });
    return unSubscribe;
  }, []);
  return null;
};
export default ForeGroundNotification;
