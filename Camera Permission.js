import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { openSettings, request, check, PERMISSIONS, RESULTS, checkMultiple, requestMultiple } from 'react-native-permissions';
import strings from '../constants/lang';

import { showError } from "./helperFunctions";


export const requestCameraPermission = async (type) => new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
        checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY]).then((statuses) => {
            console.log(statuses, "statuses");
            const cameraPermission = statuses[PERMISSIONS.IOS.CAMERA]
            const photoLibPermission = statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]

            if (type == 0) {
                if (cameraPermission == "blocked" || cameraPermission == "limited") {
                    Alert.alert(
                        "Permission Blocked",
                        "Please enable Camera permission from setting.",
                        [
                            {
                                text: "Open Setting",
                                onPress: () => openSettings().catch(() => showError("Can't open setting.")),
                            },
                            {
                                text: strings.cancel,
                            }
                        ],
                        { cancelable: true }
                    )
                } else if (cameraPermission == "denied") {
                    requestIOSCameraPermission()
                }
            } else {
                if (photoLibPermission == "blocked" || photoLibPermission == "limited") {
                    Alert.alert(
                        "Permission Blocked",
                        "Please enable Photo Liberary permission from setting.",
                        [
                            {
                                text: "Open Setting",
                                onPress: () => openSettings().catch(() => showError("Can't open setting.")),
                            },
                            {
                                text: strings.cancel,
                            }
                        ],
                        { cancelable: true }
                    )
                } else if (photoLibPermission == "denied") {
                    requestIOSCameraPermission()
                }
            }
            return resolve();
        }).catch((error) => {
            console.log(error, "PERMISSIONS.IOS ERror")
            return reject();
        })
    }
    else {
        return PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]).then((grantedResponse) => {

            const cameraPermission = grantedResponse['android.permission.CAMERA']
            const readExtStoragePermission = grantedResponse['android.permission.READ_EXTERNAL_STORAGE']
            const writeExtStoragePermission = grantedResponse['android.permission.WRITE_EXTERNAL_STORAGE']

            console.log(grantedResponse, "grantedResponse");

            if (cameraPermission == "never_ask_again" || readExtStoragePermission == "never_ask_again" || writeExtStoragePermission == "never_ask_again") {
                Alert.alert(
                    "Permission Blocked",
                    "Please enable Camera permission from setting.",
                    [
                        {
                            text: "Open Setting",
                            onPress: () => openSettings().catch(() => showError("Can't open setting.")),
                        },
                        {
                            text: strings.cancel,
                        }
                    ],
                    { cancelable: true }
                )
            } else if (cameraPermission == 'denied' || readExtStoragePermission == 'denied' || writeExtStoragePermission == 'denied') {
                requestAndroidCameraPermission()
            }
            return resolve();
        }).catch((error) => {
            console.log('Ask Camera permission error: ', error);
            return reject(error);
        })
    }
});


const requestIOSCameraPermission = async () => new Promise((resolve, reject) => {
    return requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY])
})

const requestAndroidCameraPermission = async () => new Promise((resolve, reject) => {
    return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ])
})

// export const requestCameraPermission = async () => new Promise((resolve, reject) => {
//     if (Platform.OS === 'ios') {
//         checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MEDIA_LIBRARY, PERMISSIONS.IOS.PHOTO_LIBRARY]).then((statuses) => {
//             console.log(statuses, "PERMISSIONS.IOS RES XX")

            // const photoLibPermission = statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]
            // const mediaLibPermission = statuses[PERMISSIONS.IOS.MEDIA_LIBRARY]
            // const cameraPermission = statuses[PERMISSIONS.IOS.CAMERA]


//             if (photoLibPermission == "blocked" || cameraPermission == "blocked") {
//                 Alert.alert(
//                     "Permission Blocked",
//                     "Please enable Camera and Photo Liberary permission from setting.",
//                     [
//                         {
//                             text: "Open Setting",
//                             onPress: () => openSettings().catch(() => showError("Can't open setting.")),
//                         },
//                         {
//                             text: strings.cancel,
//                             // onPress: () => showErrorAlert(strings.pleaseEnableYourLocation)
//                         }
//                     ],
//                     { cancelable: true }
//                 )
//             }

//         }).catch((error) => {
//             console.log(error, "PERMISSIONS.IOS ERror")
//         })
//         return resolve();
//     }

    // return PermissionsAndroid.requestMultiple([
    //     PermissionsAndroid.PERMISSIONS.CAMERA,
    //     PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    // ]).then((grantedResponse) => {
//         const granted = PermissionsAndroid.RESULTS.GRANTED;
//         if (
//             grantedResponse['android.permission.CAMERA'] !== granted ||
//             grantedResponse['android.permission.READ_EXTERNAL_STORAGE'] !== granted
//             || grantedResponse['android.permission.WRITE_EXTERNAL_STORAGE'] !== granted
//         ) {
//             console.log('You can\'t use the camera');
//             Alert.alert(
//                 "Permission to use camera and storage",
//                 "We need your permission to use your camera and storage to upload Ad images."
//             );
//             return reject('Camera permission denied');
//         }

//         return resolve();
//     }).catch((error) => {
//         console.log('Ask Camera permission error: ', error);
//         return reject(error);
//     });
// });
