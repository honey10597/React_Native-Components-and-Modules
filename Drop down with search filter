import React, { useState } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    FlatList
} from 'react-native';
import Modal from "react-native-modal";

import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import { height, moderateScale, width } from '../styles/responsiveSize';
// import TextInputWithLabel from './TextInputWithLabel';
import imagePath from '../constants/imagePath';
import CustomInputWithBorder from './CustomInputWithBorder';

const DropDownModal = ({
    data,
    isVisible,
    onSelect,
    onPressBack,
    showSearchBar = true
}) => {
    const [masterData, setMasterData] = useState(data?.data)

    const onPressValue = (item, index) => {
        onSelect(data?.dropDownType, item)
    }

    const _searchFilterFunction = (text) => {
        if (text) {
            const newData = data.data.filter((item) => {
                // const itemData = item.label ? item.label.toUpperCase() : ''.toUpperCase();
                const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setMasterData(newData);
        } else {
            setMasterData(data?.data)
        }
    };

    const _renderList = ({ item, index }) => {
        return (
            <TouchableOpacity style={{
                backgroundColor: colors.whiteColor,
                paddingVertical: moderateScale(8),
                marginHorizontal: moderateScale(16),
                borderBottomWidth: 1,
                borderColor: colors.borderColor,
                alignItems: "flex-start"
            }}
                onPress={() => onPressValue(item, index)}
                activeOpacity={0.8}
            >
                <Text style={{
                    ...commonStyles.font_14_medium,
                    textAlign: "left",
                    marginStart: moderateScale(4),
                    marginVertical: moderateScale(4)
                }}>{item?.label || item?.name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <Modal
            isVisible={isVisible}
            onBackButtonPress={onPressBack}
            onBackdropPress={onPressBack}
            style={{ marginTop: moderateScale(100), marginBottom: moderateScale(24), }}
        >
            <View style={{
                marginVertical: moderateScale(80),
                backgroundColor: "white",
                borderRadius: moderateScale(2),
            }}>

                {data?.label ?
                    <View style={{
                        backgroundColor: colors.grey_151_015,
                        alignSelf: "center",
                        alignItems: "center",
                        paddingVertical: moderateScale(10),
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: moderateScale(16)
                    }}>

                        <View />

                        <Text style={{
                            ...commonStyles.font_16_Bold,
                            color: colors.blackColor,
                            textTransform: "uppercase"
                        }}>{data?.label}</Text>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={onPressBack}
                        >
                            <Image
                                source={imagePath.ic_cross_close}
                                style={{
                                    height: moderateScale(24),
                                    width: moderateScale(24),
                                    tintColor: colors.greyBlack
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                    :
                    <></>}

                {showSearchBar ?
                    <View style={{
                        marginHorizontal: moderateScale(16),
                    }}>
                        {/* <TextInputWithLabel
                            mainViewStyle={{
                                width: "75%",
                                backgroundColor: colors.whiteColor,
                                alignSelf: "center",
                                marginVertical: moderateScale(4),
                            }}
                            maxLength={30}
                            mainSubView={{ borderWidth: 0 }}
                            inputStyle={{ ...commonStyles.font_16_medium, height: moderateScale(38) }}
                            placeholder={strings.searchHere}
                            onChangeText={_searchFilterFunction}
                        /> */}

                        <CustomInputWithBorder
                            inputViewStyle={{ marginTop: moderateScale(4) }}
                            inputStyle={{ fontSize: moderateScale(16), }}
                            placeholder={"Search here..."}
                            maxLength={30}
                            onChangeText={_searchFilterFunction}
                            rightIcon={imagePath.search}
                        />

                    </View>
                    : <></>
                }

                <FlatList
                    data={masterData}
                    extraData={masterData}
                    renderItem={_renderList}
                    keyboardShouldPersistTaps={"always"}
                    ListFooterComponent={<View style={{ marginVertical: moderateScale(72) }} />}
                />
            </View>
        </Modal>
    )
}


export default DropDownModal;
