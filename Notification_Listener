import messaging from "@react-native-firebase/messaging";

import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import NavigationService from "../navigation/NavigationService";
// import PushNotification from "react-native-push-notification";
import { useRoute, useNavigationState } from '@react-navigation/native';
import store from "../redux/store";

import notifee, { EventType } from '@notifee/react-native';

const { dispatch, getState } = store


const isChatScreen = getState().room.isChatScreen

export const createNotificationListener = async (currentRoute) => {

  console.log(currentRoute, 'currentRoute')

  messaging().onNotificationOpenedApp(async (remoteMessage) => {

    console.log('Message in onNotificationOpenedApp =>', remoteMessage);

    setTimeout(() => {
      console.log(
        NavigationService,
        "hte +++++++++++++++++++++++++++++++++++++++++++"
      );
      remoteMessage.data?.type == "chat_message"
        ? NavigationService.navigate("AllChats")
        : remoteMessage.data?.type == "haulage_type"
          ? NavigationService.navigate("Haulage")
          : NavigationService.navigate("home");
    }, 3000);
    // alert()
  });

  // const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //   console.log("recived in foreground", remoteMessage);
  //   // console.log(currentRoute,'currentRoute')
  //   //  console.log('coming in noification',isChatScreen);
  //    showLocalPush(remoteMessage)
  //   //  if(isChatScreen){showLocalPush(remoteMessage)}
  // });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log("Message in getInitialNotification =>", remoteMessage);
      }
    });

  // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //   console.log("Message handled in the background!", remoteMessage);
  // });

  //  return unsubscribe

  messaging().onMessage(async remoteMessage => {
    console.log('Message in onMessage =>', remoteMessage);
    console.log(currentRoute, "asdasdasdasdds");
    if (currentRoute != "OneToOneChat") {
      onDisplayNotification(remoteMessage)
    }
  });

  notifee.onForegroundEvent(({ type, detail }) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        console.log('User pressed notification', detail, type);
        if (detail?.notification?.title == "New Message") {
          if (currentRoute != "AllChats") {
            NavigationService.navigate("AllChats")
          }
        }
        break;
    }
  });

};

async function onDisplayNotification(remoteMessage) {
  // Create a channel
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: remoteMessage?.notification?.title,
    body: remoteMessage?.notification?.body,
    android: {
      channelId,
      // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
    },
  });
}

const showLocalPush = (data) => {
  // PushNotification.localNotification({
  //   /* Android Only Properties */
  //   smallIcon: 'ic_launcher', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
  //   priority: 'high', // (optional) set notification priority, default: high
  //   visibility: 'public', // (optional) set notification visibility, default: private
  //   ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
  //   channelId: "channel-id-1",
  //   /* iOS only properties */

  //   /* iOS and Android properties */
  //   title: data.notification ? data.notification.title : data.data.title, // (optional)
  //   message: data.notification ? data.notification.body : data.data.body, // (required)
  // });
  // PushNotification.cancelLocalNotification({id:data.messageId})
};

export const createChannel = () => {
  // PushNotification.createChannel(
  //   {
  //     channelId: "channel-id-1", // (required)
  //     channelName: "My channel", // (required)
  //     channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
  //     playSound: true, // (optional) default: true
  //     soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
  //     importance: 4, // (optional) default: 4. Int value of the Android notification importance
  //     vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  //   },
  //   (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  // );

  // PushNotification.getChannels(function (channel_ids) {
  //   console.log('channels',channel_ids); // ['channel_id_1']
  // });

  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   console.log('Message handled in the background!', remoteMessage);
  // });

}

// messaging().onTokenRefresh(fcmToken => {
//     console.log("New token refresh: ", fcmToken)
// })
