import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import ParentContainerComponent from "@components/COMP/ParentContainerComponent";
import { Constants } from "@components/Constants";
import FontHelper from "@components/FontHelper";
import ImageHelper from "@components/ImageHelper";
import ColorHelper from "@components/ColorHelper";
import ThemeHelper from "@components/ThemeHelper";
import InPageLoaderComponent from "@components/COMP/InPageLoaderComponent";
import { getAlphaTubUserDetail } from "@components/StorageHelper";
import NetInfo from "@react-native-community/netinfo";

import NonScaleableTextView from "@components/COMP/NonScaleableTextView";
import { logAnalyticsForClick, waitTimer } from "@components/HelperFunctions";
import { AppUrls } from "@apis/Urls";
import PlanDetailComponent, { PlanTypes } from "./PlanDetailComponent";
import {
  apiGetSubscriptionPlanData,
  apiVerifySubscription,
} from "@apis/ApiService";
import {
  InAppPurchase,
  useIAP,
  getProducts,
  getSubscriptions,
  requestSubscription,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  flushFailedPurchasesCachedAsPendingAndroid,
  Subscription,
  getPurchaseHistory,
  getAvailablePurchases,
  withIAPContext,
  clearProductsIOS,
  clearTransactionIOS,
  isIosStorekit2,
  getReceiptIOS,
  validateReceiptIos,
  finishTransaction,
  deepLinkToSubscriptionsAndroid,
  requestPurchase,
  currentPurchase,
  currentPurchaseError,
  ProrationModesAndroid,
} from "react-native-iap";
import Spinner from "react-native-spinkit";
import {
  getCurrentUserSubscriptionDetail,
  setCurrentUserSubscriptionDetail,
} from "../GC/StorageHelper";

const productSkus = Platform.select({
  android: [
    "com.alphatub.premium.1month",
    "com.alphatub.premium.3month",
    "com.alphatub.premium.6month",
    "com.alphatub.premium.1year",
    "com.alphatub.plus.3month",
    "com.alphatub.plus.1year",
    "com.alphatub.pro.6month",
    "com.alphatub.pro.1year",
  ],
  ios: [
    "com.alphatub.premium.1month",
    "com.alphatub.premium.3month",
    "com.alphatub.premium.6month",
    "com.alphatub.premium.1year",
    "com.alphatub.plus.3month",
    "com.alphatub.plus.1year",
    "com.alphatub.pro.6month",
    "com.alphatub.pro.1year",
  ],
});

