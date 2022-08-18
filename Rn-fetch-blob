import React from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Share from 'react-native-share';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import RNFetchBlob from 'rn-fetch-blob';

import { ANDROID_PACKAGE_NAME, APP_STORE_ID, DEEP_LINK_FIREBASE, DOWNLOAD_ARTICLE_BASE_URL, IOS_BUNDLE_ID, SHARE_ARTICLE_BASE_URL } from '../../config/urls';
import strings from '../../constants/lang';
import { showError, showSuccess } from '../../helper/helperFunctions';

export const ShareArticle = async (item, setIsLoading) => {
    setIsLoading((prevState) => ({ ...prevState, isLoading: true }))
    const getDynamicLink = await generateLink(item)

    const shareOptions = {
        title: strings.article,
        // failOnCancel: false,
        // url: SHARE_ARTICLE_BASE_URL + item?.id,
        url: getDynamicLink,
        title: item?.title,
    };

    try {
        const ShareResponse = await Share.open(shareOptions);
        setIsLoading((prevState) => ({ ...prevState, isLoading: false }))
        console.log(ShareResponse, "ShareResponse");
    } catch (error) {
        setIsLoading((prevState) => ({ ...prevState, isLoading: false }))
        console.log('Error =>', error);
    }
}

const generateLink = async (item) => {
    try {
        var link = await dynamicLinks().buildShortLink({
            link: `${SHARE_ARTICLE_BASE_URL}${item?.id}?type=ARTICLE_DETAIL`,
            domainUriPrefix: DEEP_LINK_FIREBASE,
            android: {
                packageName: ANDROID_PACKAGE_NAME,
                minimumVersion: '18'
            },
            ios: {
                appStoreId: APP_STORE_ID,
                bundleId: IOS_BUNDLE_ID,
                minimumVersion: '18'
            },
        },
            dynamicLinks.ShortLinkType.DEFAULT
        )
        return link
    } catch (error) {
        console.log("error raised", error)
    }
}

const _download_Article = async (itemData, setIsLoading) => {

    // console.log(setIsLoading + "-----" + itemData?.id);

    if (Platform.OS === 'ios') {
        _downloadFile(itemData, setIsLoading);
    } else {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: strings.storagePermissionRequired,
                    message: strings.applicationneedsaccesstoyourstoragetodownloadFile,
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Start downloading
                _downloadFile(itemData, setIsLoading);
                console.log('Storage Permission Granted.');
            } else {
                // If permission denied then show alert
                Alert.alert(strings.Error, strings.storagePermissionNotGranted);
            }
        } catch (err) {
            showError(strings.error)
        }
    }
}

const _downloadFile = (itemData, setIsLoading) => {

    setIsLoading((prevState) => ({ ...prevState, isLoading: true }))

    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = DOWNLOAD_ARTICLE_BASE_URL + itemData?.id
    // Function to get extention of the file url
    let file_ext = _getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download

    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.DownloadDir;

    const dirToSave = Platform.OS == 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir

    const configfb = {
        fileCache: true,
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: "Article",
        path: `${dirToSave}/${"article.pdf"}`,
    }

    const configOptions = Platform.select({
        ios: {
            fileCache: configfb.fileCache,
            title: configfb.title,
            path: configfb.path,
            appendExt: 'pdf',
        },
        android: configfb,
    });

    // let options = {
    //     fileCache: true,
    //     addAndroidDownloads: {
    //         path:
    //             RootDir +
    //             '/file_' +
    //             Math.floor(date.getTime() + date.getSeconds() / 2) +
    //             file_ext,
    //         description: 'downloading file...',
    //         notification: true,
    //         // useDownloadManager works with Android only
    //         useDownloadManager: true,
    //     },
    // };

    config(configOptions)
        .fetch('GET', FILE_URL)
        .then((res) => {
            showSuccess(strings.articleDownloadedSuccessfully);
            console.log('res', res);

            if (Platform.OS === "ios") {
                RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
                RNFetchBlob.ios.previewDocument(configfb.path);
            }
            // Alert after successful downloading
            setIsLoading((prevState) => ({ ...prevState, isLoading: false }))
        }).catch((error) => {
            console.log(error, "error");
            setIsLoading((prevState) => ({ ...prevState, isLoading: false }))
            showError(strings.errorindownloadinganarticle)
        })
};

const _getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
        /[^.]+$/.exec(fileUrl) : undefined;
};

export default _download_Article
