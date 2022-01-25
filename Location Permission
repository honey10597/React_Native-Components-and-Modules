import React, { PureComponent } from 'react';
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    PermissionsAndroid,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';

import { openSettings, request, check, PERMISSIONS, RESULTS, checkMultiple, requestMultiple } from 'react-native-permissions';

import { getCustomerOnGoingBookings } from '../../store/actions';

import { fonts } from '../../../assets';
import { Loader } from '../../components/common';
import { colors, screenNames } from '../../utilities/constants';
import { OngoingOrder } from '../../components/New_Components/CustomerOrders';
import { navigate } from '../../utilities/NavigationService';
import { showErrorAlert } from '../../utilities/helperFunctions';
import { ListEmptyFlatlist } from '../../components/New_Components/ListEmptyFlatlist';
import commonStyles from '../../utilities/commonStyles';
import { strings } from '../../localization';
import { getCurrentLocation } from '../../utilities/helperFunctions/CommonFunctions';

class OngoingBookingsCustomer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            isLoading: false,
            allOngoingBookings: [],
            token: props.userDetails?.token || ""
        };
    }

    componentDidMount() {
        const { userDetails } = this.props;
        this.setState({ isLoading: true })
        if (userDetails?.token) {
            // this._navListener = navigation.addListener('didFocus', () => {
            this.getAllOngoingBookings()
            // })
        }
    }

    // componentWillUnmount() {
    //     if (this.props.userDetails?.token) {
    //         this._navListener.remove();
    //     }
    // }

    getAllOngoingBookings = () => {
        const { getCustomerOnGoingBookings } = this.props;
        const { token } = this.state;
        getCustomerOnGoingBookings({
            token,
            cb: (cb) => {
                this.setState({ isLoading: false, isRefreshing: false })
                if (cb?.data?.status == 200) {
                    let data = cb?.data?.data
                    let formattedArray = data.map((val) => {
                        if (typeof val.address_id == "string") {
                            val.address_id = JSON.parse(val.address_id)
                        }
                        if (val?.services?.main_service?.all_param) {
                            if (typeof val.services.main_service.all_param == "string") {
                                val.services.main_service.all_param = JSON.parse(val.services.main_service.all_param)
                            }
                        }
                        if (val?.services?.main_service?.name) {
                            if (typeof val.services.main_service.name == "string") {
                                val.services.main_service.name = JSON.parse(val.services.main_service.name)
                            }
                        }
                        if (val?.services?.name) {
                            if (typeof val.services.name == "string") {
                                val.services.name = JSON.parse(val?.services?.name)
                            }
                        }
                        if (val?.package?.package_services) {
                            val.package.package_services.map(item => {
                                if (typeof item.all_param == "string") {
                                    item.all_param = JSON.parse(item.all_param)
                                }
                                if (typeof item.name == "string") {
                                    item.name = JSON.parse(item.name)
                                }
                            })
                        }
                        return val
                    })
                    this.setState({ allOngoingBookings: formattedArray })
                } else {
                    showErrorAlert(cb?.data?.message || cb?.message || strings.Error)
                }
            }
        })
    }

    handleRefresh = () => {
        this.setState({ isRefreshing: false }, () => {
            this.getAllOngoingBookings()
        })
    }
    _trackOrderScreen = async (item) => {
        if (Platform.OS == "ios") {
            let locationAlways, locationWhenInUse;
            checkMultiple([PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]).then(async (statuses) => {
                locationAlways = statuses[PERMISSIONS.IOS.LOCATION_ALWAYS]
                locationWhenInUse = statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]
                if (locationAlways == "granted" || locationWhenInUse == "granted") {
                    let coords = await getCurrentLocation()
                    if (coords) {
                        navigate(screenNames.TrackServiceCustomer, { data: item })
                    } else {
                        showErrorAlert(strings.pleaseEnableYourLocation)
                    }
                } else if (locationAlways == "blocked" || locationWhenInUse == "blocked" || locationAlways == "limited" || locationWhenInUse == "limited" || locationAlways == "unavailable" || locationWhenInUse == "unavailable") {
                    Alert.alert(
                        strings.pleaseEnableYourLocationFromSettings,
                        "",
                        [
                            {
                                text: strings.openSettings,
                                onPress: () => openSettings().catch(() => showErrorAlert(strings.cantOpenSettings)),
                            },
                            {
                                text: strings.cancel,
                                onPress: () => showErrorAlert(strings.pleaseEnableYourLocation)
                            }
                        ],
                        { cancelable: true }
                    )
                } else if (locationAlways == "denied" || locationWhenInUse == "denied") {
                    requestMultiple([PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]).then(async (statuses) => {
                        locationAlways = statuses[PERMISSIONS.IOS.LOCATION_ALWAYS]
                        locationWhenInUse = statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]
                        if (locationAlways == "granted" || locationWhenInUse == "granted") {
                            let coords = await getCurrentLocation()
                            if (coords) {
                                navigate(screenNames.TrackServiceCustomer, { data: item })
                            } else {
                                showErrorAlert(strings.pleaseEnableYourLocation)
                            }
                        }
                    });
                } else {
                    showErrorAlert(strings.pleaseEnableYourLocationFromSettings)
                }
            });
        } else {
            const permissionAndroid = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (permissionAndroid == "never_ask_again") {
                Alert.alert(
                    strings.pleaseEnableYourLocationFromSettings,
                    "",
                    [
                        {
                            text: strings.openSettings,
                            onPress: () => openSettings().catch(() => showErrorAlert(strings.cantOpenSettings))
                        },
                        {
                            text: strings.cancel,
                            onPress: () => showErrorAlert(strings.pleaseEnableYourLocation)
                        }
                    ],
                    { cancelable: true }
                )
            } else if (permissionAndroid == "granted") {
                let coords = await getCurrentLocation()
                if (coords) {
                    navigate(screenNames.TrackServiceCustomer, { data: item })
                } else {
                    showError(strings.pleaseEnableYourLocation)
                }
            } else if (permissionAndroid == "denied") {
                showError(strings.pleaseEnableYourLocation)
            } else {
                showError(strings.pleaseEnableYourLocationFromSettings)
            }
        }
    }

    render() {
        const { isRefreshing, allOngoingBookings, isLoading } = this.state;
        return (
            <View style={{ flex: 1, }}>
                <View style={{ flex: 0.93 }}>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        data={allOngoingBookings}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>
                            <OngoingOrder
                                mainViewStyle={{ marginHorizontal: moderateScale(16) }}
                                itemData={item}
                                indexData={index}
                                onPressButton={() => this._trackOrderScreen(item)}
                            />
                        }
                        ListFooterComponent={<View style={commonStyles.listFooterStyle} />}
                        ListEmptyComponent={
                            <ListEmptyFlatlist
                                isLoading={isLoading}
                                emptyInfo={strings.noOrdersAvailable}
                            />
                        }
                    />
                </View>

                {/* Footer */}
                <Text
                    style={{
                        fontSize: moderateScale(14),
                        fontFamily: fonts.regular,
                        color: colors.black1,
                        flex: 0.07,
                        alignSelf: "center",
                        marginVertical: moderateScale(4)
                    }}>{strings.ifYouWantCancelBookingConfirmationContact + " "}<Text
                        style={{ color: colors.blue1 }}
                        onPress={() => this.props.navigation.navigate('SupportType')}>{strings.saslrasCustomerCare}</Text>
                </Text>
                <Loader isLoading={isLoading} isAbsolute />
            </View>
        );
    }
}

const mapStateToProps = ({ auth, app }) => ({
    userDetails: auth.userDetails,
});

export default connect(
    mapStateToProps,
    {
        getCustomerOnGoingBookings
    },
)(OngoingBookingsCustomer);
