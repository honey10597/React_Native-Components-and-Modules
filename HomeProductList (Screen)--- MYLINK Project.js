import React, { Component, useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    // TouchableOpacity,
    SafeAreaView,
    Linking,
    StyleSheet,
    Keyboard,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ImageBackground,
    RefreshControl,
    Dimensions,
} from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { showLocation } from 'react-native-map-link'
import getDirections from 'react-native-google-maps-directions'
import { useNavigation } from "@react-navigation/native";

import { useRoute } from '@react-navigation/native';

//Redux
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import actions from '../../redux/actions';
import Loader from '../../components/Loader';

import { ImagePath } from '../../constants/ImagePath';
import { colors } from '../../styles/colors';
import { moderateScale, textScale, width } from '../../styles/responsiveStyles';
import strings from '../../constants/LocalizedStrings'
import Button from '../../components/Button';
import commonStyles from '../../styles/commonStyles';
import { CommonTextInput } from '../../components/TextInput';
import CommonButton from '../../components/CommonButton';
import SimpleHeader from '../../components/SimpleHeader';
import { NoDataFound } from '../../components/NoDataFound';
import { MorePopup } from '../../components/MorePopup';
import { CalenderPicker } from '../../components/CalenderPicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { showError, getCurrentLocation, showSuccess } from '../../utils/helperFunctions';
import { BottomUpSheet } from '../../components/BottomUpSheet';
import MemberImages from '../../components/MemberImages';
import { SwipeHeaderView } from '../../components/SwipeHeaderView';
import HomeHeader from '../../components/HomeHeader';
import { SimpleButton } from '../../components/SimpleButton';
import { locationPermission } from '../../utils/utils';
import MarkerAnimation from '../../components/AnimatedMarker';
import { cos } from 'react-native-reanimated';

