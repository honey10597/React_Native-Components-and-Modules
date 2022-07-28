import React from 'react';
import { StyleSheet, View, Platform, TouchableOpacity, Image, Text } from 'react-native';
import { moderateScale, textScale, width } from '../styles/responsiveSize';
import colors from '../styles/colors';
import imagePath from '../constants/imagePath';
import { ApplyEaseOutAnimation, InitAnimation } from '../utils/helperFunctions';
import commonStyles from '../styles/commonStyles';



InitAnimation()

const CustomTabbar = ({ state, descriptors, navigation }) => {
    const _renderActive = (image) => {
        return (
            <TouchableOpacity
                style={{
                    backgroundColor: "#D60A19",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: moderateScale(80),
                    width: width / 5
                }}
                activeOpacity={0.9}
            >
                <View style={{ justifyContent: "space-between" }}>
                    <View
                        style={{
                            width: width / 5,
                            height: moderateScale(40),
                            backgroundColor: "white",
                        }}
                    />
                    <View
                        style={{
                            // width: width / 5,
                            height: moderateScale(40),
                            backgroundColor: "#D60A19",
                        }}
                    />

                    <View style={{
                        backgroundColor: "#D60A19",
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        height: width / 5,
                        width: width / 5,
                        borderWidth: moderateScale(8),
                        borderRadius: (width / 5) / 2,
                        borderColor: colors.white,
                        position: "absolute",
                        overflow: "hidden",
                        bottom: moderateScale(10),
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.6,
                        shadowRadius: 8,
                        elevation: 2,
                    }}>
                        <Image
                            source={image}
                            style={{
                                height: moderateScale(26),
                                width: moderateScale(26),
                            }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "white",
        }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const image =
                    index == 0
                        ? isFocused
                            ? imagePath.activeHome
                            :
                            imagePath.inActiveHome
                        : index == 1
                            ? isFocused
                                ? imagePath.activeGroup
                                :
                                imagePath.inActiveGroup
                            : index == 2
                                ? isFocused
                                    ? imagePath.activeMatch
                                    :
                                    imagePath.inActiveMatch
                                :
                                index == 3
                                    ? isFocused
                                        ? imagePath.activeChat
                                        :
                                        imagePath.inActiveChat
                                    : index == 4
                                        ? isFocused
                                            ? imagePath.activeProfile
                                            :
                                            imagePath.inActiveProfile
                                        : '';

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        // canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate({ name: route.name, merge: true });
                    }
                };

                let activeIndex = state.index

                if (isFocused == true) {
                    activeIndex = isFocused ? index : -1
                }
                return (
                    isFocused ?
                        _renderActive(image)
                        :
                        <TouchableOpacity
                            onPress={onPress}
                            style={{
                                backgroundColor: "#D60A19",
                                justifyContent: "center",
                                alignItems: "center",
                                alignSelf: "flex-end",
                                height: moderateScale(76),
                                width: width / 5,
                                borderTopRightRadius: activeIndex - index == 1 ? moderateScale(26) : 0,
                                borderTopLeftRadius: index == activeIndex + 1 ? moderateScale(26) : 0,
                            }}
                            activeOpacity={0.9}
                        >
                            <Image
                                source={image}
                            />

                            <Text
                                style={{
                                    ...commonStyles.fontSize11,
                                    color: colors.white,
                                    marginVertical: moderateScale(2),
                                    fontSize: textScale(12)
                                }}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                );
            })}
        </View >
    );
};

export default React.memo(CustomTabbar);

