import React, { Component, useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    ImageBackground,
    RefreshControl,
    Keyboard,
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Linking,
    Platform,
    PermissionsAndroid,

} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { openSettings, request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';

//Redux
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import actions from '../../redux/actions';
import Loader from '../../components/Loader';

import Header from '../../components/Header';
import { ImagePath } from '../../constants/ImagePath';
import { colors } from '../../styles/colors';
import { moderateScale, textScale, width } from '../../styles/responsiveStyles';
import strings from '../../constants/LocalizedStrings'
import Button from '../../components/Button';
import commonStyles from '../../styles/commonStyles';
import { CommonTextInput } from '../../components/TextInput';
import CommonButton from '../../components/CommonButton';
import SimpleHeader from '../../components/SimpleHeader';
import HomeHeader from '../../components/HomeHeader';
import { showError, getCurrentLocation, staticLocation, checkLocationPermission } from '../../utils/helperFunctions';
import { locationPermission } from '../../utils/utils';
import HomeView from '../../components/HomeView';
import { setLocationCoords } from '../../redux/actions/homeActions';
import { NoDataFound } from "../../components/NoDataFound";

const HomeScreen = props => {
    const navigation = useNavigation();
    const userAccess = useSelector((state) => state.auth.userData.access_token);

    const [state, setState] = useState({
        searchText: "",
        isSearching: false,
        homeData: [],
        searchData: "",
        showMap: false,
        lat: '36.8859',
        lng: '43.0792',
        marker: [],
    })
    const [loader, setLoader] = useState(false)
    const [homeData, setHomeData] = useState([])
    const [marker, setMarker] = useState([])
    const [region, setRegion] = useState({
        latitude: 30.6668,
        longitude: 76.7863,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })
    const [currentLocationPermission, setCurrentLocationPermission] = useState(false)

    const mapRef = useRef(null)

    useEffect(() => {
        getLocation();
        // console.log(userAccess, "userData");
        setLoader(true)
        getHomeData("");
        // getAllProductsApi();
        getPriceApi();
        const callListener = navigation.addListener('focus', () => {
            getHomeData("");
            getPriceApi();
            // getAllProductsApi();
        });
        return callListener;
    }, [])

    // useEffect(() => {        
    //     const callListener = navigation.addListener('focus', () => {
    //         getHomeData("");
    //     });
    //     return callListener;
    // }, [homeData])

    const getHomeData = (searchText) => {
        let { homePage, getAllProducts, totalPrice } = props.actions
        // setLoader(true)
        homePage(searchText).then(res => {
            console.log(res, "home data")
            if (res.statusCode == 200) {
                setState({
                    ...state,
                    homeData: res.data,
                    isSearching: false
                })
                setHomeData(res.data)
                setLoader(false)
            }
        }).catch(error => {
            setLoader(false)
            showError(error.message)
        })
    }

    const getAllProductsApi = () => {
        let { getAllProducts } = props.actions
        getAllProducts().then(res => {
            if (res.statusCode == 200) {
                console.log(res, "getAllProductsApi")
                setMarker(res.data)
            }
            setState({ ...state, isSearching: false })
        }).catch(error => {
            setState({ ...state, isSearching: false })
            showError(error.message)
        })
    }

    const getPriceApi = () => {
        let { totalPrice } = props.actions
        totalPrice().then(res => {
        }).catch(error => {
            // showError(error.message)
        })
    }

    const getLocation = async () => {

        let granted = false;
        if (Platform.OS === 'android') {
            granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
        } else {
            granted = true;
        }

        if (granted) {
            locationPermission().then((permission) => {
                if (permission == 'granted') {
                    getCurrentLocation().then((curLoc) => {
                        const currentLatitude = curLoc.latitude;
                        const currentLongitude = curLoc.longitude;
                        let obj = {
                            latitude: currentLatitude,
                            longitude: currentLongitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }
                        setCurrentLocationPermission(true)
                        setLocationCoords(obj)
                        setRegion(obj)
                    });
                } else {
                    obj = staticLocation
                    setRegion(obj)
                    // getHomeData("");
                    setCurrentLocationPermission(false)
                }

            }).catch((err) => {
                console.log(err, "err Inside home get loc");
            });
        }
        getHomeData("");
    };

    const _addImage = (cat, item, index, dumyImage) => {
        if (JSON.stringify(item.products[index])) {
            let imagesArray = [];
            item.products.map((val, ind) => {
                imagesArray[ind] = JSON.parse(val.images)
            })
            return (imagesArray[index][0] || dumyImage)
        } else {
            return dumyImage
        }
    }

    const _onPressFirst = async (item) => {
        if (userAccess) {

            // props.navigation.navigate("homeProductList", {
            //     data: item,
            // })

            if (Platform.OS == "ios") {
                check(PERMISSIONS.IOS.LOCATION_ALWAYS || PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
                    .then((result) => {
                        switch (result) {
                            case RESULTS.UNAVAILABLE:
                                console.log('This feature is not available (on this device / in this context)');
                                break;
                            case RESULTS.DENIED:
                                console.log('The permission has not been requested / is denied but requestable');
                                request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
                                    console.log(result, '<==PERMISSIONS.IOS.LOCATION_ALWAYS');
                                    if (result == "granted") {
                                        props.navigation.navigate("homeProductList", {
                                            data: item,
                                        })
                                    }
                                });
                                break;
                            case RESULTS.LIMITED:
                                console.log('The permission is limited: some actions are possible');
                                break;
                            case RESULTS.GRANTED:
                                console.log('The permission is granted');
                                props.navigation.navigate("homeProductList", {
                                    data: item,
                                })
                                break;
                            case RESULTS.BLOCKED:
                                console.log('The permission is denied and not requestable anymore');
                                Alert.alert(
                                    "Please Enable Location",
                                    "",
                                    [
                                        {
                                            text: "Open Setting",
                                            onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
                                        },
                                        {
                                            text: "Cancel",
                                            onPress: () => console.log("")
                                        }
                                    ],
                                    { cancelable: true }
                                )
                                break;
                        }
                    })
            } else {
                const permissionAndroid = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                if (permissionAndroid == "never_ask_again") {
                    Alert.alert(
                        "Please Enable Location",
                        "",
                        [
                            {
                                text: "Open Setting",
                                onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
                            },
                            {
                                text: "Cancel",
                                onPress: () => showError("Please Enable your Location")
                            }
                        ],
                        { cancelable: true }
                    )
                } else if (permissionAndroid == "granted") {
                    let coords = await getCurrentLocation()
                    console.log(coords, "await getCurrentLocation()")
                    if (coords) {
                        props.navigation.navigate("homeProductList", {
                            data: item,
                        })
                    } else {
                        showError("Please Enable your Location")
                    }
                } else if (permissionAndroid == "denied") {
                    showError("Please Enable your Location")
                }
            }
        } else {
            pleaseLoginAlert();
        }
    }
    function pleaseLoginAlert() {
        Alert.alert(
            strings.pleaseLoginToContinue,
            "",
            [
                {
                    text: "Cancel",
                    // onPress: () => { console.log("Cancel Pressed") },
                    style: "cancel"
                },
                { text: "OK", onPress: () => props.navigation.popToTop() }
            ],
            { cancelable: false }
        );
    }

    const _renderHomeItems = ({ item, index }) => {
        let isEmpty = true
        let imagesArray = [];
        let priceArray = []
        if (JSON.stringify(item.products) != "[]") {
            isEmpty = false
            item.products.map((val, ind) => {
                imagesArray[ind] = JSON.parse(val.images)
                priceArray[ind] = val.price
            })
        }
        // console.log(item, "itemitemitemitemitemitem");
        return (
            <HomeView
                headingText={item.category}
                rightIcon={item.symbol_icon}

                firstImage={item.icon || "https://i.stack.imgur.com/y9DpT.jpg"}
                firstText={strings.SEE_MORE}
                onPressFirst={() => _onPressFirst(item)}

                // secondImage={!isEmpty ? (imagesArray[0][0] || "https://i.stack.imgur.com/y9DpT.jpg") : "https://i.stack.imgur.com/y9DpT.jpg"}
                secondImage={_addImage(item.category, item, 0, item.badgeOne)}

                secondText={!isEmpty ? (priceArray[0] ? "AED " + priceArray[0] : "NA") : "NA"}

                onPressSecond={() => {
                    if (userAccess) {
                        item.products.length >= 1 ? (props.navigation.navigate("bidNow", {
                            data: item.products[0],
                            category: item.category,
                        })) : alert(strings.noDataFound)
                    } else {
                        pleaseLoginAlert()
                    }
                }}

                // thirdImage={!isEmpty ? (imagesArray[0][1] || "https://i.stack.imgur.com/y9DpT.jpg") : "https://i.stack.imgur.com/y9DpT.jpg"}
                thirdImage={_addImage(item.category, item, 1, item.badgeTWo)}

                thirdText={!isEmpty ? (priceArray[1] ? "AED " + priceArray[1] : "NA") : "NA"}

                onPressThird={() => {
                    if (userAccess) {
                        item.products.length >= 2 ? (props.navigation.navigate("bidNow", {
                            data: item.products[1],
                            category: item.category,
                        })) : alert(strings.noDataFound)
                    } else {
                        pleaseLoginAlert()
                    }
                }}

                // fourthImage={!isEmpty ? (imagesArray[0][2] || "https://i.stack.imgur.com/y9DpT.jpg") : "https://i.stack.imgur.com/y9DpT.jpg"}

                fourthImage={_addImage(item.category, item, 2, item.badgeThree)}

                fourthText={!isEmpty ? (priceArray[2] ? "AED " + priceArray[2] : "NA") : "NA"}

                onPressFourth={() => {
                    if (userAccess) {
                        item.products.length >= 3 ? (props.navigation.navigate("bidNow", {
                            data: item.products[2],
                            category: item.category,
                        })) : alert(strings.noDataFound)
                    } else {
                        pleaseLoginAlert()
                    }
                }}
            />
        )
    }
    const _onRefresh = () => {
        setState({
            ...state,
            isSearching: true
        })
        getHomeData("");
        // getAllProductsApi();
    }

    const _changeText = (val) => {
        // Keyboard.dismiss();
        setState({
            ...state,
            isSearching: true
        })
        if (val == "") {
            getHomeData(val);
        } else {
            getHomeData(val)
        }
    }

    const _moveToCurrentLoc = () => {
        if (currentLocationPermission) {
            mapRef.current.animateToRegion(region);
        }
    };

    const _onPressHomeMap = async () => {
        if (userAccess) {
            // props.navigation.navigate("homeMapView")
            if (Platform.OS == "ios") {
                check(PERMISSIONS.IOS.LOCATION_ALWAYS || PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
                    .then((result) => {
                        switch (result) {
                            case RESULTS.UNAVAILABLE:
                                console.log('This feature is not available (on this device / in this context)');
                                break;
                            case RESULTS.DENIED:
                                console.log('The permission has not been requested / is denied but requestable');

                                request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
                                    console.log(result, '<==PERMISSIONS.IOS.LOCATION_ALWAYS');
                                    if (result == "granted") {
                                        props.navigation.navigate("homeMapView")
                                    }
                                });
                                break;
                            case RESULTS.LIMITED:
                                console.log('The permission is limited: some actions are possible');
                                break;
                            case RESULTS.GRANTED:
                                console.log('The permission is granted');
                                props.navigation.navigate("homeMapView")
                                break;
                            case RESULTS.BLOCKED:
                                console.log('The permission is denied and not requestable anymore');
                                Alert.alert(
                                    "Please Enable Location",
                                    "",
                                    [
                                        {
                                            text: "Open Setting",
                                            onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
                                        },
                                        {
                                            text: "Cancel",
                                            onPress: () => console.log("")
                                        }
                                    ],
                                    { cancelable: true }
                                )
                                break;
                        }
                    })
            } else {
                const permissionAndroid = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                if (permissionAndroid == "never_ask_again") {
                    Alert.alert(
                        "Please Enable Location",
                        "",
                        [
                            {
                                text: "Open Setting",
                                onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
                            },
                            {
                                text: "Cancel",
                                onPress: () => showError("Please Enable your Location")
                            }
                        ],
                        { cancelable: true }
                    )
                } else if (permissionAndroid == "granted") {
                    let coords = await getCurrentLocation()
                    console.log(coords, "await getCurrentLocation()")
                    if (coords) {
                        props.navigation.navigate("homeMapView")
                    } else {
                        showError("Please Enable your Location")
                    }
                } else if (permissionAndroid == "denied") {
                    showError("Please Enable your Location")
                }
            }
        } else {
            pleaseLoginAlert()
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: colors.COMMON_THEME_COLOR }}>
            <HomeHeader />
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : ""}
                style={{ flex: 1, backgroundColor: colors.WHITE, ...commonStyles.keyboardAvoidingViewStyle, }}>
                {
                    // (state.showMap && region) ?
                    // <View style={{ borderRadius: moderateScale(16), overflow: 'hidden' }}>
                    //     <MapView
                    //         // provider={PROVIDER_GOOGLE}
                    //         ref={mapRef}
                    //         style={{ ...styles.map, overflow: 'hidden' }}
                    //         initialRegion={region}
                    //         // followsUserLocation
                    //         showsUserLocation
                    //     >
                    //         {marker.map((markers, index) => (
                    //             <Marker
                    //                 draggable={false}
                    //                 coordinate={{
                    //                     latitude: parseFloat(markers.latitude) || parseFloat('45.2233'),
                    //                     longitude: parseFloat(markers.longitude) || parseFloat('76.2323'),
                    //                     latitudeDelta: 0.0922,
                    //                     longitudeDelta: 0.0421,
                    //                 }}
                    //                 onPress={() => {
                    //                     console.log(markers, "markersmarkersmarkers")

                    //                     props.navigation.navigate("bidNow", {
                    //                         data: markers,
                    //                         category: (markers && markers.category_name) ? markers.category_name : "d",
                    //                     })
                    //                     // (markers.product_detail &&
                    //                     //     markers.product_detail.pickUpLocation) ?
                    //                     //     openMap(markers.product_detail)
                    //                     //     :
                    //                     //     props.navigation.navigate("bidNow", {
                    //                     //         data: markers,
                    //                     //         category: state.category
                    //                     //     })
                    //                 }}
                    //             >
                    //                 <Image
                    //                     source={ImagePath.ic_sales_market_pin}
                    //                     style={{
                    //                         height: moderateScale(40),
                    //                         width: moderateScale(40)
                    //                     }}
                    //                 />
                    //             </Marker>
                    //         ))}
                    //     </MapView>
                    //     {currentLocationPermission && (
                    //         <View
                    //             style={{
                    //                 position: 'absolute',
                    //                 right: moderateScale(16),
                    //                 top: moderateScale(16),
                    //             }}>
                    //             <TouchableOpacity onPress={_moveToCurrentLoc}>
                    //                 <Image source={ImagePath.ic_current_location} style={{
                    //                     margin: moderateScale(12),
                    //                     backgroundColor: colors.WHITE,

                    //                 }} />
                    //             </TouchableOpacity>
                    //         </View>
                    //     )}
                    // </View>
                    // :
                    <View style={{ flex: 1 }}>
                        <CommonTextInput
                            mainView={{ ...commonStyles.margin_24_16 }}
                            placeholder={strings.SEARCH}
                            onChangeText={(val) => _changeText(val)}
                            rightIcon={ImagePath.ic_search_grey}
                            returnKeyType="go"
                        />

                        <FlatList
                            showsVerticalScrollIndicator={false}
                            // data={state.homeData}
                            data={homeData}
                            extraData={homeData}
                            renderItem={_renderHomeItems}
                            ListHeaderComponent={
                                state.isSearching ?
                                    <ActivityIndicator
                                        style={{ marginTop: moderateScale(16) }} />
                                    : <></>
                            }
                            refreshControl={
                                <RefreshControl
                                    refreshing={state.isSearching}
                                    onRefresh={_onRefresh}
                                    tintColor={"transparent"}
                                />
                            }
                            ListFooterComponent={
                                <View style={{
                                    marginVertical: moderateScale(48)
                                }} />
                            }
                        // ListEmptyComponent={<NoDataFound />}
                        />
                    </View>
                }

                <TouchableOpacity style={{ ...styles.floatButtonView }}
                    activeOpacity={0.7}
                    // onPress={() => setState({ ...state, showMap: !state.showMap })}
                    onPress={_onPressHomeMap}
                >
                    <Image source={(state.showMap && region) ? ImagePath.ic_list_view : ImagePath.btn_floating} />
                </TouchableOpacity>

            </KeyboardAvoidingView>
            <Loader isLoading={loader} />
        </View>
    )
}

let styles = new StyleSheet.create({

    floatButtonView: {
        position: "absolute",
        right: moderateScale(24),
        bottom: moderateScale(24)
    },
    map: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
        borderRadius: moderateScale(16),
        height: Dimensions.get('window').height,
    },

})

const mapStateToProps = state => {
    return {
        user: state.auth,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HomeScreen)
