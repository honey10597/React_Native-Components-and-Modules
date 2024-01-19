import React, { useEffect, useState } from 'react'
import {
  View,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView
} from 'react-native'
import Animated from 'react-native-reanimated'
import {
  TabView,
  SceneMap,
  TabBar,
  TabBarIndicator
} from 'react-native-tab-view'
import BottomSheet from '@gorhom/bottom-sheet'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { useStripe, PaymentSheetError } from '@stripe/stripe-react-native'

import imagesPath from '../../constants/imagesPath'

import ButtonComp from '../../Components/ButtonComp'

import { moderateScale, width } from '../../styles/responsiveSize'
import commonStyles from '../../styles/commonStyles'
import colors from '../../styles/colors'
import styles from './styles'

import {
  BasicPackage,
  BluePackage,
  CrystalPackage,
  PinkPackage,
  getPackageData,
  getPackageName,
  getTabBarColor,
  getTabBarPrice
} from '../../utils/subscriptionHelpers'
import { stripeEndpointApi } from '../../redux/reduxActions/profileActions'
import { Loader } from '../../Components/Loader'
import { buyStripe, buySubscription } from '../../redux/reduxActions/authActions'
import navigationString from '../../constants/navigationString'
import { ApiError, ApplyEaseOutAnimation, showError } from '../../utils/helperFunctions'
import PaymentScreen from '../../Components/PaymentScreen'

const ROUTES = [
  { key: 'first', title: 'Basic' },
  { key: 'second', title: 'Blue' },
  { key: 'third', title: 'Pink' },
  { key: 'fourth', title: 'Crystal' }
]

