import React, { useEffect, useState } from 'react'
import {
  View,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  ScrollView
} from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import imagesPath from '../../constants/imagesPath'
import ButtonComp from '../../Components/ButtonComp'
import { moderateScale, width } from '../../styles/responsiveSize'
import commonStyles from '../../styles/commonStyles'
import colors from '../../styles/colors'
import styles from './styles'
import {
  BluePackage,
  CrystalPackage,
  PinkPackage,
  getTabBarColor
} from '../../utils/subscriptionHelpers'
import {
  clearTransactionIOS,
  flushFailedPurchasesCachedAsPendingAndroid,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestSubscription,
  useIAP
} from 'react-native-iap'
import { subscriptionSkus } from '../../constants/inAppStoreSku'
import { Loader } from '../../Components/Loader'
import { buySubscription } from '../../redux/reduxActions/authActions'
import navigationString from '../../constants/navigationString'

const SubscriptionScreen = ({ navigation, route }) => {
  let purchaseUpdate = null
  let purchaseError = null

  const {
    connected,
    subscriptions,
    getSubscriptions,
    currentPurchase,
    finishTransaction
  } = useIAP()

  const [isLoading, setIsLoading] = useState(true)
  const [ownedSubscriptions, setOwnedSubscriptions] = useState([])
  const [receipt, setReceipt] = useState('')
  const [btnHeight, setBtnHeight] = useState(50)

  console.log(receipt, 'hello receipt data -->>>>>>', ownedSubscriptions)

  useEffect(() => {
    (async () => {
      if (connected) {
        handleGetSubscriptions()
        if (Platform.OS === 'android') {
          await flushFailedPurchasesCachedAsPendingAndroid()
        } else {
          await clearTransactionIOS()
        }
      }
    })()

    purchaseUpdate = purchaseUpdatedListener(async purchase => {
      const receipt = purchase.transactionReceipt
        ? purchase.transactionReceipt
        : purchase?.originalJson

      if (receipt) {
        try {
          setIsLoading(true)
          const acknowledgeResult = await finishTransaction({ purchase })
          console.info('acknowledgeResult', acknowledgeResult)
          const apiData = {
            product_id: activePlan?.productId || 'subscription.blue',
            subscription_id: state?.index || 1,
            subscription_type: getPriceYear(
              activePlan?.subscriptionOfferDetails[selectedIndex]?.pricingPhases
                ?.pricingPhaseList[0]?.billingPeriod
            ) || '1 Month',
            receipt,
            type: Platform.OS,
            price:
              activePlan?.subscriptionOfferDetails[selectedIndex]?.pricingPhases
                ?.pricingPhaseList[0]?.formattedPrice || 200,
            currency:
              activePlan?.subscriptionOfferDetails[selectedIndex]?.pricingPhases
                ?.pricingPhaseList[0]?.priceCurrencyCode || 'INR'
          }
          console.log(apiData, 'akjshjklasjasldkasdjlkasdjaldskjadslkjadslk lllllllll')
          buySubscription(apiData)
            .then(res => {
              console.log(res)
              setIsLoading(false)
              bottomSheetRef?.current?.close()
              navigation.navigate(navigationString.CONGRATS_SCREEN)
            })
            .catch(err => {
              console.log(err)
              setIsLoading(false)
            })
          // Alert.alert('api dtaa', JSON.stringify(apiData))
        } catch (error) {
          setIsLoading(false)
          console.log({ message: 'finishTransaction', error })
        }
        setReceipt(receipt)
      }
    })

    purchaseError = purchaseErrorListener(error => {
      Alert.alert('purchase error', JSON.stringify(error))
    })

    return () => {
      purchaseUpdate?.remove()
      purchaseError?.remove()
    }
  }, [connected])

  const handleGetSubscriptions = async () => {
    try {
      await getSubscriptions({ skus: subscriptionSkus })
      setIsLoading(false)
    } catch (error) {
      console.log({ message: 'handleGetSubscriptions', error })
      setIsLoading(false)
    }
  }

  const handleBuySubscription = async (productId, offerToken) => {
    if (!offerToken) {
      console.log(
        `There are no subscription Offers for selected product (Only requiered for Google Play purchases): ${productId}`
      )
    }
    try {
      await requestSubscription({
        sku: productId,
        ...(offerToken && {
          subscriptionOffers: [{ sku: productId, offerToken }]
        })
      })
    } catch (error) {
      if (error instanceof PurchaseError) {
        console.log({ message: `[${error.code}]: ${error.message}`, error })
      } else {
        console.log({ message: 'handleBuySubscription', error })
      }
    }
  }

  useEffect(() => {
    const checkCurrentPurchase = async () => {
      try {
        if (currentPurchase?.productId) {
          await finishTransaction({
            purchase: currentPurchase,
            isConsumable: true
          })
          setOwnedSubscriptions(prev => [...prev, currentPurchase?.productId])
        }
      } catch (error) {
        if (error instanceof PurchaseError) {
          console.log({ message: `[${error.code}]: ${error.message}`, error })
        } else {
          console.log({ message: 'handleBuyProduct', error })
        }
      }
    }

    checkCurrentPurchase()
  }, [currentPurchase, finishTransaction])

  const userData = useSelector(state => state?.authReducers?.userData || {})
  const snapPoints = [btnHeight, btnHeight]
  const bottomSheetRef = React.useRef(null)

  const [state, setState] = React.useState({
    index: 0
  })
  const [selectedIndex, setSelectedIndex] = React.useState(1)
  const [activePlan, setActivePlan] = useState(null)

  React.useEffect(() => {
    if (userData?.subscription?.subscription_id) {
      setState({ ...state, index: userData?.subscription?.subscription_id - 1 })
    }
  }, [userData?.subscription?.subscription_id])

  // React.useEffect(() => {
  //   if (state.index === 0) {
  //     bottomSheetRef?.current?.close()
  //   }
  // }, [state.index])

  const _renderScene = ({ item, index }) => {
    console.log(item, 'asasdsdasad')
    return (
      <ImageBackground
        source={
          index === 0
            ? imagesPath.ic_blue
            : index === 1
              ? imagesPath.ic_pink
              : imagesPath.ic_crystal
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
            {item?.name}
          </Text>
          {/* <Text style={{ ...commonStyles.font_12_regular, color: colors.black }}>
            {'Starting at '}
            <Text
              style={{ ...commonStyles.font_14_SemiBold, color: colors.black }}>
              {item?.pricingPhases?.pricingPhaseList[0]?.formattedPrice}
            </Text>
          </Text> */}
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {index === 0
            ? BluePackage(index)
            : index === 1
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
        <ButtonComp
          btnView={{
            backgroundColor: colors.darkBlack,
            height: moderateScale(42)
          }}
          onPressBtn={() => {
            // setPackageData(getPackageData(index))
            setActivePlan(item)
            setState({ ...state, index })
            bottomSheetRef?.current?.snapToIndex(0)
          }}
          btnText="Get Plan"
          txtStyle={{ ...commonStyles.font_12_bold }}
        />
      </ImageBackground>
    )
  }

  const getPriceYear = key => {
    switch (key) {
      case 'P1M':
        return '1 Month'
      case 'P3M':
        return '3 Months'
      case 'P1Y':
        return '1 Year'
    }
  }

  const renderItem = ({ item, index }) => {
    console.log(item, 'adssaddsajdsaodaslk')
    return (
      <TouchableOpacity
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
        {index === selectedIndex &&
          item?.pricingPhases?.pricingPhaseList?.length > 0 &&
          item?.pricingPhases?.pricingPhaseList[0]?.billingPeriod === 'P1Y'
          ? (
            <View style={styles.absoluteTextStyle}>
              <Text style={styles.offerText(state)}>Best Offer</Text>
            </View>
            )
          : null}
        <Text style={styles.monthText(state)}>
          {getPriceYear(
            item?.pricingPhases?.pricingPhaseList?.length > 0 &&
            item?.pricingPhases?.pricingPhaseList[0]?.billingPeriod
          )}
        </Text>
        <Text style={{ ...commonStyles.font_16_SemiBold }}>
          {item?.pricingPhases?.pricingPhaseList?.length > 0 &&
            item?.pricingPhases?.pricingPhaseList[0]?.formattedPrice}
        </Text>
      </TouchableOpacity>
    )
  }

  console.log(activePlan)

  return (
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
          data={subscriptions}
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
            Cancel Subscription
          </Text>
        </TouchableOpacity>
      </View>
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
          <Text style={styles.currentPlanText}>{activePlan?.name}</Text>
          <FlatList
            data={activePlan && activePlan?.subscriptionOfferDetails}
            numColumns={3}
            renderItem={renderItem}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingTop: moderateScale(32) }}
          />
          <Text style={styles.bottomSheetNameText}>
            {`My name is ${userData?.full_name} and I enjoy meeting new people and finding ways to help them have an uplifting experience. I enjoy reading..`}
          </Text>
          <ButtonComp
            btnText={`Buy for ${activePlan &&
              activePlan?.subscriptionOfferDetails[selectedIndex || 0]
                ?.pricingPhases?.pricingPhaseList[0]?.formattedPrice
              }`}
            btnView={styles.bottomSheetBtn(
              activePlan?.name === 'Basic'
                ? 0
                : activePlan?.name === 'Blue'
                  ? 1
                  : activePlan?.name === 'Pink'
                    ? 2
                    : 3
            )}
            onPressBtn={() =>
              handleBuySubscription(
                activePlan?.productId,
                activePlan &&
                activePlan?.subscriptionOfferDetails[selectedIndex]
                  ?.offerToken
              )
            }
          />
          <View
            onLayout={({ nativeEvent }) => {
              setBtnHeight(nativeEvent?.layout?.y + moderateScale(50))
            }}
          />
        </View>
      </BottomSheet>
      <Loader isLoading={isLoading} />
    </ImageBackground>
  )
}

export default SubscriptionScreen
