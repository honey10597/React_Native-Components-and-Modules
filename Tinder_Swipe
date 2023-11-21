import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import Modal from 'react-native-modal';
import { interpolate, runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import BonkerBonksFilter from '../../Components/BonkerBonksFilter';
import ButtonComp from '../../Components/ButtonComp';
import HomeHeader from '../../Components/HomeHeader';
import { Loader } from '../../Components/Loader';
import WrapperContainer from '../../Components/WrapperContainer';
import strings from '../../constants/Languages';
import imagesPath from '../../constants/imagesPath';
import navigationString from '../../constants/navigationString';
import { matchUserListApi, setBonkersFiltersApi } from '../../redux/reduxActions/homeActions';
import colors from '../../styles/colors';
import commonStyles, { hitSlopProp } from "../../styles/commonStyles";
import { height, moderateScale, width } from '../../styles/responsiveSize';
import { ApiError, ApplyEaseOutAnimation, showError, showSuccess } from '../../utils/helperFunctions';
import { GENDERS, MAX_AGE, MIN_AGE, RELIGION, SEXUALITY } from '../../utils/staticData';
import { ConnectingSocket } from '../../utils/utils';
import TinderView from './TinderView';

const SEND_REQUEST = "_SEND_REQUEST"
const DECLINE_REQUEST = "_DECLINE_REQUEST"

const Home = (props: any) => {

    const { navigation } = props

    const userData = useSelector(state => state?.authReducers?.userData || {})

    const isFocused = useIsFocused()

    const { width: screenWidth } = useWindowDimensions()

    const hiddenTranslateX = 2 * screenWidth
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)

    const [isLoading, setLoading] = useState(true)
    const [updateState, setUpdateState] = useState({ isUpdate: false, type: null })
    const [showFilterModal, setShowFilterModal] = useState(false)

    const [allUsers, setAllUsers] = useState([])
    const [pageNo, setPageNo] = useState(1)
    const [hasMoreData, setHasMoreData] = useState(false)

    const rotate = useDerivedValue(
        () =>
            interpolate(translateX.value, [0, hiddenTranslateX], [0, 45]) + 'deg'
    )

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            ConnectingSocket()
            _hitApiFromStart()
        })
        return unsubscribe;
    }, [])

    const _hitApiFromStart = () => {
        setLoading(true)
        setHasMoreData(false)
        setPageNo(1)
        _getAllUsers(1)
        translateX.value = 0
        translateY.value = 0
    }

    useEffect(() => {
        if (updateState.isUpdate) {
            setTimeout(() => {
                // translateX.value = withTiming(updateState?.type === DECLINE_REQUEST ? -hiddenTranslateX : +hiddenTranslateX, { duration: 0 })
                const _arr = allUsers.map((item) => item)
                const _newArr = _arr.filter((item, index) => index !== 0)
                console.log(_newArr, "_SendRequest", allUsers);
                setAllUsers(_newArr)

                if (_newArr.length === 1 && hasMoreData === true) {
                    setLoading(true)
                    _getAllUsers(pageNo)
                }
            }, 0);
            setTimeout(() => {
                translateX.value = 0
                translateY.value = 0
            }, 0);
            setUpdateState({ isUpdate: false, type: null })
        }
    }, [updateState.isUpdate])

    const _getAllUsers = (pgNo: number, ...args: any) => {
        const apiData = { pageNo: pgNo }

        matchUserListApi(apiData)
            .then((res: any) => {
                ApplyEaseOutAnimation()
                console.log(res?.data, 'matchUserListApi res')
                setLoading(false)
                const _users = res?.data?.data
                if (pgNo === 1) {
                    setAllUsers(_users)
                } else {
                    let existingUsers = allUsers.slice(1, allUsers.length)
                    console.log(allUsers, "qwerty", existingUsers)
                    setAllUsers([...existingUsers, ..._users])
                }
                if (_users?.length < 20) {
                    setHasMoreData(false)
                    return;
                } else {
                    setHasMoreData(true)
                    setPageNo(pageNo + 1)
                    return;
                }
            })
            .catch(error => {
                setHasMoreData(false)
                setLoading(false)
            })
    }

    const _DeclineRequest = (val: any) => {
        translateX.value = withTiming(-hiddenTranslateX, { duration: 400 })
        setTimeout(() => {
            setUpdateState({ isUpdate: true, type: DECLINE_REQUEST })
        }, 400);
    }

    const _SendRequest = (val: any) => {
        translateX.value = withTiming(hiddenTranslateX, { duration: 400 })
        setTimeout(() => {
            setUpdateState({ isUpdate: true, type: SEND_REQUEST })
        }, 400);
    }

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, context) => {
            context.startX = translateX.value
            context.startY = translateY.value
        },
        onActive: (event, context) => {
            translateX.value = context.startX + event.translationX
            translateY.value = context.startY + event.translationY
        },
        onEnd: event => {
            console.log("onActive XXX : " + event.translationX + "\nonActiveYYY : " + event.translationY)
            if (Math.abs(event.translationX) < 150) {
                translateX.value = withSpring(0)
                translateY.value = withSpring(0)
                return
            } else {
                const toLeft = Math.sign(event.translationX)

                if (toLeft === -1) {
                    try {
                        runOnJS(_DeclineRequest)('')
                    } catch (error) {
                    }
                } else {
                    try {
                        runOnJS(_SendRequest)('')
                    } catch (error) {
                    }
                }
            }
        }
    })

    console.log("_SendRequest 111", allUsers);

    const cardAnimationStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: rotate.value },
            // { scale: cardScale.value },
            { translateY: translateY.value },
            { translateX: translateX.value }
        ]
    }))

    const likeStyleAnimation = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, hiddenTranslateX / 5], [0, 1]),
    }))

    const dislikeStyleAnimation = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, -hiddenTranslateX / 5], [0, 1]),
    }))

    const [preferredGenderValue, setPreferredGenderValue] = useState({
        id: userData?.filters?.interested_in || 1,
        name: GENDERS[userData?.filters?.interested_in - 1 || 1],
        isSelected: true
    })
    const [maxDistance, setMaxDistance] = useState(
        userData?.filters?.distance || '0'
    )
    const [age, setAge] = useState([
        userData?.filters?.from_age || MIN_AGE,
        userData?.filters?.to_age || MAX_AGE
    ])
    const [maxHeight, setMaxHeight] = useState(
        userData?.filters?.maximum_height || 60
    )
    const [religion, setReligion] = useState({
        name: userData?.filters?.religion || RELIGION[0]
    })
    const [sexualityValue, setSexualityValue] = useState({
        id: userData?.filters?.sexuality || 1,
        name: SEXUALITY[userData?.filters?.sexuality - 1 || 0],
        isSelected: true
    })

    const RenderFilters = () => {
        return (
            <BonkerBonksFilter
                preferredGenderValue={preferredGenderValue}
                setPreferredGenderValue={(val: any) => setPreferredGenderValue(val)}
                maxDistance={maxDistance}
                setMaxDistance={(val: any) => setMaxDistance(val)}
                age={age}
                setAge={(val: any) => setAge(val)}
                maxHeight={maxHeight}
                setMaxHeight={(val: any) => setMaxHeight(val)}
                religion={religion}
                setReligion={(val: any) => setReligion(val)}
                sexualityValue={sexualityValue}
                setSexualityValue={(val: any) => setSexualityValue(val)}
            />
        )
    }

    const _onSetFilter = () => {
        setLoading(true)
        const apiData = new FormData()
        apiData.append('interested_in', preferredGenderValue?.id || 4)
        apiData.append('distance', maxDistance.toString() || '100')
        apiData.append('from_age', age[0]?.toString() || '18')
        apiData.append('to_age', age[1]?.toString() || '99')
        apiData.append('maximum_height', maxHeight || '7')
        apiData.append('religion', religion?.name || RELIGION[0])
        apiData.append('sexuality', sexualityValue?.id || '1')
        setShowFilterModal(false)
        setBonkersFiltersApi(apiData)
            .then((res: any) => {
                _hitApiFromStart()
                showSuccess(res?.message || 'Success')
            })
            .catch(error => {
                showError(ApiError(error))
                setLoading(false)
            })
    }

    function RenderFilterView() {
        return (
            <Modal isVisible={showFilterModal} style={styles.modalStyle}>
                <View style={styles.modalMainContainer}>
                    <View style={styles.modalContainer}>
                        <View style={styles.headerView}>
                            <TouchableOpacity
                                onPress={() => setShowFilterModal(false)}
                                hitSlop={hitSlopProp}>
                                <Image
                                    source={imagesPath.ic_right_icon}
                                    style={{
                                        transform: [{ rotate: '180deg' }]
                                    }}
                                />
                            </TouchableOpacity>
                            <Text
                                style={{ ...commonStyles.font_16_SemiBold, marginLeft: moderateScale(30) }}>
                                {strings.filters}
                            </Text>
                            <View />
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: moderateScale(40), backgroundColor: colors.white }}>
                            {RenderFilters()}
                        </ScrollView>

                        <ButtonComp
                            onPressBtn={_onSetFilter}
                            btnText={strings.continue}
                            btnStyle={{ marginHorizontal: moderateScale(20) }}
                        />
                    </View>
                </View>
            </Modal>
        )
    }

    const _onReject = () => {
        translateX.value = withTiming(-hiddenTranslateX, { duration: 700 })
        setTimeout(() => {
            setUpdateState({ isUpdate: true, type: DECLINE_REQUEST })
        }, 700);
    }

    const _onAccept = () => {
        translateX.value = withTiming(hiddenTranslateX, { duration: 700 })
        setTimeout(() => {
            setUpdateState({ isUpdate: true, type: SEND_REQUEST })
        }, 700);
    }

    if (Array.isArray(allUsers) && allUsers.length > 0) {
        return (
            <WrapperContainer
                paddingAvailable={false}
            >
                <HomeHeader
                    onPressFilter={() => setShowFilterModal(true)}
                />

                <View style={{ flex: 1 }}>
                    <View style={{ flex: 0.98 }}>
                        {
                            allUsers.map((item, index) => {
                                return (
                                    index === 0 ?
                                        <TinderView
                                            itemData={item}
                                            indexData={index}
                                            gestureHandler={gestureHandler}
                                            cardAnimationStyle={cardAnimationStyle}
                                            likeStyleAnimation={likeStyleAnimation}
                                            dislikeStyleAnimation={dislikeStyleAnimation}
                                            onPressView={() => navigation.navigate(navigationString.VIEWPROFILE, {
                                                prevScreenData: item
                                            })}
                                            OnReject={_onReject}
                                            OnAccept={_onAccept}
                                        />
                                        :
                                        <TinderView
                                            itemData={item}
                                            indexData={index}
                                            onPressView={() => navigation.navigate(navigationString.VIEWPROFILE, {
                                                prevScreenData: item
                                            })}
                                        />
                                )
                            }).reverse()
                        }
                    </View>
                    {RenderFilterView()}
                </View>
                <Loader isLoading={isLoading} />
            </WrapperContainer >
        )
    } else {
        return (
            <WrapperContainer>
                <HomeHeader onPressFilter={() => setShowFilterModal(true)} />
                {!isLoading
                    &&
                    <View
                        style={{
                            flex: 0.95,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Text
                            style={{
                                ...commonStyles.font_16_SemiBold,
                                textAlign: 'center',
                                lineHeight: moderateScale(26)
                            }}>
                            {"Sorry ! There are no users who match your preferences. Experiment with changing your preferences by using filters."}
                        </Text>
                        <ButtonComp
                            btnText={"Change Preferences"}
                            btnStyle={{ width: "70%", marginTop: moderateScale(24) }}
                            onPressBtn={() => setShowFilterModal(true)}
                        />
                    </View>
                }
                {RenderFilterView()}
                <Loader isLoading={isLoading} />
            </WrapperContainer>
        )
    }
}

const styles = StyleSheet.create({
    modalStyle: {
        margin: 0,
        backgroundColor: colors.white
    },
    modalMainContainer: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    modalContainer: {
        borderTopLeftRadius: moderateScale(24),
        borderTopRightRadius: moderateScale(24),
        paddingTop: moderateScale(32),
        paddingBottom: moderateScale(40),
        height: height / 1.1,
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: moderateScale(10),
        justifyContent: 'space-between',
        marginHorizontal: moderateScale(20)
    },

    mainComp: {
        width: width - 20,
        height: height / 1.4,
        alignSelf: "center",
        position: "absolute",
        backgroundColor: colors.black,
        borderRadius: moderateScale(16),
        overflow: "hidden"
    },
    profilePic: {
        width: "100%",
        height: "100%"
    },
    likeCard: {
        width: moderateScale(100),
        height: moderateScale(100),
        position: 'absolute',
        justifyContent: "flex-start",
        alignSelf: "flex-start",
        margin: moderateScale(32),
        zIndex: 1,
        elevation: 1,
    },
    dislikecard: {
        width: moderateScale(100),
        height: moderateScale(100),
        position: 'absolute',
        justifyContent: "flex-end",
        alignSelf: "flex-end",
        margin: moderateScale(32),
        zIndex: 1,
        elevation: 1,
    },
    linearGradientView: {
        width: "100%",
        height: "100%",
        borderRadius: moderateScale(10),
        position: "absolute",
        bottom: 20,
        left: 20,
    }
})

export default Home;