const SubscriptionDetailPrompt = (props) => {
  const messageModel = props?.navigation?.getParam("messageModel", {});
  const [loading, setLoading] = useState(false);
  const [subscriptionPlanData, setSubscriptionPlanData] = useState([]);
  const [platformProduct, setPlatformProducts] = useState([]);
  const [availablePurchase, setAvailablePurchase] = useState([]);
  const [savedProductId, setSavedProductId] = useState("");

  handleBackPress = () => {
    props?.navigation.goBack(null);
  };

  const fetchSubscriptions = async () => {
    await getSubscriptions({ skus: productSkus })
      .then((data) => {
        setPlatformProducts(data);
        console.log("subscription Data is:=> ", data);
      })
      .catch((err) => {
        setPlatformProducts([]);
        console.log("subscription err is:=> ", err);
      });
  };

  const fetchPurchaseHistory = async () => {
    await getAvailablePurchases()
      .then((data) => {
        console.log("Purchased Data is:=> ", data);
        setAvailablePurchase(data);
      })
      .catch((err) => {
        setPlatformProducts([]);
        console.log("Purchased err is:=> ", err);
      });
  };

  useEffect(() => {
    void initConnection(flushFailedPurchasesCachedAsPendingAndroid);
    // Platform.OS == "ios" && void getReceiptIOS({ forceRefresh: true }); //Set force refresh true for Sandbox testing
    callApiForSubscriptionPlans();
    fetchData();
  }, []);

  useEffect(() => {
    // Platform.OS == "ios" && void clearProductsIOS();
    void fetchSubscriptions();
    void fetchPurchaseHistory();
  }, [getSubscriptions, finishTransaction]);

  useEffect(() => {
    const subscriptionUpdated = purchaseUpdatedListener(async (purchase) => {
      console.log("purchase====", purchase);
      // const receipt = purchase.transactionReceipt;
      if (purchase.purchaseStateAndroid === 1) {
        // Transaction is successful on Android
        // You may want to validate the purchase server-side
        // and grant access to the user accordingly
      } else if (purchase.transactionReceipt) {
        // Transaction is successful on iOS
        // You may want to validate the purchase server-side
        // and grant access to the user accordingly
      }
      // Always finish the transaction
      // finishTransaction(purchase, true);
      finishTransaction({ purchase, isConsumable: false });
    });
    return () => {
      subscriptionUpdated.remove();
    };
  }, [currentPurchase]);

  useEffect(() => {
    const subscription = purchaseErrorListener((error) => {
      console.log("subscription error listener error: ", error);
    });
    return () => {
      subscription.remove();
    };
  }, [currentPurchaseError]);

  async function fetchData() {
    var subscriptionDetail = await getCurrentUserSubscriptionDetail();
    setSavedProductId(subscriptionDetail?.selectedPlan?.subscriptionType);
  }

  const planBuyListener = async (sku, Id, price, planName,selectedItem) => {
    console.log("sku is:", sku);

    if (savedProductId == sku) {
      return;
    }

    setLoading(true);
    var offerToken = "";
    var purchaseToken = "";
    var autoRenewingAndroid = false;
    if (Platform.OS == "android") {
      const object = platformProduct?.find((item) => item.productId === sku);
      offerToken = object?.subscriptionOfferDetails[0]?.offerToken;
      purchaseToken =
        availablePurchase?.length > 0 &&
        availablePurchase[availablePurchase?.length - 1]?.purchaseToken;
      autoRenewingAndroid =
        availablePurchase?.length > 0 &&
        availablePurchase[availablePurchase?.length - 1]?.autoRenewingAndroid;
    }
    console.log("inner response");
    try {
      const purchase = await requestSubscription(
        Platform.OS == "android"
          ? {
              sku,
              ...(offerToken && {
                subscriptionOffers: [{ sku, offerToken }],
              }),
              ...(autoRenewingAndroid && {
                purchaseTokenAndroid: purchaseToken,
                prorationModeAndroid: ProrationModesAndroid.DEFERRED,
              }),
            }
          : {
              sku,
            }
      );

      setLoading(false);

      await apiVerifySubscription(purchase, Id, price, planName)
        .then((data) => {
          setLoading(false);
          setCurrentUserSubscriptionDetail(data?.data?.data);
          Alert.alert(
            "Success",
            `Your subscription to the ${planName} ${selectedItem?.duration?.value} ${selectedItem?.duration?.type} plan has been successfully activated!`,
            [
              {
                text: "Home",
                onPress: () => {
                  console.log("Home Pressed");
                  props?.navigation.navigate("DABHSSCR001Component");
                },
              },
            ]
          );
        })
        .catch((err) => {
          console.log("error data is: ", err);
          setLoading(false);
        });
      // Handle success (e.g., update UI, grant access)
      console.log("Subscription successful:", purchase);
    } catch (error) {
      setLoading(false);
      // Handle error (e.g., show error message)
      console.log("Subscription error:", error);
    }
  };

  const callApiForSubscriptionPlans = async () => {
    console.log("inside callApiForSubscriptionPlans");
    const state = await NetInfo.fetch();
    if (state.isConnected === false) {
      // if (dataRefreshing === true) {
      //     setDataRefreshing(false);
      // }
      showValidationAlertMessage(1);
      return;
    }

    await apiGetSubscriptionPlanData()
      .then(async (res) => {
        console.log(
          "apiGetSubscriptionPlanData on subscription screen response is:=> ",
          res.data.data
        );
        parseApiResponse(res);
      })
      .catch(async (error) => {
        console.log(
          "apiGetSubscriptionPlanData on Dashboard error is:=> ",
          error
        );
        handleResponseError(error, props.navigation, true)
          .then((tempResponse) => {
            if (tempResponse === "ReCallApi") {
              callApiForSubscriptionPlans();
            }
          })
          .catch((err) => {});
      });
  };

  const parseApiResponse = (res) => {
    if (res?.data?.data == null) {
      res.data.data = [];
    }
    setSubscriptionPlanData(res?.data?.data);
  };

  onPrivacyPolicyPressed = () => {
    logAnalyticsForClick("onPrivacyPolicyPressed");
    if (Platform.OS === "ios") {
      props.navigation.navigate("SETINFSCR002Component", {
        dataType: AppUrls.privacyPolicy,
        pageTitle: Constants.textPrivacyPolicy,
      });
    } else {
      Linking.openURL(AppUrls.privacyPolicy).catch((err) => console.log(err));
    }
  };

  onTermsPressed = () => {
    logAnalyticsForClick("onTermsPressed");
    if (Platform.OS === "ios") {
      props.navigation.navigate("SETINFSCR002Component", {
        dataType: AppUrls.termsAndConditions,
        pageTitle: Constants.textTermsOfService,
      });
    } else {
      Linking.openURL(AppUrls.termsAndConditions).catch((err) =>
        console.log(err)
      );
    }
  };

  return (
    <ParentContainerComponent>
      <LinearGradient
        colors={[ColorHelper.ColorPrimary, ColorHelper.ColorPrimary, "#FFFFFF"]}
        style={{ flex: 1 }}
      >
        <TouchableOpacity onPress={handleBackPress} style={{ margin: 12 }}>
          <ImageHelper.SVG.CrossWhite height={20} width={20} />
        </TouchableOpacity>
        <ScrollView
          style={{
            paddingHorizontal: 24,
          }}
        >
          <NonScaleableTextView
            style={{
              fontSize: 30,
              fontFamily: FontHelper.PopReg,
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {"Unlock \n Premium Features"}
          </NonScaleableTextView>

          <NonScaleableTextView
            style={{
              fontSize: 12,
              fontFamily: FontHelper.PopReg,
              textAlign: "center",
              marginTop: 12,
            }}
          >
            {messageModel?.title}
          </NonScaleableTextView>
          <View
            style={{
              alignItems: "center",
            }}
          >
            <messageModel.svg height={125} />
          </View>

          <NonScaleableTextView
            style={{
              fontSize: 12,
              fontFamily: FontHelper.PopReg,
              textAlign: "center",
              marginTop: 12,
              lineHeight: 21,
            }}
          >
            {messageModel?.message}
          </NonScaleableTextView>

          <NonScaleableTextView
            style={{
              fontSize: 8,
              fontFamily: FontHelper.PopReg,
              textAlign: "center",
              color: ColorHelper.Grey01,
              marginTop: 12,
              fontWeight: "500",
              lineHeight: 21,
            }}
          >
            By continuing, you agree to alphaTUB's .
            <NonScaleableTextView
              onPress={this.onTermsPressed}
              style={{
                fontSize: 8,
                fontFamily: FontHelper.PopReg,
                textAlign: "center",
                color: ColorHelper.Grey01,
                textDecorationLine: "underline",
                fontWeight: "500",
                lineHeight: 21,
              }}
            >
              {Constants.textTermsOfService}
            </NonScaleableTextView>
            <NonScaleableTextView
              style={{
                fontSize: 8,
                fontFamily: FontHelper.PopReg,
                textAlign: "center",
                color: ColorHelper.Grey01,
                fontWeight: "500",
                lineHeight: 21,
              }}
            >
              {" "}
              and{" "}
            </NonScaleableTextView>
            <NonScaleableTextView
              onPress={onPrivacyPolicyPressed}
              style={{
                fontSize: 8,
                fontFamily: FontHelper.PopReg,
                textAlign: "center",
                color: ColorHelper.Grey01,
                textDecorationLine: "underline",
                fontWeight: "500",
                lineHeight: 21,
              }}
            >
              {" "}
              Privacy Policy
            </NonScaleableTextView>
          </NonScaleableTextView>
          {!loading ? (
            subscriptionPlanData.map((item, index) => {
              return (
                <PlanDetailComponent
                  componentType={`${index}`}
                  planName={item?.name}
                  // price={item?.localizedPrice}
                  buyButtonListener={(
                    selectedProductId,
                    checked,
                    selectedItemPrice,
                    planName,
                    selectedItem
                  ) => {
                    Platform.OS == "ios" && savedProductId
                      ? Alert.alert(
                          "Change Subscription",
                          "Purchasing a new plan will replace your existing plan. Do you want to modify your current plan to new plan?",
                          [
                            {
                              text: "Cancel",
                              onPress: () => {
                                console.log("Cancel Pressed");
                              },
                            },
                            {
                              text: "Continue",
                              onPress: () => {
                                console.log("Change Pressed");
                                planBuyListener(
                                  selectedProductId,
                                  checked,
                                  selectedItemPrice,
                                  planName,
                                  selectedItem
                                );
                              },
                            },
                          ]
                        )
                      : planBuyListener(
                          selectedProductId,
                          checked,
                          selectedItemPrice,
                          planName,
                          selectedItem
                        );
                  }}
                  data={item}
                  parentId={item._id}
                  subscriptionData={subscriptionPlanData}
                  status={item.active}
                />
              );
            })
          ) : (
            <Spinner
              style={{
                alignSelf: "center",
              }}
              isVisible={true}
              size={100}
              type="ThreeBounce"
              color={ColorHelper.White}
            />
          )}
        </ScrollView>
      </LinearGradient>
    </ParentContainerComponent>
  );
};

export default SubscriptionDetailPrompt;