const ProductView = ({
    title,
    profilePic,
    name,
    rating,

    price,
    onPress,
}) => {
    return (
        <TouchableOpacity style={{
            ...commonStyles.margin_16_24,

            ...commonStyles.shadow,
            padding: moderateScale(8),
            borderRadius: moderateScale(8)
        }}
            onPress={onPress}
            activeOpacity={0.7}
        >

            <Text style={{ ...commonStyles.fontSize_14_REGULAR, marginVertical: moderateScale(8) }}>{title}</Text>

            <View style={{
                ...commonStyles.flexBetween,
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <Image source={{ uri: profilePic }} style={{
                        height: moderateScale(40),
                        width: moderateScale(40),
                        borderRadius: moderateScale(20),
                        backgroundColor: colors.GREY_194_1,
                    }} />
                    <View style={{
                        paddingLeft: moderateScale(8),
                    }}>
                        <Text style={{
                            ...commonStyles.fontSize_16_BOLD
                        }}>{name}</Text>

                        <View style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <Image source={ImagePath.ic_rating_star_active} style={{ height: moderateScale(14), width: moderateScale(14) }} />
                            <Text style={{
                                marginLeft: 4,
                                ...commonStyles.fontSize_12_REGULAR
                            }}>{rating}</Text>

                        </View>
                    </View>
                </View>

                <Text style={{ ...commonStyles.fontSize_14_BOLD, color: colors.BLUE }}>AED {price}</Text>
            </View>
        </TouchableOpacity>
    )
}

const HomeProductList = props => {

    const route = useRoute();
    const refRBSheet = useRef();
    const navigation = useNavigation();

    const [state, setState] = useState({
        isLoading: false,
        products: route.params.data.products,
        category: route.params.data.category,
        categoryId: route.params.data.id,
        showMapView: true,
        marker: route.params.data.products,
        // userData: route.params.data.products.user,
        region: null,
        lat: '22.8859',
        lng: '43.0792',
        from_price: "",
        to_price: "",

        categories: undefined,
        applyFilterData: []
    })

    const [HandleFields, setHandleFields] = useState(undefined)
    const [FieldsDataTypes, setFieldsDataTypes] = useState({})
    const [dropDownHandle, setDropDownHandle] = useState([])
    const [textInputEditable, setTextInputEditable] = useState(true)

    useEffect(() => {
        // console.log(route.params.data, "use effect")
        getLocation();
        _calculateAngleFromCoordinate(27.5750724, 90.2107155, 13.3818737, 107.7740748)
    }, [])

    const getLocation = () => {
        // console.log("111111")
        locationPermission().then((permission) => {
            if (permission == 'granted') {
                console.log("22222")
                getCurrentLocation().then((curLoc) => {
                    console.log("22222 qqqqqqq")
                    const currentLatitude = curLoc.latitude;
                    const currentLongitude = curLoc.longitude;
                    setState({
                        ...state,
                        region: {
                            latitude: currentLatitude,
                            longitude: currentLongitude,
                            latitudeDelta: 1.0922,
                            longitudeDelta: 1.0421,
                        },
                        lat: currentLatitude,
                        lng: currentLongitude,
                    });
                })
            } else {
                // setState({ ...state, lat: 36.8859, lng: 72.0792, });
                setState({
                    ...state,
                    region: {
                        latitude: 30.6668,
                        longitude: 76.7863,
                        latitudeDelta: 1.0922,
                        longitudeDelta: 1.0421,
                    },
                    lat: 30.6668,
                    lng: 76.7863,
                })
            }
        });
    };

    const openMap = (item) => {
        debugger
        const data = {
            source: {
                latitude: item.pick_up.lat,
                longitude: item.pick_up.lng
            },
            destination: {
                latitude: item.drop_off.lat,
                longitude: item.drop_off.lng
            }
        }
        getDirections(data)
    }

    const _openFilter = () => {
        setState({
            ...state,
            categories: undefined,
        })
        setHandleFields(undefined)
        refRBSheet.current.open()
        _getSubCategories();
    }

    /** Get Sub Cat API **/
    const _getSubCategories = () => {
        setState({ ...state, isLoading: true })

        let { subCategory } = props.actions;

        let arr = []

        subCategory(state.categoryId).then(res => {
            console.log(res, "ghjg")
            if (res.statusCode == 200) {
                // console.log(res, "sss");
                if (!res.data.length) {
                    console.log("111111")
                    _getCatFields(0)
                } else {
                    console.log("22222")
                    setState({
                        ...state,
                        categories: res.data,
                        isLoading: false,
                    })
                }
            }
        }).catch(error => {
            showError(error.message)
            setState({ ...state, isLoading: false })
        })
    }

    const checkEmptyObject = (val) => {
        return Object.keys(val).length;
    }

    const _getCatFields = (id) => {
        setState({ ...state, isLoading: true })
        let arr = []
        let { getFields } = props.actions;
        let data = state.categoryId + "&sub_category_id=" + id;
        // let data = state.categoryId + "&sub_category_id=" + id + "&sub_subcategory_id=" + 0;
        getFields(data, 0).then(res => {
            console.log(res, "zxcvb")
            setHandleFields(res.data)
            if (res.statusCode == 200) {
                arr = res.data
                setState({ ...state, isLoading: false })
                setFieldsDataTypes({ ...FieldsDataTypes })
                setDropDownHandle(dropDownData)
                setHandleFields(res.data)

                // let dropDownFields = [{ ...dropDownHandle }];
                // let dropDownData = []
                // let isEmpty = checkEmptyObject(dropDownFields[0])
                // if (!isEmpty) {
                //     dropDownData = []
                // }
                // res.data.map((val, i) => {
                //     FieldsDataTypes[val.field_name] = ""
                //     if (val.field_datatype == "dropdown") {
                //         var obj = {};
                //         obj["dropdown" + val.field_name] = false;
                //         dropDownData.push(obj);
                //     }
                // })
            }
        }).catch(error => {
            setState({ ...state, isLoading: false })
        })
    }
    // applyFilterData
    const _updateField = (FieldArray, setFieldArray, fieldName, selectedValue, field_datatype) => {
        let allFields = FieldArray
        allFields[fieldName] = selectedValue
        setFieldArray({ ...allFields })
    }

    const _onChangeText = (val, field_name) => {
        _updateField(FieldsDataTypes, setFieldsDataTypes, field_name, val)
    }
    const _onSelectDate = (day, fieldName) => {
        _updateField(FieldsDataTypes, setFieldsDataTypes, fieldName, day.dateString)
        setState({
            ...state,
            showCalender: false,
            openModal: false
        })
        setTextInputEditable(true)
    }
    const _onSelectDateTime = (date, fieldName, format) => {
        let formatDate = moment(date).format(format)
        _updateField(FieldsDataTypes, setFieldsDataTypes, fieldName, formatDate)
        setState({
            ...state,
            openDateTimePicker: false,
            openTimePicker: false,
        })
        setTextInputEditable(true)
    }
    const closeModal = () => {
        setState({
            ...state,
            showCalender: false,
            openModal: false
        })
        setTextInputEditable(true)
    }

    const _convertObjectToKeyValueArray = () => {
        setFieldsDataTypes([])
        let arr = [FieldsDataTypes]
        let getKey = undefined
        let getValues = undefined
        arr.map((val, i) => {
            console.log(val, "popopoopop", i)
            getKey = Object.keys(val)
            getValues = Object.values(val)
        })
        let formattedArray = [];
        for (let i = 0; i < getKey.length; i++) {
            if (getValues[i] != Array) {
                let pushData = {
                    key: getKey[i],
                    value: getValues[i],
                }
                formattedArray.push(pushData)
            }
        }
        return formattedArray;
    }

    const _applyFilter = () => {
        refRBSheet.current.close()
        setState({ ...state, isLoading: true })
        let formattedArray = _convertObjectToKeyValueArray()
        console.log(formattedArray, "ghjg")
        applyFilterApi(formattedArray)
    }

    const applyFilterApi = (filterArray) => {
        let passData = {
            category_id: state.categoryId,
            sub_category_id: 0,
            filters: JSON.stringify(filterArray),
            from_price: state.from_price,
            to_price: state.to_price
        }

        let { applyFilter } = props.actions;
        applyFilter(passData).then(res => {
            if (res.statusCode == 200) {
                showSuccess(strings.filterApplied)
                setState({
                    ...state,
                    products: res.products,
                    marker: res.products,
                    isLoading: false,
                })
            }
            console.log(res, "filter res")
        }).catch(error => {
            showError(error.message)
            setState({
                ...state,
                isLoading: false
            })
            console.log(error, "error")
        })

    }


    const _renderFlatList = ({ item, index }) => {
        // let fieldName = {}
        // fieldName = item.field_name
        // let fieldDataType = item.field_datatype
        // let dropDownName = {}
        // if (item.field_datatype == "dropdown") {
        //     dropDownName = item.field_datatype + item.field_name;
        // }
        let fieldName = {}
        let fieldDataType = {}
        let dropDownName = {}
        let textFieldsData = item.data;
        let textFieldsDataSize = textFieldsData.length;
        let fieldLabel = item.label
        return (
            <View>
                {
                    index == 0 ?
                        <View style={{ ...commonStyles.margin_16_24 }}>
                            <Text style={{
                                // ...commonStyles.margin_24_24,
                                marginVertical: moderateScale(8),
                                ...commonStyles.fontSize_14_BOLD
                            }}>{strings.price}</Text>
                            <View style={{ ...commonStyles.flexBetween }}>
                                <CommonTextInput
                                    mainView={{
                                        width: "48%"
                                    }}
                                    placeholder={item.field_placeholder || "from"}
                                    onFocus={() => { }}
                                    onChangeText={(val) => setState({
                                        ...state,
                                        from_price: val
                                    })}
                                    returnKeyType="done"
                                    keyboardType="number-pad"
                                />
                                <CommonTextInput
                                    mainView={{
                                        width: "48%"
                                    }}
                                    placeholder={item.field_placeholder || "to"}
                                    onFocus={() => { }}
                                    onChangeText={(val) => setState({
                                        ...state,
                                        to_price: val
                                    })}
                                    returnKeyType="done"
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>
                        : <></>
                }

                <FlatList
                    data={textFieldsData}
                    renderItem={({ item, index }) =>
                        (index == 0 && (item.field_datatype == "integer" || item.field_datatype == "string" || item.field_datatype == "date" || item.field_datatype == "time")) ?
                            <Text style={{
                                ...commonStyles.margin_24_24,
                                marginTop: moderateScale(8),
                                ...commonStyles.fontSize_14_BOLD
                            }}>{fieldLabel}</Text> : <></>
                    }
                />


                {
                    textFieldsData.length > 1 ?
                        <>
                            <FlatList
                                data={textFieldsData}
                                numColumns={textFieldsData.length || 1}
                                key={textFieldsData.length}
                                contentContainerStyle={{

                                }}
                                columnWrapperStyle={{
                                    ...commonStyles.flexBetween,
                                    ...commonStyles.margin_8_24,
                                }}
                                renderItem={({ item }) =>
                                    <View>
                                        {
                                            item.field_datatype == "integer" ?

                                                <CommonTextInput
                                                    mainView={{
                                                        // ...commonStyles.margin_8_24,
                                                        width: width / textFieldsDataSize - 30
                                                    }}
                                                    placeholder={item.field_placeholder || ""}
                                                    onFocus={() => { }}
                                                    onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                    returnKeyType="done"
                                                    keyboardType="number-pad"
                                                />
                                                : <></>
                                        }
                                        {
                                            fieldName = item.field_name,
                                            fieldDataType = item.field_datatype,
                                            item.field_datatype == "date" ?
                                                <View style={{
                                                }}>
                                                    <CommonTextInput
                                                        blurOnSubmit={false}
                                                        rightIcon={ImagePath.ic_select_date}
                                                        mainView={{
                                                            // ...commonStyles.margin_8_24,
                                                            width: width / textFieldsDataSize - 30
                                                        }}
                                                        placeholder={item.field_placeholder || ""}
                                                        value={FieldsDataTypes[fieldName]}
                                                        onFocus={() => {
                                                            setState({
                                                                ...state,
                                                                openModal: true,
                                                                showCalender: true,
                                                                fieldName: item.field_name,
                                                            })
                                                            setTextInputEditable(false)
                                                        }
                                                        }
                                                        editable={textInputEditable}
                                                    />

                                                    {
                                                        <CalenderPicker
                                                            isVisible={state.openModal}
                                                            onBackButtonPress={() => closeModal()}
                                                            onBackdropPress={() => closeModal()}
                                                            current={state.date}
                                                            minDate={new Date()}
                                                            isShowCalender={state.showCalender}
                                                            onDayPress={(day) => _onSelectDate(day, state.fieldName, "LL")}
                                                            markedDates={{
                                                                [FieldsDataTypes[fieldName]]: { selected: true },
                                                            }}
                                                        />
                                                    }
                                                </View>
                                                : <></>
                                        }
                                        {
                                            fieldName = item.field_name,
                                            fieldDataType = item.field_datatype,
                                            item.field_datatype == "time" ?
                                                <View style={{
                                                }}>
                                                    <CommonTextInput
                                                        rightIcon={ImagePath.ic_select_time}
                                                        mainView={{
                                                            // ...commonStyles.margin_8_24,
                                                            width: width / textFieldsDataSize - 30
                                                        }}
                                                        placeholder={item.field_placeholder || ""}
                                                        onFocus={() => {
                                                            setState({
                                                                ...state,
                                                                openTimePicker: true,
                                                                fieldName: item.field_name,
                                                            })
                                                            setTextInputEditable(false)
                                                        }}
                                                        value={FieldsDataTypes[fieldName]}
                                                        editable={textInputEditable}
                                                    />
                                                    <DateTimePickerModal
                                                        isVisible={state.openTimePicker}
                                                        mode="time"
                                                        // datePickerModeAndroid="spinner"
                                                        onConfirm={(date) => _onSelectDateTime(date, state.fieldName, "LT")}
                                                        onCancel={() => {
                                                            setState({
                                                                ...state,
                                                                openTimePicker: false,
                                                            })
                                                            setTextInputEditable(true)
                                                        }}
                                                    />

                                                </View>
                                                :
                                                <></>
                                        }
                                    </View>
                                }
                            />
                        </>
                        :
                        <FlatList
                            data={textFieldsData}
                            contentContainerStyle={{}}
                            renderItem={({ item }) =>
                                <View>
                                    {
                                        item.field_datatype == "string" ?
                                            <>
                                                {/* <Text style={{
                                                    ...commonStyles.margin_24_24,
                                                    marginTop: moderateScale(8),
                                                    ...commonStyles.fontSize_14_BOLD
                                                }}>{fieldLabel}</Text> */}
                                                <CommonTextInput
                                                    mainView={{
                                                        ...commonStyles.margin_8_24,
                                                        // width: "46%"
                                                    }}
                                                    placeholder={item.field_placeholder || ""}
                                                    onFocus={() => { }}
                                                    onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                    returnKeyType="next"
                                                // blurOnSubmit={false}
                                                />
                                            </> : <></>
                                    }
                                    {
                                        item.field_datatype == "integer" ?
                                            <>
                                                {/* <Text style={{
                                                    ...commonStyles.margin_24_24,
                                                    marginTop: moderateScale(8),
                                                    ...commonStyles.fontSize_14_BOLD
                                                }}>{fieldLabel}</Text> */}
                                                <CommonTextInput
                                                    mainView={{
                                                        ...commonStyles.margin_8_24,
                                                        // width: "46%"
                                                    }}
                                                    placeholder={item.field_placeholder || ""}
                                                    onFocus={() => { }}
                                                    onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                    returnKeyType="done"
                                                    keyboardType="number-pad"
                                                />
                                            </> : <></>
                                    }

                                    {/* 
                                    {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "dropdown" ?
                                            dropDownName = item.field_datatype + item.field_name : "",

                                        item.field_datatype == "dropdown" ?
                                            <View style={{
