import React, { Component, useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    // TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    Keyboard,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    TouchableNativeFeedback,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';

import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useRoute } from '@react-navigation/native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import ImagePicker from 'react-native-image-crop-picker';

//Redux
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import actions from '../../redux/actions';
import Loader from '../../components/Loader';

import { ImagePath } from '../../constants/ImagePath';
import { colors } from '../../styles/colors';
import { height, moderateScale, textScale, width } from '../../styles/responsiveStyles';
import strings from '../../constants/LocalizedStrings'
import Button from '../../components/Button';
import commonStyles from '../../styles/commonStyles';
import { CommonTextInput } from '../../components/TextInput';
import CommonButton from '../../components/CommonButton';
import SimpleHeader from '../../components/SimpleHeader';
import { NoDataFound } from '../../components/NoDataFound';
import { MorePopup } from '../../components/MorePopup';
import { CalenderPicker } from '../../components/CalenderPicker';
import moment from 'moment';
import { showError } from '../../utils/helperFunctions';
import SelectPhotos from '../SelectPhotos';
import { fontNames } from '../../styles/fontFamily';

const CommonHeading = ({
    text
}) => {
    return (
        <Text style={{
            ...commonStyles.margin_24_24,
            ...commonStyles.fontSize_14_BOLD
        }}>{text}</Text>
    )
}

const Date_Time_View = ({
    dateTimeExtraStyle,
    onPress,
    value,
    placeHolder,
    rightIcon,
    condition
}) => {
    return (
        <TouchableOpacity style={{ ...styles.dateTimeView, ...dateTimeExtraStyle }}
            onPress={onPress}
            activeOpacity={0.8}  >
            {
                condition ?
                    <Text style={{ ...styles.dateTimeText }}>{value}</Text>
                    :
                    <Text style={{ ...styles.dateTimeText, opacity: 0.3 }}>{placeHolder}</Text>
            }
            <Image source={rightIcon} style={{ ...styles.dateTimeIcon }} />
        </TouchableOpacity>
    )
}