const StripeSubscriptionScreen = ({ navigation, route }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe()
  const userData = useSelector(state => state?.authReducers?.userData || {})

  console.log(userData, 'userDatauserDatauserData')

  const snapPoints = React.useMemo(() => ['60%', '90%'], [])
  const bottomSheetRef = React.useRef(null)

  const [state, setState] = React.useState({
    index: 0,
    routes: ROUTES,
    position: new Animated.Value(1)
  })
  const [packageData, setPackageData] = React.useState([])
  const [selectedIndex, setSelectedIndex] = React.useState(1)
  const [currentPlan, setCurrentPlan] = React.useState(null)
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState()

  const fetchPaymentSheetParams = async priceText => {
    let amount = priceText.replace(/\D/g, '')
    amount = Number(amount)
    const apiData = { amount }

    try {
      const response = await stripeEndpointApi(apiData)

      console.log(response, 'responseresponseresponse')

      const { paymentIntent, ephemeralKey, customer } = await response?.data
      setClientSecret(paymentIntent)
      return {
        paymentIntent,
        ephemeralKey,
        customer
      }
    } catch (error) {
      showError(ApiError(error))
      setInitializingSheet(false)
    }
  }

  console.log(clientSecret, 'client secret====>>>>>>>>>>>.')

  useEffect(() => {
    if (paymentSheetEnabled && clientSecret) {
      openPaymentSheet()
    }
  }, [clientSecret, paymentSheetEnabled])

  const openPaymentSheet = async () => {
    setLoading(true)
    console.log('payment sheet called', clientSecret)
    if (!clientSecret) {
      return
    }
    const { error } = await presentPaymentSheet()

    if (!error) {
      setLoading(false)
      onPressBuy()
    } else {
      setLoading(false)
      switch (error.code) {
        case PaymentSheetError.Failed:
          Alert.alert(
            `PaymentSheet present failed with error code: ${error.code}`,
            error.message
          )
          setPaymentSheetEnabled(false)
          break
        case PaymentSheetError.Canceled:
          Alert.alert(
            `PaymentSheet present was canceled with code: ${error.code}`,
            error.message
          )
          break
        case PaymentSheetError.Timeout:
          Alert.alert(
            `PaymentSheet present timed out: ${error.code}`,
            error.message
          )
          break
      }
    }
    // setLoading(false)
  }

  const initialisePaymentSheet = async (price, selectedIndex) => {
    setInitializingSheet(true)
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams(price)

    console.log(paymentIntent, 'ddfdasdasadsads')

    const address = {
      city: userData?.city || 'San Francisco',
      country: userData?.country || 'GB',
      line1: '' || '510 Townsend St.',
      line2: '' || '123 Street',
      postalCode: '' || '94102',
      state: userData?.city || 'California'
    }
    const billingDetails = {
      name: userData?.name || 'Bonkers',
      email: userData?.email || 'jay@bonkersapp.com',
      phone: userData?.phone_number || '555-555-555',
      address
    }

    const appearance = {
      shapes: {
        borderRadius: moderateScale(14),
        borderWidth: 0.5
      },
      primaryButton: {
        shapes: {
          borderRadius: moderateScale(14)
        }
      },
      colors: {
        primary: colors.themecolor2,
        background: colors.darkBlack,
        componentBackground: colors.darkBlack,
        componentBorder: colors.likePink,
        componentDivider: colors.likePink,
        primaryText: colors.white,
        secondaryText: colors.grey12,
        componentText: colors.white,
        placeholderText: colors.lightWhite,
        icon: colors.white,
        error: colors.lightRed
      }
    }

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      customFlow: false,
      merchantDisplayName: 'Example Inc.',
      applePay: { merchantCountryCode: 'GB' },
      style: 'automatic',
      googlePay: {
        merchantCountryCode: 'GB',
        testEnv: true
      },
      returnURL: 'stripe-example://stripe-redirect',
      defaultBillingDetails: billingDetails,
      defaultShippingDetails: billingDetails,
      allowsDelayedPaymentMethods: true,
      appearance,
      primaryButtonLabel: 'Purchase'
    })
    if (!error) {
      setInitializingSheet(false)
      setPaymentSheetEnabled(true)
    } else if (error.code === PaymentSheetError.Failed) {
      setInitializingSheet(false)
      Alert.alert(
        `PaymentSheet init failed with error code: ${error.code}`,
        error.message
      )
    } else if (error.code === PaymentSheetError.Canceled) {
      setInitializingSheet(false)
      Alert.alert(
        `PaymentSheet init was canceled with code: ${error.code}`,
        error.message
      )
    }
  }

  React.useEffect(() => {
    if (userData?.subscription?.subscription_id) {
      setState({ ...state, index: userData?.subscription?.subscription_id - 1 })
    }
  }, [userData?.subscription?.subscription_id])

  React.useEffect(() => {
    setCurrentPlan(getPackageName(state.index))
    setPackageData(getPackageData(state.index))
    if (state.index === 0) {
      bottomSheetRef?.current?.close()
    }
  }, [state.index])

  const _renderScene = ({ item, index }) => {
    console.log(item, 'asasdsdasad')
    return (
      <ImageBackground
        source={
          index === 1
            ? imagesPath.ic_blue
            : index === 2
              ? imagesPath.ic_pink
              : index === 3
                ? imagesPath.ic_crystal
                : null
        }
        borderRadius={moderateScale(8)}
        style={{
          backgroundColor: index === 0 ? colors.whiteOpacity70 : 'transparent',
          marginLeft: moderateScale(24),
          padding: moderateScale(20),
          width: width - moderateScale(90),
          marginTop: moderateScale(24),
          borderRadius: moderateScale(8)
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
          <Text style={{ ...commonStyles.font_16_bold, color: colors.black }}>
            {index === 0
              ? 'Basic'
              : index === 1
                ? 'Blue'
                : index === 2
                  ? 'Pink'
                  : 'Crystal'}
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {index === 0
            ? BasicPackage()
            : index === 1
              ? BluePackage(index)
              : index === 2
                ? PinkPackage(index)
                : CrystalPackage(index)}
        </ScrollView>
        <View
          style={{
            height: 1,
            backgroundColor: colors.blackOpacity20,
            marginBottom: moderateScale(12)
          }}
        />
        {index !== 0 ? (

          (userData?.subscription?.subscription_id === index + 1
            ? <ButtonComp
              btnText={'Current Plan'}
              // disabled={state.index === 0}
              onPressBtn={() => {
                alert('You have already subscribed to this plan. Please check other plans.')
                return
                bottomSheetRef?.current?.snapToIndex(0)
                setState({ ...state, index })
              }}
              txtStyle={{ ...commonStyles.font_12_bold }}
              btnView={{
                backgroundColor: colors.darkBlack,
                height: moderateScale(42)
              }}
            />
            : <ButtonComp
              btnText={'Get Plan'}
              // disabled={state.index === 0}
              onPressBtn={() => {
                bottomSheetRef?.current?.snapToIndex(0)
                setState({ ...state, index })
              }}
              txtStyle={{ ...commonStyles.font_12_bold }}
              btnView={{
                backgroundColor: colors.darkBlack,
                height: moderateScale(42)
              }}
            />)
          // <ButtonComp
          //   btnText={'Get Plan'}
          //   // disabled={state.index === 0}
          //   onPressBtn={() => {
          //     alert(index)
          //     return
          //     bottomSheetRef?.current?.snapToIndex(0)
          //     setState({ ...state, index })
          //   }}
          //   txtStyle={{ ...commonStyles.font_12_bold }}
          //   btnView={{
          //     backgroundColor: colors.darkBlack,
          //     height: moderateScale(42)
          //   }}
          // />
        ) : (
          <ButtonComp
            btnText={'Free Plan'}
            txtStyle={{ ...commonStyles.font_12_bold }}
            btnView={{
              backgroundColor: colors.darkBlack,
              height: moderateScale(42)
            }}
          />
        )}
        {/* )} */}
      </ImageBackground>
    )
  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        disabled={initializingSheet}
        style={{
          ...styles.cardStyle,
          borderColor:
            index === selectedIndex
              ? getTabBarColor(state.index)
              : colors.whiteOpacity20
        }}
        activeOpacity={0.8}
        onPress={() => {
          setSelectedIndex(index)
        }}>
        {index === selectedIndex && item?.month === '12 Months'
          ? (
            <View style={styles.absoluteTextStyle}>
              <Text style={styles.offerText(state)}>Best Offer</Text>
            </View>
          )
          : null}
        <Text style={styles.monthText(state)}>{item?.month}</Text>
        <Text style={{ ...commonStyles.font_16_SemiBold }}>{item?.price}</Text>
      </TouchableOpacity>
    )
  }

  const [initializingSheet, setInitializingSheet] = React.useState(false)

  const onPressBuy = async () => {
    setLoading(true)
    bottomSheetRef?.current?.close()
    const apiData = {
      subscription_id: state?.index + 1,
      subscription_type: packageData[selectedIndex]?.month,
      amount: packageData[selectedIndex]?.price.replace(/\D/g, '')
    }
    buyStripe(apiData)
      .then(res => {
        setLoading(false)
        console.log(res, 'sub plan ====>>>>>>>>>')
        navigation.navigate(navigationString.CONGRATS_SCREEN)
      })
      .catch(err => {
        setLoading(false)
        console.log(err, 'sub plan ====>>>>>>>>>')
      })
  }

  return (
    <PaymentScreen>
      <ImageBackground source={imagesPath.subscription} style={{ flex: 1 }}>
        <SafeAreaView />
        <View style={{ flexDirection: 'row' }}>
          {route?.params?.isBack && (
            <TouchableOpacity
              style={styles.crossBtn}
              onPress={() => navigation.goBack()}>
              <Image
                source={imagesPath.ic_cross}
                style={{ tintColor: colors.black }}
              />
            </TouchableOpacity>
          )}
          <View
            style={{
              ...styles.logoView,
              width: route?.params?.isBack ? '72%' : '100%'
            }}>
            <View style={styles.logoStyle}>
              <Image
                source={
                  userData?.user_type === 2
                    ? imagesPath.ic_logobonk
                    : imagesPath.ic_logobonkers
                }
                style={styles.appLogoStyle}
              />
            </View>
          </View>
        </View>
        <View style={styles.tabContainer}>
          <FlatList
            data={[{}, {}, {}, {}]}
            renderItem={_renderScene}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: moderateScale(20) }}
          />
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              marginVertical: moderateScale(32),
              marginTop: moderateScale(40)
            }}>
            <Text
              style={{
                ...commonStyles.font_14_medium,
                color: colors.black,
                textDecorationLine: 'underline'
              }}>
              {/* Cancel Subscription */}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetStyle}
        handleIndicatorStyle={{ backgroundColor: '#1A1A1A' }}>
        <View style={styles.bottomSheetView}>
          <View style={styles.logoStyleView}>
            <Image
              source={
                userData?.user_type === 2
                  ? imagesPath.ic_logobonk
                  : imagesPath.ic_logobonkers
              }
              style={styles.appLogoStyle}
            />
          </View>
          <Text style={styles.currentPlanText}>{currentPlan}</Text>
          <FlatList
            data={packageData}
            numColumns={3}
            renderItem={renderItem}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingTop: moderateScale(32) }}
          />
          <Text style={styles.bottomSheetNameText}>
            {/* {`My name is ${userData?.full_name} and I enjoy meeting new people and finding ways to help them have an uplifting experience. I enjoy reading..`} */}
            {'Upgrade your subscription plan today to gain even more features in the safest new dating app Bonkers.'}
          </Text>
          <ButtonComp
            btnText={`Buy for ${packageData[selectedIndex]?.price}`}
            btnView={styles.bottomSheetBtn(state.index)}
            loading={initializingSheet}
            onPressBtn={() =>
              initialisePaymentSheet(
                packageData[selectedIndex]?.price,
                selectedIndex
              )
            }
          />
        </View>
      </BottomSheet>
      <Loader isLoading={loading} />
    </PaymentScreen>
  )
}

export default StripeSubscriptionScreen
