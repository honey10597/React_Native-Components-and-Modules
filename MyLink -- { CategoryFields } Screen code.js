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
    TouchableOpacityBase
} from 'react-native';
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
        <TouchableOpacity style={{
            ...styles.dateTimeView,
            ...dateTimeExtraStyle
        }}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {
                condition ?
                    <Text style={{
                        ...styles.dateTimeText
                    }}>{value}</Text>
                    :
                    <Text style={{
                        ...styles.dateTimeText,
                        opacity: 0.3
                    }}>{placeHolder}</Text>
            }

            <Image source={rightIcon}
                style={{ ...styles.dateTimeIcon }} />
        </TouchableOpacity>
    )
}

const CategoryFields = props => {

    const netInfo = useSelector(state => state.netInfo)

    const navigation = useNavigation();
    const route = useRoute();
    const [state, setState] = useState({
        categoryId: route.params.data.categoryId || 0,
        subCategoryId: route.params.data.subCategoryId || 0,
        subCategoryName: route.params.data.subCategoryName || "",
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
    const [textInputEditable, setTextInputEditable] = useState(true)
    const [loader, setLoader] = useState(false)
    const [HandleFields, setHandleFields] = useState([])
    const [FieldsDataTypes, setFieldsDataTypes] = useState({})
    const [dropDownHandle, setDropDownHandle] = useState([])
    const [pageCount, setPageCount] = useState(1)
    // const [SelectPhotos, setSelectPhotos] = useState(false)

    useEffect(() => {
        getCatFields(1);
    }, [])

    const checkEmptyObject = (val) => {
        return Object.keys(val).length;
    }

    const getCatFields = (pageCount) => {
        setLoader(true)
        let arr = []
        let { getFields } = props.actions;
        let data = state.categoryId + "&sub_category_id=" + state.subCategoryId;
        getFields(data, pageCount).then(res => {
            setLoader(false)

            console.log(res, "  <<< ====  zzz")
            if (res.statusCode == 200) {
                arr = res.data

                if (!arr.length) {
                    let pageNo = pageCount - 1;
                    setPageCount(pageNo)
                    _moveToNextPage()
                } else {
                    // if (pageCount == 1) {
                    //     setHandleFields(arr)
                    //     setState({ ...state, subCategoryName: res.page_title, pageNo_1_handle: arr })
                    // } else {
                    setHandleFields(arr)
                    setState({ ...state, subCategoryName: res.page_title, })
                    // }

                }

                let arr = []
                for (let val of res.data) {
                    let fields = val.data
                    fields.map((val, i) => {
                        FieldsDataTypes[val.field_name] = (FieldsDataTypes[val.field_name]) ? FieldsDataTypes[val.field_name] : ""
                    })
                }
                // if (pageCount == 1) {
                //     setFieldsDataTypes(...FieldsDataTypes)
                //     setState({ ...state, subCategoryName: res.page_title, pageNo_1: FieldsDataTypes })
                // } else {
                setFieldsDataTypes({ ...FieldsDataTypes })
                setState({ ...state, subCategoryName: res.page_title, })
                console.log(FieldsDataTypes, "zzz");
                // }
                // res.data.map((val, i) => {
                //     let fields = val.data,

                // })
                // let arr = []
                // for (let val of res.data) {
                //     let fields = val.data
                //     let transformedArray = fields.map((val, i) => {
                //         return val.field_name;
                //     })
                //     arr = [...arr, ...transformedArray]
                // }


                // let dropDownFields = [{ ...dropDownHandle }];
                // let dropDownData = []
                // let isEmpty = checkEmptyObject(dropDownFields[0])
                // if (!isEmpty) {
                //     dropDownData = []
                // }
                // res.data.map((val, i) => {
                //     // console.log(dropDownData, "1")
                //     FieldsDataTypes[val.field_name] = ""
                //     if (val.field_datatype == "dropdown") {
                //         var obj = {};
                //         obj["dropdown" + val.field_name] = false;
                //         dropDownData.push(obj);
                //     }
                // })

                // setDropDownHandle(dropDownData)

                // console.log(FieldsDataTypes, "141")
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

        setTextInputEditable(false)
        // let arr = [...dropDownHandle]
        dropDownHandle.map((val, i) => {
            let getKey = Object.keys(val)
            // console.log(val[getKey], "1222")
            if (val[getKey] == true) {
                val[getKey] = false
            }
        })
        let dropDown = [...dropDownHandle]
        console.log(dropDown, " <= 1222")
        if (dropDown[value] == true) {
            dropDown[value] = false
        } else {
            dropDown[value] = true
        }
        setDropDownHandle(dropDown)
    }

    const _updateField = (FieldArray, setFieldArray, fieldName, selectedValue) => {
        // console.log(fieldName, "2222");
        let allFields = FieldArray
        allFields[fieldName] = selectedValue
        setFieldArray({ ...allFields })

        if (fieldName == "title") {
            setState({ ...state, title: selectedValue })
        }
        // console.log(FieldsDataTypes, "xxxxxxxxxxxxx")
    }

    const _onSelectDropDownOption = (value, fieldName, selectedItem) => {
        let dropDown = [...dropDownHandle]
        if (dropDown[value] == true) {
            dropDown[value] = false
        }
        _updateField(FieldsDataTypes, setFieldsDataTypes, fieldName, selectedItem)
        // let allFields = FieldsDataTypes
        // allFields[fieldName] = selectedItem
        // setFieldsDataTypes(allFields)
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
        // let allFields = FieldsDataTypes
        // allFields[fieldName] = day.dateString
        // setFieldsDataTypes({ ...allFields })
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
        // let allFields = FieldsDataTypes
        // allFields[fieldName] = formatDate
        // setFieldsDataTypes(allFields)
        _updateField(FieldsDataTypes, setFieldsDataTypes, fieldName, formatDate)
        setState({
            ...state,
            openDateTimePicker: false,
            openTimePicker: false,
        })
        setTextInputEditable(true)
        // console.log(date + "\n" + fieldName + "\n" + format)
    }

    const _onChangeText = (val, field_name) => {
        // let allFields = FieldsDataTypes
        // allFields[field_name] = val
        // setFieldsDataTypes(allFields)
        _updateField(FieldsDataTypes, setFieldsDataTypes, field_name, val)
    }

    const selectLocation = (fieldName, fieldDataType) => {
        navigation.navigate('GooglePlacesInput', { onNavigationBack: (data) => onNavigationBack(data, fieldName, fieldDataType) })
        Keyboard.dismiss()
    }

    const onNavigationBack = (data, fieldName, fieldDataType) => {
        console.log(data, "hanjii maraaajjjj")

        if (fieldName == "address") {
            setState({ ...state, address: data.formatted_address })
        }

        if (fieldDataType == "google_location" || fieldDataType == "location") {
            let loc = (data && data.geometry && data.geometry.location) ? data.geometry.location : ""
            let fullAddress = {
                formattedAdress: data.formatted_address,
                lat: loc ? data.geometry.location.lat : 30.6668,
                lng: loc ? data.geometry.location.lat : 76.7863,
            }
            _updateField(FieldsDataTypes, setFieldsDataTypes, fieldName, fullAddress)
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

        return (
            <View>
                <CommonHeading
                    text={item.label}
                />
                {
                    textFieldsData.length > 1 ?
                        <FlatList
                            data={textFieldsData}
                            numColumns={textFieldsData.length || 1}
                            key={textFieldsData.length}
                            contentContainerStyle={{
                                flexGrow: 1,
                                paddingBottom: 100,
                            }}
                            extraData={FieldsDataTypes}
                            columnWrapperStyle={{
                                ...commonStyles.flexBetween,
                                ...commonStyles.margin_8_24,
                            }}
                            renderItem={({ item }) =>
                                <View>
                                    {console.log(FieldsDataTypes[item.field_name], "FieldsDataTypes[item.field_name]")}
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
                                                value={FieldsDataTypes[item.field_name] || ""}
                                                maxLength={parseInt(item.max_length)}
                                            /> : <></>
                                    }
                                    {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "date" ?
                                            <View style={{
                                            }}>
                                                {/* <CommonTextInput
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
                                                    }}
                                                    editable={textInputEditable}
                                                    blurOnSubmit={false}
                                                /> */}

                                                <Date_Time_View
                                                    dateTimeExtraStyle={{ width: width / textFieldsDataSize - 30 }}
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
                                                    rightIcon={ImagePath.ic_select_time}
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
                                            <View style={{
                                            }}>
                                                {/* <CommonTextInput
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
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    editable={textInputEditable}
                                                    blurOnSubmit={false}
                                                /> */}
                                                <Date_Time_View
                                                    dateTimeExtraStyle={{ width: width / textFieldsDataSize - 30, }}
                                                    onPress={() => {
                                                        setState({
                                                            ...state,
                                                            openTimePicker: true,
                                                            fieldName: item.field_name,
                                                        })
                                                        setTextInputEditable(false)
                                                    }}
                                                    condition={FieldsDataTypes[item.field_name] || ""}
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    placeHolder={item.field_placeholder || ""}
                                                    rightIcon={ImagePath.ic_select_date}
                                                />

                                                {/* <TouchableOpacity style={{
                                                    ...styles.dateTimeView,
                                                    width: width / textFieldsDataSize - 30,
                                                }}
                                                    onPress={() => {
                                                        setState({
                                                            ...state,
                                                            openTimePicker: true,
                                                            fieldName: item.field_name,
                                                        })
                                                        setTextInputEditable(false)
                                                    }}
                                                    activeOpacity={0.8}
                                                >
                                                    {
                                                        FieldsDataTypes[item.field_name] ?
                                                            <Text style={{
                                                                ...styles.dateTimeText
                                                            }}>{FieldsDataTypes[item.field_name] || ""}</Text>
                                                            :
                                                            <Text style={{
                                                                ...styles.dateTimeText,
                                                                opacity: 0.3
                                                            }}>{item.field_placeholder || ""}</Text>
                                                    }

                                                    <Image source={ImagePath.ic_select_time}
                                                        style={{ ...styles.dateTimeIcon }} />
                                                </TouchableOpacity> */}

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
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                />

                                            </View>
                                            :
                                            <></>
                                    }
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
                                                <CommonTextInput
                                                    mainView={{
                                                        // ...commonStyles.margin_8_24,
                                                        width: width / textFieldsDataSize - 30
                                                    }}
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    placeholder={item.field_placeholder || ""}
                                                    onFocus={() => _openDropDown(item.field_datatype + item.field_name)}
                                                    editable={textInputEditable}
                                                />

                                                {/* <Date_Time_View
                                                    dateTimeExtraStyle={{ width: width / textFieldsDataSize - 30, }}
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    placeholder={item.field_placeholder || ""}
                                                    onPress={() => _openDropDown(item.field_datatype + item.field_name)}
                                                    editable={textInputEditable}
                                                /> */}

                                                {
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
                                                }
                                            </View>
                                            : <></>
                                    }

                                </View>
                            }
                        />
                        :
                        textFieldsData.map((item, idx) => {
                            return (
                                <View>
                                    {
                                        item.field_datatype == "file" ?
                                            // setSelectPhotos(true)
                                            // setState({
                                            //     ...state,
                                            //     SelectPhotos: true
                                            // })
                                            <SelectPhotos
                                                onNavigationBackFile={(data) => {
                                                    _onChangeText(data, item.field_name)
                                                    setState({
                                                        ...state,
                                                        imageHandle: data
                                                    })
                                                }}
                                            />
                                            // <CommonTextInput
                                            //     mainView={{
                                            //         ...commonStyles.margin_8_24,
                                            //         // width: "46%"
                                            //     }}
                                            //     placeholder={item.field_placeholder || ""}
                                            //     onFocus={() => { }}
                                            //     onChangeText={(val) => _onChangeText(val, item.field_name)}
                                            //     returnKeyType="next"
                                            // // blurOnSubmit={false}
                                            // />
                                            : <></>
                                    }
                                    {
                                        item.field_datatype == "string" ?
                                            <CommonTextInput
                                                mainView={{
                                                    ...commonStyles.margin_8_24,
                                                    // width: "46%"
                                                }}
                                                placeholder={item.field_placeholder || ""}
                                                onFocus={() => { }}
                                                onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                returnKeyType="next"
                                                value={FieldsDataTypes[item.field_name] || ""}
                                            // blurOnSubmit={false}
                                            /> : <></>
                                    }
                                    {
                                        item.field_datatype == "integer" ?
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
                                                }}
                                                placeholder={item.field_placeholder || ""}
                                                onFocus={() => selectLocation(fieldName, fieldDataType)}
                                                // onChangeText={(val) => _onChangeText(val, item.field_name)}
                                                multiline={true}
                                                // value={FieldsDataTypes[fieldName].fullAddress.formattedAdress}
                                                value={(FieldsDataTypes[fieldName] && FieldsDataTypes[fieldName].formattedAdress) ? FieldsDataTypes[fieldName].formattedAdress : ""}
                                            // returnKeyType="next"
                                            /> : <></>
                                    }
                                    {
                                        fieldName = item.field_name,
                                        fieldDataType = item.field_datatype,
                                        item.field_datatype == "date" ?
                                            <View style={{
                                            }}>
                                                {/* <CommonTextInput
                                                    rightIcon={ImagePath.ic_select_date}
                                                    mainView={{
                                                        ...commonStyles.margin_8_24,
                                                    }}
                                                    placeholder={item.field_placeholder || ""}
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    onFocus={() => {
                                                        setState({
                                                            ...state,
                                                            openModal: true,
                                                            showCalender: true,
                                                            fieldName: item.field_name,
                                                        })
                                                        setTextInputEditable(false)
                                                    }}
                                                    editable={textInputEditable}
                                                    blurOnSubmit={false}
                                                /> */}

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
                                            <View style={{
                                            }}>
                                                {/* <CommonTextInput
                                                    rightIcon={ImagePath.ic_select_time}
                                                    mainView={{
                                                        ...commonStyles.margin_8_24,
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
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    editable={textInputEditable}
                                                    blurOnSubmit={false}
                                                /> */}
                                                <Date_Time_View
                                                    dateTimeExtraStyle={{ ...commonStyles.margin_8_24, }}
                                                    onPress={() => {
                                                        setState({
                                                            ...state,
                                                            openTimePicker: true,
                                                            fieldName: item.field_name,
                                                        })
                                                        setTextInputEditable(false)
                                                    }}
                                                    condition={FieldsDataTypes[item.field_name] || ""}
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    placeHolder={item.field_placeholder || ""}
                                                    rightIcon={ImagePath.ic_select_time}
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
                                                <CommonTextInput
                                                    mainView={{
                                                        ...commonStyles.margin_8_24
                                                    }}
                                                    value={FieldsDataTypes[item.field_name] || ""}
                                                    placeholder={item.field_placeholder || ""}
                                                    onFocus={() => _openDropDown(item.field_datatype + item.field_name)}
                                                    editable={textInputEditable}
                                                />
                                                {
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
                                                }
                                            </View>
                                            : <></>
                                    }

                                </View>
                            )
                        })
                    // <FlatList
                    //     data={textFieldsData}
                    //     numColumns={textFieldsData.length > 1 ? textFieldsData.length : 0}
                    //     contentContainerStyle={{
                    //         flexGrow: 1,
                    //         paddingBottom: 100,
                    //     }}
                    //     renderItem={({ item }) =>

                    //     }
                    // />
                }
            </View>

            // <View>
            //     {
            //         item.field_datatype == "string" ?
            //             <View style={{
            //             }}>
            //                 <CommonHeading
            //                     text={item.label}
            //                 />
            // <CommonTextInput
            //     mainView={{ ...commonStyles.margin_8_24 }}
            //     placeholder={item.placeholder || ""}
            //     onFocus={() => { }}
            //     onChangeText={(val) => _onChangeText(val, item.field_name)}
            //     returnKeyType="next"
            //     blurOnSubmit={false}
            // />
            //             </View> :
            //             <></>
            //     }
            //     {
            //         item.field_datatype == "location" ?
            //             <View style={{
            //             }}>
            //                 <CommonHeading
            //                     text={item.field_label}
            //                 />
            //                 <CommonTextInput
            //                     mainView={{ ...commonStyles.margin_8_24 }}
            //                     placeholder={item.placeholder || ""}
            //                     onFocus={() => selectLocation(fieldName, fieldDataType)}
            //                     // onChangeText={(val) => _onChangeText(val, item.field_name)}
            //                     multiline={true}
            //                     value={(FieldsDataTypes[fieldName] && FieldsDataTypes[fieldName].formattedAdress) ? FieldsDataTypes[fieldName].formattedAdress : ""}
            //                 // returnKeyType="next"
            //                 />
            //             </View> :
            //             <></>
            //     }
            //     {
            //         item.field_datatype == "google_location" ?
            //             <View style={{
            //             }}>
            //                 <CommonHeading
            //                     text={item.field_label}
            //                 />
            // <CommonTextInput
            //     mainView={{ ...commonStyles.margin_8_24 }}
            //     placeholder={item.placeholder || ""}
            //     onFocus={() => selectLocation(fieldName, fieldDataType)}
            //     // onChangeText={(val) => _onChangeText(val, item.field_name)}
            //     multiline={true}
            //     // value={FieldsDataTypes[fieldName].fullAddress.formattedAdress}
            //     value={(FieldsDataTypes[fieldName] && FieldsDataTypes[fieldName].formattedAdress) ? FieldsDataTypes[fieldName].formattedAdress : ""}
            // // returnKeyType="next"
            // />
            //             </View> :
            //             <></>
            //     }
            //     {
            //         item.field_datatype == "file" ?
            //             <View style={{
            //             }}>
            //                 <CommonHeading
            //                     text={item.field_label}
            //                 />
            //                 {
            //                     FieldsDataTypes[fieldName] == "" ?
            //                         <TouchableOpacity style={{
            //                             ...commonStyles.margin_8_24,
            //                             borderWidth: 1,
            //                             borderColor: colors.GREY_122_1,
            //                             padding: moderateScale(16),
            //                             borderRadius: moderateScale(12),
            //                             justifyContent: "center",
            //                             alignItems: "center"
            //                         }}
            //                             onPress={() => _selectImage(item.field_name)}
            //                         >
            //                             <Text style={{
            //                                 ...commonStyles.fontSize_16_REGULAR
            //                             }}>{strings.selectPicture}</Text>
            //                         </TouchableOpacity>
            //                         :
            //                         <FlatList
            //                             horizontal={true}
            //                             showsHorizontalScrollIndicator={false}
            //                             data={FieldsDataTypes[fieldName]}
            //                             contentContainerStyle={{
            //                                 ...commonStyles.margin_8_16
            //                             }}
            //                             renderItem={({ item }) =>
            //                                 <Image source={{ uri: item.path }} style={{
            //                                     marginLeft: moderateScale(8),
            //                                     height: moderateScale(100),
            //                                     width: moderateScale(100),
            //                                     borderRadius: moderateScale(12)
            //                                 }} />
            //                             }
            //                         />
            //                 }
            //             </View> :
            //             <></>
            //     }
            //     {
            //         item.field_datatype == "integer" ?
            //             <View style={{
            //             }}>
            //                 <CommonHeading
            //                     text={item.field_label}
            //                 />
            //                 <CommonTextInput
            //                     mainView={{ ...commonStyles.margin_8_24 }}
            //                     placeholder={item.placeholder || ""}
            //                     // onFocus={() =>{}}
            //                     onChangeText={(val) => _onChangeText(val, item.field_name)}
            // returnKeyType="done"
            // keyboardType="number-pad"
            //                 />
            //             </View>
            //             : <></>
            //     }
            // {
            //     item.field_datatype == "date" ?
            //         <View style={{
            //         }}>
            //             <CommonHeading
            //                 text={item.field_label}
            //             />
            //             <CommonTextInput
            //                 mainView={{ ...commonStyles.margin_8_24 }}
            //                 placeholder={item.placeholder || ""}
            //                 value={FieldsDataTypes[fieldName]}
            //                 onFocus={() => {
            //                     setState({
            //                         ...state,
            //                         openModal: true,
            //                         showCalender: true,
            //                         fieldName: item.field_name,
            //                     })
            //                     setTextInputEditable(false)
            //                 }
            //                 }
            //                 editable={textInputEditable}
            //             />
            //             {
            //                 <CalenderPicker
            //                     isVisible={state.openModal}
            //                     onBackButtonPress={() => closeModal()}
            //                     onBackdropPress={() => closeModal()}
            //                     current={state.date}
            //                     minDate={new Date()}
            //                     isShowCalender={state.showCalender}
            //                     onDayPress={(day) => _onSelectDate(day, state.fieldName, "LL")}
            //                     markedDates={{
            //                         [FieldsDataTypes[fieldName]]: { selected: true },
            //                     }}
            //                 />
            //             }
            //         </View>
            //         : <></>
            // }
            //     {
            //         item.field_datatype == "date_time" ?
            //             <View style={{
            //             }}>
            //                 <CommonHeading
            //                     text={item.field_label}
            //                 />
            //                 <CommonTextInput
            //                     mainView={{ ...commonStyles.margin_8_24 }}
            //                     placeholder={item.placeholder || ""}
            //                     onFocus={() => {
            //                         // console.log(index, "  <---")
            //                         setState({
            //                             ...state,
            //                             fieldName: item.field_name,
            //                             openDateTimePicker: true,
            //                         })
            //                         setTextInputEditable(false)
            //                     }}
            //                     value={FieldsDataTypes[fieldName]}
            //                     editable={textInputEditable}
            //                 />

            //                 <DateTimePickerModal
            //                     isVisible={state.openDateTimePicker}
            //                     mode="datetime"
            //                     // datePickerModeAndroid="spinner"
            //                     onConfirm={(date) => _onSelectDateTime(date, state.fieldName, "LLL")}
            //                     onCancel={() => {
            //                         setState({
            //                             ...state,
            //                             openDateTimePicker: false,
            //                         })
            //                         setTextInputEditable(true)
            //                     }}
            //                 />
            //             </View>
            //             :
            //             <></>
            //     }
            // {
            //     item.field_datatype == "time" ?
            //         <View style={{
            //         }}>
            //             <CommonHeading
            //                 text={item.field_label}
            //             />
            //             <CommonTextInput
            //                 mainView={{ ...commonStyles.margin_8_24 }}
            //                 placeholder={item.placeholder || ""}
            //                 onFocus={() => {
            //                     setState({
            //                         ...state,
            //                         openTimePicker: true,
            //                         fieldName: item.field_name,
            //                     })
            //                     setTextInputEditable(false)
            //                 }}
            //                 value={FieldsDataTypes[fieldName]}
            //                 editable={textInputEditable}
            //             />

            //             <DateTimePickerModal
            //                 isVisible={state.openTimePicker}
            //                 mode="time"
            //                 // datePickerModeAndroid="spinner"
            //                 onConfirm={(date) => _onSelectDateTime(date, state.fieldName, "LT")}
            //                 onCancel={() => {
            //                     setState({
            //                         ...state,
            //                         openTimePicker: false,
            //                     })
            //                     setTextInputEditable(true)
            //                 }}
            //             />

            //         </View>
            //         :
            //         <></>
            // }
            //     {
            //         item.field_datatype == "dropdown" ?
            //             <View style={{
            //                 zindex: 1,
            //                 flex: 1
            //             }}>
            // <CommonHeading
            //     text={item.field_label}
            // />
            //                 <CommonTextInput
            //                     mainView={{
            //                         ...commonStyles.margin_8_24
            //                     }}
            //                     value={FieldsDataTypes[fieldName]}
            //                     placeholder={item.placeholder || ""}
            //                     onFocus={() => _openDropDown(item.field_datatype + item.field_name)}
            //                     editable={textInputEditable}
            //                 />
            //                 {
            //                     dropDownHandle[dropDownName] ?
            //                         <View style={{
            //                             // position: 'absolute',
            //                             zindex: 11,
            //                             justifyContent: "center",
            //                             alignItems: "center"
            //                             // right: 48,
            //                             // top: 60,
            //                             // right: 8,
            //                         }}>
            //                             <MorePopup
            //                                 isModalVisible={state.openDropDown}
            //                                 moreList={item.field_options}
            //                                 action={(selectedItem) => _onSelectDropDownOption("dropdown" + item.field_name, item.field_name, selectedItem)}
            //                                 onBackDrop={() => { }}
            //                             />
            //                         </View> : <></>
            //                 }
            //             </View>
            //             : <></>
            //     }
            // </View>

        )
    }

    const _onPressUpdate = (count) => {
        console.log(FieldsDataTypes, "get cat fields");

        let flag = false
        let arr = Object.keys(FieldsDataTypes)
        arr.map((val, i) => {
            console.log(FieldsDataTypes[val], "xxxxxxxxxxxxxxxxxxxxx");
            if (FieldsDataTypes[val] == "") {
                flag = true
            }
        })

        if (flag) {
            showError(strings.fieldsMustNotBeEmpty);
        } else {
            getCatFields(count)
        }

    }

    const _openPressBack = () => {
        console.log(pageCount, " pageCount");
        if (pageCount <= 1) {
            props.navigation.goBack()
        } else {
            let count = pageCount - 1
            setPageCount(count)

            let arr = Object.keys(FieldsDataTypes)
            arr.map((val, i) => {


                if (FieldsDataTypes[val] == "") {
                    console.log(FieldsDataTypes[val], "lklkllkl");
                    delete FieldsDataTypes[val];
                } else {
                    _updateField(FieldsDataTypes, setFieldsDataTypes, val, FieldsDataTypes[val])
                }
            })
            // setHandleFields(state.pageNo_1_handle)
            // setFieldsDataTypes(state.pageNo_1)

            console.log(FieldsDataTypes, "HandleFieldsHandleFieldsHandleFields", state.pageNo_1)
            // _onPressUpdate(count)
            getCatFields(count)
        }
    }

    const _moveToNextPage = () => {

        let payload = {
            product_details: FieldsDataTypes,
            images: state.imageHandle,
            categoryId: state.categoryId,
            subCategoryId: state.subCategoryId,
            address: state.address,
            title: state.title
        }
        props.navigation.navigate("setPrice", {
            data: payload
        })

        // let flag = false
        // let arr = Object.keys(FieldsDataTypes)
        // arr.map((val, i) => {
        //     if (FieldsDataTypes[val] == "") {
        //         flag = true
        //     }
        // })

        // if (flag == false) {
        //     props.navigation.navigate("setPrice", {
        //         data: payload
        //     })
        // } else {
        //     showError(strings.fieldsMustNotBeEmpty);
        // }
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.COMMON_THEME_COLOR, }}>

            <SimpleHeader
                leftImage={ImagePath.ic_back_white}
                onPressLeft={_openPressBack}
                leftSubText={state.subCategoryName}
                rightButtonText={state.subCategoryName.toLowerCase() == "upload photos" ? strings.Next : ""}
                onPressRightButton={() => {
                    Keyboard.dismiss()
                    let count = pageCount + 1
                    setPageCount(count),
                        _onPressUpdate(count)
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : ""}
                // behavior="padding"
                contentContainerStyle={{ flexGrow: 1 }}
                style={{ ...commonStyles.keyboardAvoidingViewStyle, }}>
                {/* <ScrollView
                    // style={{
                    //     ...styles.subView
                    // }}
                    showsVerticalScrollIndicator={false}
                    style={{ paddingBottom: moderateScale(40) }}
                    keyboardShouldPersistTaps={"always"}
                > */}
                {/* <View style={{
                    flex: 1,
                }}> */}
                <ImageBackground
                    source={ImagePath.white_dot_bg}
                    style={{
                        flex: 1,
                        resizeMode: "cover",
                    }}>
                    {
                        JSON.stringify(HandleFields) != "[]" ?
                            HandleFields.map((item, indexedDB) => {
                                return _renderFlatList(item, indexedDB)
                            })
                            :
                            <NoDataFound />
                    }
                    {/* {
                        state.SelectPhotos ?
                            <SelectPhotos
                            /> : <></>
                    } */}
                </ImageBackground>
                {/* </View> */}
                {/* </ScrollView> */}
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
                                            let count = pageCount + 1
                                            setPageCount(count),
                                                _onPressUpdate(count)
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