const CategoryFields = props => {
    const userData = useSelector((state) => state.auth.savedLocation);

    // const netInfo = useSelector(state => state.netInfo)

    const navigation = useNavigation();
    const route = useRoute();
    const [state, setState] = useState({
        categoryId: route.params.data.categoryId || 0,
        subCategoryId: route.params.data.subCategoryId || 0,
        subSubCategoryId: route.params.data.subSubCategoryId || 0,
        // subCategoryName: route.params.data.subCategoryName || "",
        subCategoryName: "",
        openDropDown: false,
        openDateTimePicker: false,
        openTimePicker: false,
        showCalender: false,
        openModal: false,
        pageNo_1: [],
        pageNo_1_handle: [],
        fieldName: {},
        imageHandle: "",

        address: "",
        title: "",

        SelectPhotos: false
    })
    const [openDateTimePicker, setOpenDateTimePicker] = useState(false)
    const [openTimePicker, setOpenTimePicker] = useState(false)

    const [textInputEditable, setTextInputEditable] = useState(true)
    const [loader, setLoader] = useState(false)
    const [HandleFields, setHandleFields] = useState([])
    const [FieldsDataTypes, setFieldsDataTypes] = useState({})
    const [dropDownHandle, setDropDownHandle] = useState([])
    const [pageCount, setPageCount] = useState(1)

    const [Location, setLocation] = useState([])

    useEffect(() => {
        console.log(route.params.data.subSubCategoryId, "xxxxxxxxxxxxxxxx");
        getCatFields(1);
    }, [])

    const checkEmptyObject = (val) => {
        return Object.keys(val).length;
    }

    const getCatFields = (pageCount) => {
        setLoader(true)
        let arr = []
        let { getFields } = props.actions;

        let data = state.categoryId + "&sub_category_id=" + state.subCategoryId + "&sub_subcategory_id=" + state.subSubCategoryId;
        getFields(data, pageCount).then(res => {
            setLoader(false)
            console.log(res, "<<< -- <==> -- zzz")
            if (res.statusCode == 200) {
                arr = res.data

                if (!arr.length) {
                    let pageNo = pageCount - 1;
                    setPageCount(pageNo)
                    _moveToNextPage()
                } else {
                    setHandleFields(arr)
                    setState({ ...state, subCategoryName: res.page_title, })
                }

                let arr = []
                for (let val of res.data) {
                    let fields = val.data
                    fields.map((val, i) => {
                        FieldsDataTypes[val.field_name] = (FieldsDataTypes[val.field_name]) ? FieldsDataTypes[val.field_name] : ""
                    })
                }

                // setFieldsDataTypes({ ...FieldsDataTypes })

            }
        }).catch(error => {
            setLoader(false)
        })
    }

    // const getCatFields = () => {
    // setLoader(true)
    // let arr = []
    // let { getFields } = props.actions;
    // let data = state.categoryId + "&sub_category_id=" + state.subCategoryId;
    // getFields(data, 1).then(res => {
    //     console.log(res, "get cat fields")
    //     if (res.statusCode == 200) {
    //         arr = res.data

    //         let dropDownFields = [{ ...dropDownHandle }];
    //         let dropDownData = []
    //         let isEmpty = checkEmptyObject(dropDownFields[0])
    //         if (!isEmpty) {
    //             dropDownData = []
    //         }
    //         res.data.map((val, i) => {
    //             // console.log(dropDownData, "1")
    //             FieldsDataTypes[val.field_name] = ""
    //             if (val.field_datatype == "dropdown") {
    //                 var obj = {};
    //                 obj["dropdown" + val.field_name] = false;
    //                 dropDownData.push(obj);
    //             }
    //         })
    //         setFieldsDataTypes({ ...FieldsDataTypes })
    //         setDropDownHandle(dropDownData)
    //         setLoader(false)
    //         setHandleFields(arr)
    //         // console.log(FieldsDataTypes, "141")
    //     }
    // }).catch(error => {
    //     setLoader(false)
    // })
    // }

    const _openDropDown = (value) => {
        // console.log("1111111")
        setTextInputEditable(false)
        dropDownHandle.map((val, i) => {
            let getKey = Object.keys(val)
            if (val[getKey] == true) {
                val[getKey] = false
            }
        })
        // console.log("222222")
        let dropDown = [...dropDownHandle]
        // console.log(dropDown, " <= 1222")
        if (dropDown[value] == true) {
            dropDown[value] = false
        } else {
            dropDown[value] = true
        }
        setDropDownHandle(dropDown)
        // console.log("33333")
    }

    const _updateField = (FieldArray, setFieldArray, fieldName, selectedValue) => {
        let allFields = FieldArray
        allFields[fieldName] = selectedValue
        setFieldArray({ ...allFields })

        if (fieldName.toLowerCase() == "title") {
            console.log("setting title")
            setState({ ...state, title: selectedValue })
        }
    }

    const _onSelectDropDownOption = (value, fieldName, selectedItem) => {
        let dropDown = [...dropDownHandle]
        if (dropDown[value] == true) {
            dropDown[value] = false
        }
        _updateField(FieldsDataTypes, setFieldsDataTypes, fieldName, selectedItem)
        setDropDownHandle(dropDown)
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
        debugger
        // setState({
        //     ...state,
        //     openDateTimePicker: false,
        //     openTimePicker: false,
        // })
        setOpenDateTimePicker(false)
        setOpenTimePicker(false)
        let formatDate = moment(date).format(format)
        _updateField(FieldsDataTypes, setFieldsDataTypes, fieldName, formatDate)
        setTextInputEditable(true)
    }

    const _onChangeText = (val, field_name) => {
        _updateField(FieldsDataTypes, setFieldsDataTypes, field_name, val)
    }

    const selectLocation = (fieldName, fieldDataType) => {
        navigation.navigate('GooglePlacesInput', { onNavigationBack: (data) => onNavigationBack(data, fieldName, fieldDataType) })
        Keyboard.dismiss()
    }

    const onNavigationBack = (data, fieldName, fieldDataType) => {
        console.log(data, 'datadadatadatadadtadatdatdtadtdatd');

        let country = "",
            city = "",
            stateName = "",
            state_abbr = "",
            postalCode = "",
            localityName = ""

        for (var i = 0; i < data.address_components.length; i++) {
            let addr = data.address_components[i];
            if (addr.types[0] == 'country')
                country = addr.long_name ? addr.long_name : "";
            if (addr.types[0] == 'locality')
                city = addr.long_name ? addr.long_name : "";
            if (addr.types[0] == 'administrative_area_level_1') {
                stateName = addr.long_name ? addr.long_name : "";
                state_abbr = addr.short_name ? addr.short_name : "";
            } if (addr.types[0] == 'postal_code')
                postalCode = addr.long_name ? addr.long_name : "";
            if (addr.types[0] == 'sublocality_level_1')
                localityName = addr.long_name ? addr.long_name : "";
        }

        console.log(country, "\n", city, "klklklkllkllklklkllkklklk");

        if (fieldName == "address") {
            setState({ ...state, address: data.formatted_address })
        }

        if (fieldDataType == "google_location" || fieldDataType == "location") {
            let loc = (data && data.geometry && data.geometry.location) ? data.geometry.location : ""
            let fullAddress = {
                formattedAdress: data.formatted_address,
                lat: loc ? data.geometry.location.lat : 30.6668,
                lng: loc ? data.geometry.location.lng : 76.7863,
                city: city || "",
                country: country || "",
            }
            _updateField(FieldsDataTypes, setFieldsDataTypes, fieldName, fullAddress)
        } else if (fieldDataType == "pick_up") {
            let loc = (data && data.geometry && data.geometry.location) ? data.geometry.location : ""
            let pickUpLocation = {
                formattedAdress: data.formatted_address,
                lat: loc ? data.geometry.location.lat : 30.6668,
                lng: loc ? data.geometry.location.lng : 76.7863,
                city: city || "",
                country: country || "",
            }
            _updateField(FieldsDataTypes, setFieldsDataTypes, fieldName, pickUpLocation)

            let allFields = FieldsDataTypes
            allFields["pickUpLocation"] = pickUpLocation
            setFieldsDataTypes({ ...allFields })

        } else if (fieldDataType == "drop_off") {
            let loc = (data && data.geometry && data.geometry.location) ? data.geometry.location : ""
            let dropOffLocation = {
                formattedAdress: data.formatted_address,
                lat: loc ? data.geometry.location.lat : 30.6668,
                lng: loc ? data.geometry.location.lng : 76.7863,
                city: city || "",
                country: country || "",
            }
            _updateField(FieldsDataTypes, setFieldsDataTypes, fieldName, dropOffLocation)
            let allFields = FieldsDataTypes
            allFields["dropOffLocation"] = dropOffLocation
            setFieldsDataTypes({ ...allFields })
        } else {
            let fullAddress = data.formatted_address
            _updateField(FieldsDataTypes, setFieldsDataTypes, fieldName, fullAddress)
        }
    }

    const _selectImage = (fieldName) => {
        ImagePicker.openPicker({
            multiple: true
        }).then(images => {
            setState({
                ...state,
                imageHandle: images
            })
            _updateField(FieldsDataTypes, setFieldsDataTypes, fieldName, images)
        });
    }
    const _onBackDropPress = (value) => {
        let dropDown = [...dropDownHandle]
        if (dropDown[value] == true) {
            dropDown[value] = false
        }
        setDropDownHandle(dropDown)
        closeModal()
    }

    // const _renderFlatList = ({ item, index }) => {
    const _renderFlatList = (item, index) => {
        // fieldName = item.field_name
        // // fieldName = item.field_label
        // let fieldDataType = item.field_datatype
        // let dropDownName = {}
        // if (item.field_datatype == "dropdown") {
        //     dropDownName = item.field_datatype + item.field_name;
        // }

        // console.log(item, "get cat fields");
        // let item_field_list = item.map((item, indexedDB) => {

        // })

        let fieldName = {}
        let fieldDataType = {}
        let dropDownName = {}
        let textFieldsData = item.data;
        let textFieldsDataSize = textFieldsData.length;
        let numberOfColumn = item.num_of_fields

        let filedLabel = item.label
        return (
            <View >
                <CommonHeading
                    text={item.label}
                />
                {/* {console.log(numberOfColumn, "numberOfColumn")} */}
                {
                    numberOfColumn > 1 ?
                        <FlatList
                            data={textFieldsData}
                            numColumns={numberOfColumn > 1 ? numberOfColumn : 2}
                            contentContainerStyle={{}}
                            extraData={FieldsDataTypes}
                            columnWrapperStyle={{
                                ...commonStyles.flexBetween,
                                ...commonStyles.margin_8_24,
                                paddingBottom: moderateScale(16)
                            }}
                            renderItem={({ item }) =>
                                <View>
                                    {
                                        item.field_datatype == "integer" ?
                                            <CommonTextInput
                                                mainView={{ width: width / numberOfColumn - 30 }}
                                                placeholder={item.field_placeholder || ""}
                                                onFocus={() => { }}
                                                onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                returnKeyType="done"
                                                keyboardType={"decimal-pad"}
                                                value={FieldsDataTypes[item.field_name] || ""}
                                                maxLength={parseInt(item.max_length)}
                                            /> : <></>
                                    }
                                    {
                                        item.field_datatype == "string" ?
                                            <CommonTextInput
                                                mainView={{ width: width / numberOfColumn - 30 }}
                                                placeholder={item.field_placeholder || ""}
                                                onFocus={() => { }}
                                                onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                returnKeyType="next"
                                                value={FieldsDataTypes[item.field_name] || ""}
                                            /> : <></>
                                    }
                                    {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "date" ?
                                            <View>
                                                <Date_Time_View
                                                    dateTimeExtraStyle={{ width: width / numberOfColumn - 30 }}
                                                    onPress={() => {
                                                        setState({
                                                            ...state,
                                                            openModal: true,
                                                            showCalender: true,
                                                            fieldName: item.field_name,
                                                        })
                                                        setTextInputEditable(false)
                                                    }}
                                                    condition={FieldsDataTypes[fieldName]}
                                                    value={FieldsDataTypes[fieldName]}
                                                    placeHolder={item.field_placeholder || ""}
                                                    rightIcon={ImagePath.ic_select_date}
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
                                                        value={FieldsDataTypes[item.field_name] || ""}
                                                    />
                                                }
                                            </View>
                                            : <></>
                                    }
                                    {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "time" ?
                                            <View >
                                                <Date_Time_View
                                                    dateTimeExtraStyle={{ width: width / numberOfColumn - 30, }}
                                                    onPress={() => {
                                                        setOpenTimePicker(true)
                                                        setTextInputEditable(false)
                                                        setState({
                                                            ...state,
                                                            // openTimePicker: true,
                                                            fieldName: item.field_name,
                                                        })
                                                    }}
                                                    condition={FieldsDataTypes[item.field_name] || ""}
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    placeHolder={item.field_placeholder || ""}
                                                    rightIcon={ImagePath.ic_select_time}
                                                />

                                                {openTimePicker ?
                                                    < DateTimePickerModal
                                                        isVisible={openTimePicker}
                                                        mode="time"
                                                        is24Hour={false}
                                                        display="spinner"
                                                        // datePickerModeAndroid="spinner"
                                                        onConfirm={(date) => {
                                                            debugger

                                                            // setOpenDateTimePicker(false)
                                                            setOpenTimePicker(false)

                                                            debugger
                                                            // setState({
                                                            //     ...state,
                                                            //     openDateTimePicker: false,
                                                            //     openTimePicker: false,
                                                            // })
                                                            _onSelectDateTime(date, state.fieldName, "LT")
                                                        }}
                                                        onCancel={() => {
                                                            setState({
                                                                ...state,
                                                                openTimePicker: false,
                                                            })
                                                            setOpenTimePicker(false)
                                                            setTextInputEditable(true)
                                                        }}
                                                        value={FieldsDataTypes[item.field_name] || ""}
                                                    />
                                                    : <></>}

                                            </View>
                                            :
                                            <></>
                                    }
                                    {/* {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "date_time" ?
                                            <View>
                                                <Date_Time_View
                                                    dateTimeExtraStyle={{ width: width / numberOfColumn - 30, }}
                                                    onPress={() => {
                                                        setState({
                                                            ...state,
                                                            // openTimePicker: true,
                                                            fieldName: item.field_name,
                                                        })
                                                        setOpenTimePicker(true)
                                                        setTextInputEditable(false)
                                                    }}
                                                    condition={FieldsDataTypes[item.field_name] || ""}
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    placeHolder={item.field_placeholder || ""}
                                                    rightIcon={ImagePath.ic_select_date}
                                                />
                                                {openTimePicker ?
                                                    <DateTimePickerModal
                                                        isVisible={openTimePicker}
                                                        mode="datetime"
                                                        // datePickerModeAndroid="spinner"
                                                        onConfirm={(date) => {
                                                            // setState({
                                                            //     ...state,
                                                            //     // openDateTimePicker: false,
                                                            //     // openTimePicker: false,
                                                            // })
                                                            setOpenDateTimePicker(false)
                                                            setOpenTimePicker(false)
                                                            _onSelectDateTime(date, state.fieldName, "lll")
                                                        }}
                                                        onCancel={() => {
                                                            setState({ ...state, openTimePicker: false, })
                                                            setOpenTimePicker(false)
                                                            setTextInputEditable(true)
                                                        }}
                                                        value={FieldsDataTypes[item.field_name] || ""}
                                                    />
                                                    : <></>}
                                            </View>
                                            :
                                            <></>
                                    } */}
                                    {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "google_location" ?
                                            <CommonTextInput
                                                leftIcon={ImagePath.ic_start_location}
                                                rightIcon={ImagePath.ic_current_location}
                                                mainView={{ width: width / numberOfColumn - 30, }}
                                                // textInput={{ textAlignVertical: "center" }}
                                                placeholder={item.field_placeholder}
                                                onFocus={() => selectLocation(fieldName, fieldDataType)}
                                                // onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                // multiline={true}
                                                // value={FieldsDataTypes[fieldName].fullAddress.formattedAdress}
                                                value={(FieldsDataTypes[fieldName] && FieldsDataTypes[fieldName].formattedAdress) ? FieldsDataTypes[fieldName].formattedAdress : ""}
                                            // returnKeyType="next"
                                            /> : <></>
                                    }
                                    {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "pick_up" ?
                                            <CommonTextInput
                                                leftIcon={ImagePath.ic_start_location}
                                                rightIcon={ImagePath.ic_current_location}
                                                mainView={{ width: width / numberOfColumn - 30, }}
                                                placeholder={item.field_placeholder || ""}
                                                onFocus={() => selectLocation(fieldName, fieldDataType)}
                                                // onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                // multiline={true}
                                                // value={FieldsDataTypes[fieldName].fullAddress.formattedAdress}
                                                value={(FieldsDataTypes[fieldName] && FieldsDataTypes[fieldName].formattedAdress) ? FieldsDataTypes[fieldName].formattedAdress : ""}
                                            // returnKeyType="next"
                                            /> : <></>
                                    }
                                    {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "drop_off" ?
                                            <CommonTextInput
                                                leftIcon={ImagePath.ic_start_location}
                                                rightIcon={ImagePath.ic_current_location}
                                                mainView={{ width: width / numberOfColumn - 30, }}
                                                placeholder={item.field_placeholder || ""}
                                                onFocus={() => selectLocation(fieldName, fieldDataType)}
                                                // onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                // multiline={true}
                                                // value={FieldsDataTypes[fieldName].fullAddress.formattedAdress}
                                                value={(FieldsDataTypes[fieldName] && FieldsDataTypes[fieldName].formattedAdress) ? FieldsDataTypes[fieldName].formattedAdress : ""}
                                            // returnKeyType="next"
                                            /> : <></>
                                    }
                                    {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "dropdown" ?
                                            dropDownName = item.field_datatype + item.field_name : "",

                                        item.field_datatype == "dropdown" ?
                                            <View style={{ zindex: 1, flex: 1 }}>
                                                <Date_Time_View
                                                    dateTimeExtraStyle={{ width: width / numberOfColumn - 30, }}
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    placeHolder={item.field_placeholder || ""}
                                                    condition={FieldsDataTypes[item.field_name] || ""}
                                                    onPress={() => _openDropDown(item.field_datatype + item.field_name)}
                                                    editable={textInputEditable}
                                                    s />

                                                {
                                                    dropDownHandle[dropDownName] ?
                                                        <Modal
                                                            isVisible={dropDownHandle[dropDownName]}
                                                            deviceWidth={width}
                                                            deviceHeight={height}
                                                            onBackdropPress={() => _onBackDropPress("dropdown" + item.field_name)}
                                                            onBackdropPress={() => _onBackDropPress("dropdown" + item.field_name)}
                                                        >
                                                            <View style={{}}>
                                                                <MorePopup
                                                                    isModalVisible={state.openDropDown}
                                                                    moreList={item.field_option}
                                                                    action={(selectedItem) => _onSelectDropDownOption("dropdown" + item.field_name, item.field_name, selectedItem)}
                                                                    onBackDrop={() => { }}
                                                                />
                                                            </View>
                                                        </Modal> :
                                                        <></>
                                                }

                                                {/* {
                                                    dropDownHandle[dropDownName] ?
                                                        <View style={{
                                                            // position: 'absolute',
                                                            zindex: 11,
                                                            justifyContent: "center",
                                                            alignItems: "center"
                                                        }}>
                                                            <MorePopup
                                                                isModalVisible={state.openDropDown}
                                                                moreList={item.field_option}
                                                                action={(selectedItem) => _onSelectDropDownOption("dropdown" + item.field_name, item.field_name, selectedItem)}
                                                                onBackDrop={() => { }}
                                                            />
                                                        </View> : <></>
                                                } */}
                                            </View>
                                            : <></>
                                    }
                                </View>
                            }
                        />
                        :

                        textFieldsData.map((item, index) => {
                            return (
                                <ScrollView
                                    keyboardShouldPersistTaps={"always"}
                                >
                                    {
                                        item.field_datatype == "file" ?
                                            <SelectPhotos
                                                onNavigationBackFile={(data) => {
                                                    _onChangeText(data, item.field_name)
                                                    setState({
                                                        ...state,
                                                        imageHandle: data,
                                                        subCategoryName: "upload photos"
                                                    })

                                                }}
                                            />
                                            : <></>
                                    }
                                    {
                                        item.field_datatype == "string" ?
                                            <CommonTextInput
                                                mainView={{ ...commonStyles.margin_8_24, }}
                                                placeholder={item.field_placeholder || ""}
                                                onFocus={() => { }}
                                                onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                returnKeyType="next"
                                                value={FieldsDataTypes[item.field_name] || ""}
                                            /> : <></>
                                    }
                                    {
                                        item.field_datatype == "textarea" ?
                                            <CommonTextInput
                                                mainView={{
                                                    ...commonStyles.margin_8_24,
                                                    height: moderateScale(94)
                                                }}
                                                placeholder={item.field_placeholder || ""}
                                                onFocus={() => { }}
                                                onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                returnKeyType="next"
                                                value={FieldsDataTypes[item.field_name] || ""}
                                                multiline={true}
                                                maxLength={parseInt(item.max_length)}
                                            /> : <></>
                                    }
                                    {
                                        item.field_datatype == "integer" ?
                                            <CommonTextInput
                                                mainView={{ ...commonStyles.margin_8_24, }}
                                                placeholder={item.field_placeholder || ""}
                                                onFocus={() => { }}
                                                onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                returnKeyType="done"
                                                keyboardType={"decimal-pad"}
                                                value={FieldsDataTypes[item.field_name] || ""}
                                            /> : <></>
                                    }
                                    {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "google_location" ?
                                            <CommonTextInput
                                                leftIcon={ImagePath.ic_start_location}
                                                rightIcon={ImagePath.ic_current_location}
                                                mainView={{
                                                    ...commonStyles.margin_8_24,
                                                    // height: 48,
                                                }}
                                                // textInput={{ textAlignVertical: "center" }}
                                                placeholder={item.field_placeholder}
                                                onFocus={() => selectLocation(fieldName, fieldDataType)}
                                                // onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                // multiline={true}
                                                // value={FieldsDataTypes[fieldName].fullAddress.formattedAdress}
                                                value={(FieldsDataTypes[fieldName] && FieldsDataTypes[fieldName].formattedAdress) ? FieldsDataTypes[fieldName].formattedAdress : ""}
                                            // returnKeyType="next"
                                            /> : <></>
                                    }
                                    {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "pick_up" ?
                                            <CommonTextInput
                                                leftIcon={ImagePath.ic_start_location}
                                                rightIcon={ImagePath.ic_current_location}
                                                mainView={{ ...commonStyles.margin_8_24, }}
                                                placeholder={item.field_placeholder || ""}
                                                onFocus={() => selectLocation(fieldName, fieldDataType)}
                                                // onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                // multiline={true}
                                                // value={FieldsDataTypes[fieldName].fullAddress.formattedAdress}
                                                value={(FieldsDataTypes[fieldName] && FieldsDataTypes[fieldName].formattedAdress) ? FieldsDataTypes[fieldName].formattedAdress : ""}
                                            // returnKeyType="next"
                                            /> : <></>
                                    }
                                    {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "drop_off" ?
                                            <CommonTextInput
                                                leftIcon={ImagePath.ic_start_location}
                                                rightIcon={ImagePath.ic_current_location}
                                                mainView={{ ...commonStyles.margin_8_24, }}
                                                placeholder={item.field_placeholder || ""}
                                                onFocus={() => selectLocation(fieldName, fieldDataType)}
                                                // onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                // multiline={true}
                                                // value={FieldsDataTypes[fieldName].fullAddress.formattedAdress}
                                                value={(FieldsDataTypes[fieldName] && FieldsDataTypes[fieldName].formattedAdress) ? FieldsDataTypes[fieldName].formattedAdress : ""}
                                            // returnKeyType="next"
                                            /> : <></>
                                    }
                                    {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "date" ?
                                            <View >
                                                <Date_Time_View
                                                    dateTimeExtraStyle={{ ...commonStyles.margin_8_24, }}
                                                    onPress={() => {
                                                        setState({
                                                            ...state,
                                                            openModal: true,
                                                            showCalender: true,
                                                            fieldName: item.field_name,
                                                        })
                                                        setTextInputEditable(false)
                                                    }}
                                                    condition={FieldsDataTypes[item.field_name] || ""}
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    placeHolder={item.field_placeholder || ""}
                                                    rightIcon={ImagePath.ic_select_date}
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
                                            <View>
                                                <Date_Time_View
                                                    dateTimeExtraStyle={{ ...commonStyles.margin_8_24, }}
                                                    onPress={() => {
                                                        setOpenTimePicker(true)
                                                        setTextInputEditable(false)
                                                        setState({
                                                            ...state,
                                                            // openTimePicker: true,
                                                            fieldName: item.field_name,
                                                        })
                                                    }}
                                                    condition={FieldsDataTypes[item.field_name] || ""}
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    placeHolder={item.field_placeholder || ""}
                                                    rightIcon={ImagePath.ic_select_time}
                                                />
                                                {openTimePicker ?
                                                    <DateTimePickerModal
                                                        isVisible={openTimePicker}
                                                        mode="time"
                                                        is24Hour={false}
                                                        display="spinner"
                                                        // datePickerModeAndroid="spinner"
                                                        onConfirm={(date) => {
                                                            setOpenDateTimePicker(false)
                                                            setOpenTimePicker(false)
                                                            // setState({
                                                            //     ...state,
                                                            //     openDateTimePicker: false,
                                                            //     openTimePicker: false,
                                                            // })
                                                            _onSelectDateTime(date, state.fieldName, "LT")
                                                        }
                                                        }
                                                        onCancel={() => {
                                                            setState({ ...state, openTimePicker: false, })
                                                            setOpenTimePicker(false)
                                                            setTextInputEditable(true)
                                                        }}
                                                    />
                                                    : <></>}
                                            </View>
                                            :
                                            <></>
                                    }
                                    {/* {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "date_time" ?
                                            <View>
                                                <Date_Time_View
                                                    dateTimeExtraStyle={{ ...commonStyles.margin_8_24, }}
                                                    onPress={() => {
                                                        setState({
                                                            ...state,
                                                            // openTimePicker: true,
                                                            fieldName: item.field_name,
                                                        })
                                                        setOpenTimePicker(true)
                                                        setTextInputEditable(false)
                                                    }}
                                                    condition={FieldsDataTypes[item.field_name] || ""}
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    placeHolder={item.field_placeholder || ""}
                                                    rightIcon={ImagePath.ic_select_date}
                                                />
                                                {openTimePicker ?
                                                    <DateTimePickerModal
                                                        isVisible={openTimePicker}
                                                        mode="datetime"
                                                        // datePickerModeAndroid="spinner"
                                                        onConfirm={(date) => {
                                                            setState({
                                                                ...state,
                                                                openDateTimePicker: false,
                                                                openTimePicker: false,
                                                            })
                                                            setOpenDateTimePicker(false)
                                                            setOpenTimePicker(false)
                                                            _onSelectDateTime(date, state.fieldName, "lll")
                                                        }}
                                                        onCancel={() => {
                                                            setState({
                                                                ...state,
                                                                openTimePicker: false,
                                                            })
                                                            setOpenTimePicker(false)
                                                            setTextInputEditable(true)
                                                        }}
                                                        value={FieldsDataTypes[item.field_name] || ""}
                                                    /> :
                                                    <></>
                                                }

                                            </View>
                                            :
                                            <></>
                                    } */}
                                    {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "dropdown" ?
                                            dropDownName = item.field_datatype + item.field_name : "",

                                        item.field_datatype == "dropdown" ?
                                            <View style={{
                                                zindex: 1,
                                                flex: 1
                                            }}>
                                                {/* <CommonTextInput
                                                    mainView={{ ...commonStyles.margin_8_24 }}
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    placeholder={item.field_placeholder || ""}
                                                    onFocus={() => _openDropDown(item.field_datatype + item.field_name)}
                                                    editable={textInputEditable}
                                                /> */}
                                                <Date_Time_View
                                                    dateTimeExtraStyle={{ ...commonStyles.margin_8_24 }}
                                                    onPress={() => _openDropDown(item.field_datatype + item.field_name)}
                                                    condition={FieldsDataTypes[item.field_name] || ""}
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    placeHolder={item.field_placeholder || ""}
                                                // rightIcon={ImagePath.ic_select_time}
                                                />
                                                {
                                                    dropDownHandle[dropDownName] ?
                                                        <Modal
                                                            // isVisible={dropDownHandle[dropDownName]}
                                                            isVisible={true}
                                                            deviceWidth={width}
                                                            deviceHeight={height}
                                                            onBackdropPress={() => _onBackDropPress("dropdown" + item.field_name)}
                                                            onBackdropPress={() => _onBackDropPress("dropdown" + item.field_name)}
                                                        >
                                                            <View style={{}}>
                                                                <MorePopup
                                                                    isModalVisible={dropDownHandle[dropDownName]}
                                                                    // isModalVisible={true}
                                                                    moreList={item.field_option}
                                                                    action={(selectedItem) => _onSelectDropDownOption("dropdown" + item.field_name, item.field_name, selectedItem)}
                                                                    onBackDrop={() => { }}
                                                                />
                                                            </View>
                                                        </Modal> :
                                                        <></>
                                                }
                                                {/* {
                                                    dropDownHandle[dropDownName] ?
                                                        <View style={{
                                                            // position: 'absolute',
                                                            zindex: 11,
                                                            justifyContent: "center",
                                                            alignItems: "center"
                                                        }}>
                                                            <MorePopup
                                                                isModalVisible={state.openDropDown}
                                                                moreList={item.field_option}
                                                                action={(selectedItem) => _onSelectDropDownOption("dropdown" + item.field_name, item.field_name, selectedItem)}
                                                                onBackDrop={() => { }}
                                                            />
                                                        </View> : <></>
                                                } */}
                                            </View>
                                            : <></>
                                    }
                                </ScrollView>
                            )
                        })
                }
            </View>
        )
    }

    const _onPressUpdate = () => {
        console.log(FieldsDataTypes, "get cat fields");

        debugger

        let flag = false
        let arr = Object.keys(FieldsDataTypes)
        arr.map((val, i) => {
            console.log(FieldsDataTypes[val], "xxxxxxxxxxxxxxxxxxxxx");
            if (FieldsDataTypes[val] == "") {
                flag = true
            }
        })
        console.log(pageCount);
        debugger
        if (flag) {
            debugger
            showError(strings.fieldsMustNotBeEmpty);
            debugger
            console.log(pageCount);
            debugger
        } else {
            debugger
            let count = pageCount + 1
            debugger
            setPageCount(count),
                getCatFields(count)
        }

    }

    const _openPressBack = () => {
        console.log(pageCount, " pageCount");
        debugger
        if (pageCount <= 1) {
            console.log("11111")
            props.navigation.goBack()
        } else {
            console.log("11111")
            let count = pageCount - 1
            setPageCount(count)
            debugger
            let arr = Object.keys(FieldsDataTypes)
            debugger
            arr.map((val, i) => {
                console.log(val, "vallklkllkllklkllkllklkllkllklkllkllklkllkl");
                if (FieldsDataTypes[val] == "") {
                    debugger
                    console.log(FieldsDataTypes[val], "lklkllkl");
                    delete FieldsDataTypes[val];
                    debugger
                }
                //  else {
                //     _updateField(FieldsDataTypes, setFieldsDataTypes, val, FieldsDataTypes[val])
                // }
            })
            debugger
            console.log(FieldsDataTypes, "HandleFieldsHandleFieldsHandleFields", count)
            getCatFields(count)
            debugger
        }
    }

    const _moveToNextPage = () => {

        let payload = {
            product_details: FieldsDataTypes,
            images: state.imageHandle,
            categoryId: state.categoryId,
            subCategoryId: state.subCategoryId,
            subSubCategoryId: state.subSubCategoryId,
            address: state.address,
            title: state.title
        }
        props.navigation.navigate("setPrice", {
            data: payload
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.COMMON_THEME_COLOR, }}>
            <SimpleHeader
                leftImage={ImagePath.ic_back_white}
                onPressLeft={_openPressBack}
                leftSubText={state.subCategoryName}
                rightButtonText={state.subCategoryName.toLowerCase() == "upload photos" ? strings.Next : ""}
                onPressRightButton={() => {
                    Keyboard.dismiss(),
                        // let count = pageCount + 1
                        // setPageCount(count),
                        // _openPressBack()
                        _onPressUpdate()
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : ""}
                // behavior="padding"
                contentContainerStyle={{ flex: 1 }}
                style={{ ...commonStyles.keyboardAvoidingViewStyle, }}>
                {state.subCategoryName.toLowerCase() != "upload photos" ?
                    <ImageBackground
                        source={ImagePath.white_dot_bg}
                        style={{
                            flex: 1,
                            resizeMode: "cover",
                        }}>
                        <ScrollView
                            // style={{
                            //     ...styles.subView
                            // }}
                            showsVerticalScrollIndicator={false}
                            style={{ paddingBottom: moderateScale(40) }}
                            keyboardShouldPersistTaps={"always"}
                        >
                            <View style={{
                                flex: 1,
                            }}>
                                {/* {
                                    JSON.stringify(HandleFields) != "[]" ?
                                        // <FlatList
                                        //     showsVerticalScrollIndicator={false}
                                        //     keyboardShouldPersistTaps={"always"}
                                        //     data={HandleFields}
                                        //     contentContainerStyle={{ flexGrow: 1, }}
                                        //     extraData={HandleFields}
                                        //     renderItem={_renderFlatList}
                                        //     ListFooterComponent={<View style={{ marginVertical: moderateScale(40) }} />}
                                        // />
                                        HandleFields.map((item, indexedDB) => {
                                            return _renderFlatList(item, indexedDB)
                                        })
                                        :
                                        <NoDataFound />
                                } */}
                                {
                                    HandleFields.map((item, indexedDB) => {
                                        return _renderFlatList(item, indexedDB)
                                    })
                                }

                            </View>
                        </ScrollView>
                    </ImageBackground>
                    :
                    <View style={{
                        flex: 1,
                    }}>
                        <ImageBackground
                            source={ImagePath.white_dot_bg}
                            style={{
                                flex: 1,
                                resizeMode: "cover",
                            }}>
                            {
                                // JSON.stringify(HandleFields) != "[]" ?
                                HandleFields.map((item, indexedDB) => {
                                    return _renderFlatList(item, indexedDB)
                                })
                                // :
                                // <NoDataFound />
                            }
                        </ImageBackground>
                    </View>
                }
                {
                    JSON.stringify(HandleFields) != "[]" ?
                        <View style={{ backgroundColor: colors.WHITE }}>
                            {
                                state.subCategoryName.toLowerCase() != "upload photos" ?
                                    <CommonButton
                                        mainViewStyle={{
                                            marginBottom: moderateScale(24),
                                            marginHorizontal: moderateScale(24),
                                        }}
                                        buttonText={strings.NEXT}
                                        textStyle={{ color: colors.WHITE }}
                                        onPressButton={() => {
                                            Keyboard.dismiss()
                                            // let count = pageCount + 1
                                            // setPageCount(count),
                                            _onPressUpdate()
                                        }}
                                    // onPressButton={() => console.log(FieldsDataTypes, "get cat fields")}
                                    /> : <></>}
                        </View> : <></>
                }
            </KeyboardAvoidingView>
            <Loader isLoading={loader} />
        </View>
    )
}
let styles = new StyleSheet.create({
    dateTimeView: {
        height: moderateScale(48),
        borderWidth: 1,
        borderColor: colors.BLACK_01,
        justifyContent: "center",
        borderRadius: moderateScale(8),
        flexDirection: "row",
        backgroundColor: colors.GREY_250_1,
        justifyContent: "center",
    },
    dateTimeText: {
        fontFamily: fontNames.productSansRegular,
        fontSize: textScale(16),
        color: colors.BLACK_36_1,
        flex: 1,
        paddingLeft: moderateScale(8),
        alignSelf: "center"
    },
    dateTimeIcon: {
        alignSelf: "center",
        marginRight: 8
    }
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
)(CategoryFields)
