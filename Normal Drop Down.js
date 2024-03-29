import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Pressable, Modal, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import imagePath from '../constants/imagePath';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import commonStyles from '../styles/commonStyles';
const { width, height } = Dimensions.get('window');


const NormalDropDown = ({
    data,
    value,
    onPressItem,
    placeholder,
    isRequired = false,
    paddock,
    editable,
    tagId = ""
}) => {

    const [showOptions, setShowOptions] = useState(false);
    console.log(data);
    const valueHandler = (data) => {
        setShowOptions(false)
        onPressItem(data)
    }
    const modalHandler = () => {
        return (<Modal
            onRequestClose={() => setShowOptions(false)}
            transparent={true}
            visible={showOptions}
            animationType={'slide'}
        >
            <TouchableOpacity
                onPress={() => setShowOptions(false)}
                style={styles.modalCont}>
                {renderDorpDownData()}
            </TouchableOpacity>
        </Modal>)
    }


    const renderDorpDownData = () => {
        return (
            <View style={[styles.mainDataCont]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        minWidth: '50%'
                    }}>
                    {data.map((x, i) => {
                        console.log(x);
                        return (
                            <View style={{ zIndex: 99999, width: '100%' }} key={i}>
                                <TouchableOpacity onPress={() => paddock ? valueHandler(x) : valueHandler(x.value)} style={[styles.datCont, {
                                    borderBottomWidth: (data.length - 1) == i ? 2 : 0
                                }]}>
                                    <Text style={styles.dataTxt}>{x.value}
                                        {/* (#{x.tag_number}) */}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })}


                </ScrollView>
            </View >
        )
    }
    return (
        <View>
            <Pressable onPress={() => {
                Keyboard.dismiss();
                editable == false ? setShowOptions(false) : setShowOptions(!showOptions)
            }}
                style={editable == false ? [styles.container, { backgroundColor: colors.blackOpacity10 }] : styles.container}>
                <View>

                    {!!value ? <Text style={{ ...commonStyles.fontSize13 }}>{value}  {tagId.length > 0 && `(#${tagId})`}</Text>
                        : <Text style={{
                            ...commonStyles.fontSize13,
                            color: colors.blackOpacity44
                        }}>{`${placeholder} ${isRequired ? '*' : ''} `}</Text>
                    }

                </View>
                <View>
                    <Image source={imagePath.icDropDown2} />
                </View>
            </Pressable>
            <View style={{
                alignItems: 'center'
            }}>
                {modalHandler()}
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: moderateScale(8),
        alignItems: 'center',
        borderRadius: 4,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.textInpuBorderColor,
        marginBottom: moderateScaleVertical(16),
        height: moderateScale(42)

    },
    txt: {
        ...commonStyles.fontSize13,
        zIndex: 0,
        textAlign: 'center',
        fontFamily: fontFamily.regularRoboto,
        fontSize: 16,
        color: colors.blackColor
    },
    dataTxt: {
        ...commonStyles.fontSize13,
        zIndex: 999999,
        textAlign: 'center',
        fontFamily: fontFamily.regular,
        fontSize: 12,
        width: '100%',
        color: colors.blackColor
    },
    datCont: {
        alignItems: 'center',
        paddingVertical: 10,
        width: '100%',
        backgroundColor: colors.whiteColor,
        borderColor: colors.blackOpacity40,
        borderWidth: 2,
        borderBottomWidth: 0,
        paddingHorizontal: 16
    },
    mainDataCont: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 5,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 350,

    },
    modalCont: {
        width: width,
        height: height,
        borderColor: colors.textInpuBorderColor,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    }

});

export default NormalDropDown;


