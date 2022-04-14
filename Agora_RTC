import React, { Component, useEffect, useRef, useState, useCallback, Fragment } from "react"
import {
    Platform,
    View,
    AppState,
    TextInput,
    Button,
    Text,
    Keyboard
} from "react-native"
import RtcEngine, {
    RtcLocalView,
    RtcRemoteView,
    VideoRenderMode,
    ClientRole,
    ChannelProfile,
    DataStreamConfig
} from "react-native-agora"
import RtmEngine from 'agora-react-native-rtm';
import messaging from '@react-native-firebase/messaging';
import { activateKeepAwake, deactivateKeepAwake } from "@sayem314/react-native-keep-awake";
import { useSelector } from "react-redux";
import { initStripe, handleCardAction, useApplePay } from '@stripe/stripe-react-native';
import Modal from "react-native-modal";
import { GiftedChat } from 'react-native-gifted-chat'
import {
    ChatModalView,
    EndCallModal,
    EndCallSoonModal,
    ExtendSessionModal,
    RenderAllVideos,
    SessionExtendPaymentModal,
    SupportModal,
    VideoCallButtons
} from "../../components/VideoSessionComponents";
import strings from "../../constants/lang";
import { requestCameraAndAudioPermission } from "../../utils/utils";
import navigationStrings from '../../constants/navigationStrings';
import { addCardIsSelected, showError, showInfoAlert, showSuccess } from "../../helper/helperFunctions";
import { PAYMENT_METHOD_ARRAY_LIST, } from "../../utils/staticData";
import { Loader } from "../../components/Loader"

import { getAllCards } from "../../redux/actions/homeAction";
import { checkTherapistAvalForExtendCall, askToExtendSession, endVideoSession, raiseConcern } from "../../redux/actions/videoSessionAction";
import { makeNewExtendSessionPayment, updateExtendSessionPayment } from "../../redux/actions/paymentsAction";
import { STRIPE_PUBLISH_KEY, STRIPE_MERCHANT_ID, AGORA_APP_ID } from "../../config/urls";
import { height } from "../../styles/responsiveSize";
import { json } from "is_js";

const extendTimeLimit = 300

const VideoSession = (props) => {

    const { presentApplePay, confirmApplePayPayment, isApplePaySupported } = useApplePay();

    const userData = useSelector(state => state.authReducer.userData);

    // const totalFullAmount = prevScreenData?.therapistData?.therapist?.profile?.charge_per_hour
    const [loader, setLoader] = useState({ isLoading: false, loadingMessage: "" })
    const [prevScreenData, setPrevScreenData] = useState(props.route.params?.sessionData)

    // console.log(prevScreenData, "prevScreenDataprevScreenDataprevScreenDataprevScreenData");

    const [agoraTokenChannel, setAgoraTokenChannel] = useState({
        // token: prevScreenData?.token,
        // channelName: prevScreenData?.channel_name
        token: "00669c98b1964f74b6887e82a58b0c763c6IADbMjcmkmujh2EOOMas1YtbTDFY0wBHTYe7ujc6SB5AjrgvnYAAAAAAEAB3EU0Yt/9XYgEAAQC3/1di",
        channelName: "sd8gg8dfgu8dfg8dfg8",
    })

    const [joinSucceed, setJoinSucceed] = useState(false)
    const [peerIds, setPeerIds] = useState([])
    const [isVideoAvailable, setVideoAvailable] = useState(true)
    const [isAudioAvailable, setAudioAvailable] = useState(true)

    const [showSupportModal, setShowSupportModal] = useState(false)
    const [showEndCallModal, setShowEndCallModal] = useState(false)
    const [endCallSoonModal, setEndCallSoonModal] = useState(false)
    const [showExtendModal, setShowExtendModal] = useState(false)
    const [wantExtendCall, setWantExtendCall] = useState(false)
    const [therapistVideoEnabled, setTherapistVideoEnabled] = useState(true)
    const [sessionExtendPaymentModal, setSessionExtendPaymentModals] = useState(false)

    const [issueConcern, setIssueConcern] = useState("")

    const [totalAmount, setTotalAmount] = useState(prevScreenData?.therapistData?.therapist?.profile?.charge_per_hour || "4")
    const [totalPayAmount, setTotalPayAmount] = useState(totalAmount / 2)
    const [walletAmount, setWalletAmount] = useState(userData?.wallet?.balance)

    const [allCards, setAllCards] = useState(PAYMENT_METHOD_ARRAY_LIST)
    const [callTimer, setCallTimer] = useState(300 || prevScreenData?.call_time * 60)
    const [callPaused, setCallPaused] = useState(false)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
    const [showCardsList, setShowCardsList] = useState(false)

    const [therapistAvalForExtendCall, setTherapistAvalForExtendCall] = useState(false)
    const [useWallet, setUseWallet] = useState(false)

    const [endCallReasonModal, setEndCallReasonModal] = useState(false)
    const [endcallReason, setEndCallReason] = useState("")
    const [chatModalVisible, setChatModalVisible] = useState(false)
    const [chatMessages, setChatMessages] = useState([
        {
            _id: 1,
            text: 'Hello',
            createdAt: new Date(),
            user: {
                _id: 2,
            },
        },
    ])
    const [newUnreadMessage, setNewUnreadMessage] = useState(false)

    const callTimerRef = useRef()

    const AgoraEngine = useRef();
    const AgoraRTMEngine = useRef();

    useEffect(() => {
        if (!joinSucceed) {
            return;
        }

        if (!callPaused) {
            if (therapistAvalForExtendCall == true) {
                if (callTimer == 180) {
                    setEndCallSoonModal(true)
                } else if (callTimer == 3) {
                    setEndCallSoonModal(false)
                }
            }

            if (callTimer > 0) {
                callTimerRef.current = setInterval(() => setCallTimer(callTimer - 1), 1000);
                return () => clearInterval(callTimerRef.current);
            } else {
                callTimerRef.current = setInterval(() => setCallTimer(callTimer - 1), 1000);
                clearInterval(callTimerRef.current);
                _endCall()
            }
        }
    }, [joinSucceed, callTimer, callPaused])

    useEffect(() => {
        activateKeepAwake();
        _checkAvailabilityToExtendCall()
        _getCards()
        setLoader({ isLoading: true, loadingMessage: "Connecting..." })
        async function initialize() {
            await initStripe({
                publishableKey: STRIPE_PUBLISH_KEY,
                merchantIdentifier: STRIPE_MERCHANT_ID,
            });
        }
        initialize().catch(console.error);
        return () => {
            // console.log("Appstate 222222222");
            deactivateKeepAwake();
            AgoraEngine.current.destroy();
            clearInterval(callTimerRef.current)
            // _endCall()
        };
    }, [])

    useEffect(() => {
        if (Platform.OS === 'android') {
            // Request required permissions from Android
            requestCameraAndAudioPermission().then(() => {
                // console.log('requested!');
            });
        }
        initRTC()
        initRTM()
    }, [])

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            // console.log('A new FCM message arrived..... in video session', remoteMessage);

            if (remoteMessage?.data?.type == "extend_the_meeting") {
                if (remoteMessage?.data?.title == "Therapist has accepted the extended session") {
                    // console.log("111111111111");
                    showSuccess(remoteMessage?.data?.title)
                    // setWantExtendCall(true)
                    _handleLocalAudioVideo("_DISABLE")
                    setShowExtendModal(true)
                    setCallPaused(true)
                } else if (remoteMessage?.data?.title == "Therapist has rejected the extended session") {
                    // console.log("22222222222");
                    showError(remoteMessage?.data?.title)
                    setWantExtendCall(false)
                }
            } else if (remoteMessage?.data?.type == "session_ended") {
                // console.log("111111111111");
                showInfoAlert(strings.sessionEnded)
                setLoader({ isLoading: true, loadingMessage: strings.sessionEnded })
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const appStateSubscription = AppState.addEventListener("change", nextAppState => {
            // console.log(nextAppState, "Appstate 1111111");
            if (nextAppState == "active") {
                setCallPaused(false)
                setAudioAvailable(true)
                setVideoAvailable(true)
                setTimeout(() => {
                    _startCall()
                }, 1000);

                setTimeout(() => {
                    AgoraEngine.current.enableVideo();
                    AgoraEngine.current.enableAudio();
                    AgoraEngine.current.enableLocalAudio(true)
                    AgoraEngine.current.enableLocalVideo(true)
                    _handleLocalAudioVideo("_ENABLE")
                }, 1200);

                // if (isAudioAvailable) {
                //     setAudioAvailable(true)
                //     AgoraEngine.current.enableLocalAudio(true)
                // } else {
                //     setAudioAvailable(false)
                //     AgoraEngine.current.enableLocalAudio(false)
                // }

                // if (isVideoAvailable) {
                //     setVideoAvailable(true)
                //     AgoraEngine.current.enableLocalVideo(true)
                // } else {
                //     setVideoAvailable(false)
                //     AgoraEngine.current.enableLocalVideo(false)
                // }

            } else {
                setPeerIds([])
                AgoraEngine.current?.leaveChannel();
                setCallPaused(true)
            }
        });
        return () => appStateSubscription
    }, [])

    const _checkAvailabilityToExtendCall = () => {
        let apiData = {
            appointment_id: prevScreenData?.therapistData?.appointment_id || 1,
            therapist_id: prevScreenData?.therapistData?.therapist_id || 100
        }
        checkTherapistAvalForExtendCall(apiData).then((res) => {
            setTherapistAvalForExtendCall(res?.data?.is_available || false)
        }).catch((error) => {
            setTherapistAvalForExtendCall(false)
        })
    }

    const _getCards = () => {
        getAllCards().then((res) => {
            let allCards = res?.data?.cards;
            if (allCards.length) {
                let formattedArray = addCardIsSelected(allCards)
                setAllCards([...PAYMENT_METHOD_ARRAY_LIST, ...formattedArray])
            }
        }).catch((error) => {
            showError(error?.message || error?.data?.message || "Get cards API error")
        })
    }

    const initRTC = async () => {

        if (agoraTokenChannel.token == "" || agoraTokenChannel.channelName == "") {
            return;
        }

        // console.log(agoraTokenChannel, "agoraTokenChannel 111111111");

        AgoraEngine.current = await RtcEngine.create(AGORA_APP_ID);
        AgoraEngine.current.enableVideo();
        AgoraEngine.current.enableAudio();
        AgoraEngine.current?.setChannelProfile(ChannelProfile.LiveBroadcasting);
        AgoraEngine.current?.setClientRole(ClientRole.Broadcaster);

        _handleRTCListener()


        setTimeout(() => {
            _startCall()
        }, 1000);
    };

    const initRTM = async () => {
        if (agoraTokenChannel.token == "" || agoraTokenChannel.channelName == "") {
            return;
        }

        AgoraRTMEngine.current = new RtmEngine();

        // AgoraRTMEngine.current.login({
        // uid: Math.floor(Math.random() * 233),
        // token: agoraTokenChannel.token
        // })

        await AgoraRTMEngine.current.createClient(AGORA_APP_ID).then((res) => {
            console.log(res, "RTM createClient successs");
        }).catch((error) => console.log(error.code, "RTM createClient error"))

        // AgoraRTMEngine.current.login({
        //     uid: String(Math.floor(Math.random() * 233)),
        //     token: agoraTokenChannel.token
        // })

        await AgoraRTMEngine.current.login({
            uid: "0",
            token: "00669c98b1964f74b6887e82a58b0c763c6IADmtcj8XAjC4LXypFu+Cz3x+DmlZtiKXvY/sHcRWsI8M9UzW/oAAAAAEADVWgAA2wBYYgEAAQBrvVZi"
        }).then((res) => {
            console.log(res, "RTM login Success");
        }).catch((error) => console.log(error.code, "RTM error login"))

        setTimeout(async () => {
            await AgoraRTMEngine.current.joinChannel(agoraTokenChannel.channelName).catch((error) => console.log(error.code, "RTM error at_joinChannel"))
        }, 2000);

        setTimeout(async () => {
            await AgoraRTMEngine.current.sendMessage(agoraTokenChannel.channelName, {
                text: "lksdlshdflkhsdlkf"
            }, {}).catch((error) => console.log(error.code, "RTM 111 sendMessage error"))
        }, 3000);

        AgoraRTMEngine.current.on('error', (evt) => {
            console.log(evt, "RTM error");
        });
        AgoraRTMEngine.current.on('connectionStateChanged', (evt) => {
            console.log(evt, "RTM connectionStateChanged");
        });
        // AgoraRTMEngine.current.on('channelMessageReceived', (evt) => {
        //     console.log(evt, "channelMessageReceived");
        //     alert(JSON.stringify(evt));
        // });
        // AgoraRTMEngine.current.on('messageReceived', (evt) => {
        //     console.log(evt, "messageReceived");
        //     alert(JSON.stringify(evt));
        // });
        AgoraRTMEngine.current.on('channelMemberJoined', (evt) => {
            console.log(evt, "RTM channelMemberJoined");
        });

    }

    const _handleRTCListener = async () => {
        AgoraEngine.current.addListener('Warning', (warn) => {
            // console.log('Warning', warn);
        });

        AgoraEngine.current.addListener('UserEnableVideo', (uid, muted) => {
            // console.log('UserEnableVideo======>>>', muted);
            setTherapistVideoEnabled(muted)
            // setCallPaused(!callPaused)
        });

        AgoraEngine.current.addListener('UserMuteVideo', (uid) => {
            // console.log('UserMuteVideo======>>>', uid);
        });


        AgoraEngine.current.addListener('UserEnableLocalVideo', (uid, muted) => {
            // console.log('UserEnableLocalVideo======>>>', uid, muted);
            setTherapistVideoEnabled(muted)
            // setCallPaused(!callPaused)
        });

        AgoraEngine.current.addListener('Error', (err) => {
            // console.log('Error', err);
        });

        AgoraEngine.current.addListener('UserJoined', (uid, elapsed) => {
            // console.log('UserJoined', uid, elapsed);
            setLoader({ isLoading: false, loadingMessage: "" })

            if (peerIds.indexOf(uid) === -1) {
                setPeerIds([...peerIds, uid])
                showSuccess(strings.therapistJoined)
                setJoinSucceed(true)
            }
        });

        AgoraEngine.current.addListener('UserOffline', (uid, reason) => {
            setLoader({ isLoading: true, loadingMessage: strings.pleasewaittherapistjointhecall })
            // console.log('UserOffline', uid, reason);
            setJoinSucceed(false)
            setPeerIds(peerIds.filter((id) => id !== uid))
        });

        // If Local user joins RTC channel
        AgoraEngine.current.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
            // console.log('JoinChannelSuccess', channel, uid, elapsed);
        });


        // AgoraEngine.current?.addListener('StreamMessage', (uid, streamId, data) => {
        //     // console.log('StreamMessage', uid, streamId, data);
        //     console.log(`StreamMessage Receive from uid:${uid}`, `StreamId ${streamId}:${data}`);

        //     let newMessage = {}
        //     newMessage._id = Math.random()
        //     newMessage.createdAt = new Date()
        //     newMessage.text = data
        //     newMessage.user = {
        //         _id: 2
        //     }

        //     setChatMessages(previousMessages => GiftedChat.append(previousMessages, newMessage))
        //     if (!chatModalVisible) {
        //         setNewUnreadMessage(true)
        //     } else {
        //         setNewUnreadMessage(false)
        //     }
        // });

        // AgoraEngine.current?.addListener('StreamMessageError', (uid, streamId, error, missed, cached) => {
        //     console.log(
        //         'StreamMessage error',
        //         uid,
        //         streamId,
        //         error,
        //         missed,
        //         cached
        //     );
        // }
        // );
    }

    const _startCall = async () => {
        await AgoraEngine.current.joinChannel(agoraTokenChannel.token, agoraTokenChannel.channelName, null, 0);

    };

    const _handleVideo = async () => {
        if (isVideoAvailable == true) {
            setVideoAvailable(false)
            // AgoraEngine.current.disableVideo()
            AgoraEngine.current.enableLocalVideo(false)
        } else {
            setVideoAvailable(true)
            // AgoraEngine.current.enableVideo()
            AgoraEngine.current.enableLocalVideo(true)
        }
    }

    const _handleAudio = async () => {
        if (isAudioAvailable == true) {
            setAudioAvailable(false)
            AgoraEngine.current.enableLocalAudio(false)
        } else {
            setAudioAvailable(true)
            AgoraEngine.current.enableLocalAudio(true)
        }
    }

    const _endCall = async () => {
        setLoader({ isLoading: true, loadingMessage: strings.callending })
        AgoraEngine.current.leaveChannel();
        setPeerIds([])

        if (endCallReasonModal == true && endcallReason.trim() == "") {
            alert(strings.pleaseenterareason)
            return;
        }

        setJoinSucceed(false)
        setShowEndCallModal(false)
        setEndCallReasonModal(false)

        let payLoad = {
            appointment_id: prevScreenData?.therapistData?.appointment_id || 1,
            is_decline: endcallReason.trim() == "" ? false : true,
            reason: endcallReason
        }
        endVideoSession(payLoad).then(res => {
            setTimeout(() => {
                if (endcallReason.trim() == "") {
                    props.navigation.navigate(navigationStrings.RATE_VIDEO_SESSION, {
                        therapistData: prevScreenData?.therapistData
                    })
                } else {
                    props.navigation.navigate(navigationStrings.HOME)
                }
            }, 2000);
        }).catch(error => {
            setTimeout(() => {
                props.navigation.navigate(navigationStrings.RATE_VIDEO_SESSION, {
                    therapistData: prevScreenData?.therapistData
                })
            }, 2000);
            setLoader({ isLoading: false, loadingMessage: "" })
            showError(error?.message || error?.data?.message || "Make New Payment API error")
        })
    };

    const _payToExtend = () => {
        if (selectedPaymentMethod == "") {
            alert(strings.selectPaymentMethod)
        } else {
            _handleLocalAudioVideo("_DISABLE")
            setSessionExtendPaymentModals(false)

            // AgoraEngine.current.leaveChannel();

            // if (Platform.OS == "android") {
            //     setPeerIds([])
            // }

            // setCallPaused(false)

            setLoader({ isLoading: true, loadingMessage: strings.pleaseWaitWeAreProcessingYourPayment })

            let data = {
                original_amount: totalAmount / 2 || 3.0,
                amount: useWallet ? totalPayAmount : totalAmount / 2,
                // original_amount: 1,
                // amount: 1,
                payment_type: selectedPaymentMethod?.type == "apple_pay" ? 1 : 2,
                card_id: selectedPaymentMethod?.id || "",
                use_wallet_amount: useWallet,
                appointment_id: prevScreenData?.therapistData?.appointment_id || 1
            }

            makeNewExtendSessionPayment(data).then(res => {
                if (res?.statuscode == 200) {
                    showSuccess(strings.paymentSuccessful)
                    let paymentData = {
                        customerId: res?.data?.customer,
                        ephemeralKey: res?.data?.ephemeralKey,
                        clientSecret: res?.data?.paymentIntent,
                        transactionId: res?.data?.transaction_id,
                        cardDetails: res?.data?.card,
                    }
                    setUseWallet(false)
                    setSelectedPaymentMethod("")
                    if (selectedPaymentMethod?.type == "card") {
                        setLoader({ isLoading: true, loadingMessage: strings.pleaseWaitWeAreConfirmingYouPayment })
                        _confirmCardPayment(paymentData)

                    } else if (selectedPaymentMethod?.type == "apple_pay") {
                        setLoader({ isLoading: true, loadingMessage: strings.pleaseWaitWeAreProcessingYourPaymentThroughApplePay })
                        _applePay(paymentData)
                    } else {
                        setLoader({ isLoading: true, loadingMessage: strings.pleasewaitweareupdatingyourPayment })
                        _updatePaymentStatus(paymentData, "success")
                    }
                }
            }).catch(error => {
                _handleLocalAudioVideo("_ENABLE")
                setCallPaused(false)
                setLoader({ isLoading: false, loadingMessage: "" })
                showError(error?.message || error?.data?.message || "Make New Payment API error")
            })
        }
    }

    const _applePay = async (paymentData) => {

        // console.log(isApplePaySupported, "isApplePaySupported");

        if (!isApplePaySupported) return;

        const res = await presentApplePay({
            cartItems: [{ label: 'Apple Pay', amount: totalAmount / 2 }],
            country: 'US',
            currency: 'USD',
            requiredShippingAddressFields: [userData?.name, userData?.phone],
            requiredBillingContactFields: [userData?.name, userData?.phone],
        });

        if (!res.error) {
            setLoader({ isLoading: true, loadingMessage: strings.pleaseWaitWeAreconfirmingPaymentThroughApplePay })
            const { error: confirmError } = await confirmApplePayPayment(
                paymentData?.clientSecret
            );

            if (confirmError) {
                console.log(confirmError, "confirmError");
                setLoader({ isLoading: false, loadingMessage: "" })
                _handleLocalAudioVideo("_ENABLE")
            } else {
                _updatePaymentStatus(paymentData, "success")
                setLoader({ isLoading: false, loadingMessage: "" })
            }
        } else {
            _handleLocalAudioVideo("_ENABLE")
            setCallPaused(false)

            console.log(res.error, "resreresrersrersrser");
            setLoader({ isLoading: false, loadingMessage: "" })
            showError(strings.presentApplePayError)
            // _endCall()
        }
    };

    const _confirmCardPayment = async (paymentData) => {
        const { paymentIntent, error } = await handleCardAction(paymentData?.clientSecret)
        setLoader({ isLoading: true, loadingMessage: strings.pleaseWaitWeAreConfirmingYouPayment })
        if (paymentIntent) {
            console.log(paymentIntent, "paymentIntent");
            setLoader({ isLoading: true, loadingMessage: strings.pleasewaitweareupdatingyourPayment })
            showSuccess(strings.youpaymentissuccessful)
            _updatePaymentStatus(paymentData, "success")
        } else {
            console.log(error, "error");
            setLoader({ isLoading: false, loadingMessage: "" })
            showError(error?.message || "payment faild")
            _updatePaymentStatus(paymentData, "failed")
        }
    }

    const _updatePaymentStatus = (paymentData, paymentStatus) => {
        let apiData = {
            appointment_id: prevScreenData?.therapistData?.appointment_id || 1,
            transaction_id: paymentData?.transactionId,
            status: paymentStatus
        }
        updateExtendSessionPayment(apiData).then(res => {
            // console.log(res, "updatePaymentStatus ");
            setLoader({ isLoading: false, loadingMessage: "" })
            // _checkAvailabilityToExtendCall()
            setCallTimer(callTimer + extendTimeLimit + 3)

            _handleLocalAudioVideo("_ENABLE")
            // init()
            setCallPaused(false)
        }).catch((error) => {
            setLoader({ isLoading: false, loadingMessage: "" })
            showError(error?.message || error?.data?.message || "Update Payment status API error")
            _handleLocalAudioVideo("_ENABLE")
            setCallPaused(false)
        })
    }

    const _onYesExtendCall = () => {
        let payLoad = {
            status: 1,
            therapist_id: prevScreenData?.therapistData?.therapist_id || -1,
            appointment_id: prevScreenData?.therapistData?.appointment_id || 1,
        }
        setLoader({ isLoading: true, loadingMessage: strings.sendingrequesttotherapist })
        setEndCallSoonModal(false)
        askToExtendSession(payLoad).then(res => {
            // console.log(res, "res");
            setLoader({ isLoading: false, loadingMessage: "" })
            // setWantExtendCall(true)
            setEndCallSoonModal(false)
            setCallTimer(callTimer + 1)
            // setCallPaused(false)
            showSuccess(res?.message)
        }).catch((error) => {
            setEndCallSoonModal(true)
            setLoader({ isLoading: false, loadingMessage: "" })
            showError(error?.message || error?.data?.message || "/therapist/ask-therapist-extended-session API error")
        })
    }

    const _raiseConcern = () => {
        if (issueConcern.trim() == "") {
            alert(strings.pleasetelluswhathappend)
            return;
        }
        setLoader({ isLoading: true, loadingMessage: "" })
        setShowSupportModal(false)
        let payLoad = {
            appointment_id: prevScreenData?.therapistData?.appointment_id || 1,
            therapist_id: prevScreenData?.therapistData?.therapist_id || 100,
            reason: issueConcern
        }

        raiseConcern(payLoad).then(res => {
            showSuccess(strings.callIssueSubmitted)
            setLoader({ isLoading: false, loadingMessage: "" })
        }).catch((error) => {
            setLoader({ isLoading: false, loadingMessage: "" })
            showError(error?.message || error?.data?.message || "/therapist/ask-therapist-extended-session API error")
        })
    }

    const _useWallet = () => {
        if (userData?.wallet?.balance > 0) {
            if (useWallet == false) {
                setUseWallet(true)
                if (totalAmount / 2 > walletAmount) {
                    setTotalPayAmount(totalAmount / 2 - walletAmount)
                } else {
                    setTotalPayAmount(0)
                    setSelectedPaymentMethod({
                        id: "",
                        isSelected: true,
                        type: "wallet_pay",
                        value: "Pay through wallet",
                    })
                }
            }
            else {
                setUseWallet(false)
                setSelectedPaymentMethod("")
            }
        } else {
            alert(strings.insufficientbalanceinwallet)
        }
    }

    const _handleLocalAudioVideo = (type) => {
        if (type == "_DISABLE") {
            AgoraEngine.current.disableAudio()
            AgoraEngine.current.disableVideo()
            setAudioAvailable(false)
            setVideoAvailable(false)
        } else {
            AgoraEngine.current.enableVideo()
            AgoraEngine.current.enableAudio()
            setAudioAvailable(true)
            setVideoAvailable(true)
        }
    }

    const _onPressSend = useCallback((messages = []) => {
        setChatMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        _sendMessage(messages[0].text)
    }, [])

    const _sendMessage = async (message) => {
        // const streamId = await AgoraEngine.current?.createDataStreamWithConfig(
        //     new DataStreamConfig(true, true)
        // )
        // AgoraEngine.current.sendStreamMessage(streamId, message)

        await AgoraRTMEngine.current.sendMessage(agoraTokenChannel.channelName, {
            text: "lksdlshdflkhsdlkf"
        }, {}).catch((error) => console.log(error, "sendMessagesendMessage"))
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 0.94 }}>
                <RenderAllVideos
                    therapistVideoEnabled={therapistVideoEnabled}
                    peerIds={peerIds}
                    channelName={agoraTokenChannel.channelName}
                    joinSucceed={joinSucceed}
                    callTimer={callTimer}
                    isVideoAvailable={isVideoAvailable}
                    onPressChat={() => {
                        setChatModalVisible(true)
                        setNewUnreadMessage(false)
                    }}
                    isNewMessage={newUnreadMessage}
                />
                <Loader
                    isLoading={loader.isLoading}
                    message={loader.loadingMessage}
                />
            </View>
            <View style={{ flex: 0.08 }}>
                <VideoCallButtons
                    isAudioAvailable={isAudioAvailable}
                    onPressMute={_handleAudio}
                    isVideoAvailable={isVideoAvailable}
                    onPressHideVideo={_handleVideo}
                    onPressSupport={() => setShowSupportModal(true)}
                    onPressEnd={() => setShowEndCallModal(true)}
                />
            </View>

            <SupportModal
                isVisible={endCallReasonModal}
                heading={strings.YouareensionbeforeminutesPleasetellusreason}
                onPressSend={_endCall}
                onChangeText={(val) => setEndCallReason(val)}
                onPressCancel={() => setEndCallReasonModal(false)}
            />

            <SupportModal
                isVisible={showSupportModal}
                heading={strings.Doyouwishtoraiseanissue}
                onPressSend={_raiseConcern}
                onChangeText={(val) => setIssueConcern(val)}
                onPressCancel={() => setShowSupportModal(false)}
            />

            <EndCallModal
                isVisible={showEndCallModal}
                onPressYes={() => {
                    setShowEndCallModal(false)
                    setTimeout(() => {
                        setEndCallReasonModal(true)
                    }, 500);
                }}
                onPressNo={() => setShowEndCallModal(false)}
            />

            <EndCallSoonModal
                isVisible={endCallSoonModal}
                timeLeft={"10:00"}
                onPressYes={_onYesExtendCall}
                onPressNo={() => {
                    setWantExtendCall(false)
                    setEndCallSoonModal(false)
                }}
            />

            <ExtendSessionModal
                isVisible={showExtendModal}
                onPressContinue={() => {
                    setShowExtendModal(false)
                    setTimeout(() => {
                        setSessionExtendPaymentModals(true)
                    }, 500);
                }}
                amount={totalAmount / 2}
            // onPressCross={() => {
            //     setShowExtendModal(false)
            //     _endCall()
            // }}
            />

            <SessionExtendPaymentModal
                isVisible={sessionExtendPaymentModal}
                totalAmount={totalAmount / 2}
                walletAmount={userData?.wallet?.balance}
                isWalletSelected={useWallet}
                onPressWallet={_useWallet}
                showCardsList={showCardsList}
                selectedPaymentMethod={selectedPaymentMethod}
                onPressCard={() => setShowCardsList(true)}
                paymentMethodListArray={allCards}
                onPressPaymentMethod={(item, index) => {
                    const array = allCards.map(item => {
                        item.isSelected = false
                        return item;
                    })
                    array[index].isSelected = !array[index].isSelected;
                    setAllCards(array)
                    setSelectedPaymentMethod(array[index])
                    setShowCardsList(false)
                }}
                onPressPay={_payToExtend}
            />

            <ChatModalView
                closeModal={() => {
                    setChatModalVisible(false)
                    setNewUnreadMessage(false)
                }}
                isVisible={chatModalVisible}
                chatMessages={chatMessages}
                _onPressSend={_onPressSend}
            />


            {/* <Modal
                isVisible={true}
            // backdropOpacity={0.1}
            >
                <GiftedChat
                    messages={chatMessages}
                    onSend={_onPressSend}
                    user={{
                        _id: 1,
                    }}
                />
            </Modal> */}
        </View>
    )
}

export default VideoSession;




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


import React from 'react';
import { FlatList, Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from "react-native-modal";
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RtcEngine, {
    RtcLocalView,
    RtcRemoteView,
    VideoRenderMode,
    ClientRole,
    ChannelProfile
} from "react-native-agora"
import { BlurView } from '@react-native-community/blur';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import { height, moderateScale, STATUSBAR_HEIGHT, width } from '../styles/responsiveSize';
import strings from "../constants/lang"
import ButtonWithLoader from './ButtonWithLoader';
import { AmountWalletBox, CardComponent, PaymentMethodList } from './AmountWalletBox';

export const VideoCallButtons = ({
    isVideoAvailable,
    isAudioAvailable,
    onPressMute,
    onPressHideVideo,
    onPressEnd,
    onPressSupport,
}) => (
    <View style={{
        paddingTop: moderateScale(8),
        backgroundColor: colors.whiteColor,
        flexDirection: "row",
        justifyContent: "space-between",
    }}
    >
        <TouchableOpacity style={{
            alignItems: "center",
            justifyContent: "center",
            width: width / 4
        }}
            activeOpacity={0.9}
            onPress={onPressMute}
        >
            <Image source={imagePath.Mic}
                style={{
                    height: moderateScale(25),
                    width: moderateScale(25),
                    tintColor: isAudioAvailable ? colors.blackColor : "red"
                }}
                resizeMode={"contain"}
            />
            <Text style={styles.buttonHeading}>{isAudioAvailable ? strings.mute : strings.unmute}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
            alignItems: "center",
            justifyContent: "center",
            width: width / 4
        }}
            activeOpacity={0.9}
            onPress={onPressHideVideo}
        >
            <Image source={imagePath.ic_blur}
                style={{
                    height: moderateScale(25),
                    width: moderateScale(25),
                    tintColor: isVideoAvailable ? colors.blackColor : "red"
                }}
                resizeMode={"contain"}
            />
            <Text style={styles.buttonHeading}>{isVideoAvailable ? strings.blur : strings.unblur}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
            alignItems: "center",
            justifyContent: "center",
            width: width / 4
        }}
            activeOpacity={0.9}
            onPress={onPressSupport}
        >
            <Image source={imagePath.Headphones}
                style={{
                    height: moderateScale(25),
                    width: moderateScale(25)
                }}
                resizeMode={"contain"}
            />
            <Text style={styles.buttonHeading}>{strings.support}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
            alignItems: "center",
            justifyContent: "center",
            width: width / 4
        }}
            activeOpacity={0.9}
            onPress={onPressEnd}
        >
            <Image source={imagePath.Missed_call}
                style={{
                    height: moderateScale(25),
                    width: moderateScale(25)
                }}
                resizeMode={"contain"}
            />
            <Text style={styles.buttonHeading}>{strings.endSession}</Text>
        </TouchableOpacity>
    </View>
);

export const SupportModal = ({
    isVisible,
    onPressSend,
    heading,
    onPressCancel,
    onChangeText,
}) => {
    return (
        <Modal
            isVisible={isVisible}
            backdropOpacity={0.1}
        >
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                bounces={false}
                keyboardShouldPersistTaps={'always'}
                showsVerticalScrollIndicator={false}
            >
                <View style={{
                    backgroundColor: colors.grey_255_1,
                    padding: moderateScale(16),
                    borderRadius: moderateScale(10)
                }}>
                    <Image
                        source={imagePath.ic_issue_message}
                        style={{
                            height: moderateScale(76),
                            width: moderateScale(76),
                            alignSelf: "center"
                        }}
                        resizeMode={"contain"}
                    />

                    <Text style={{
                        ...commonStyles.font_16_semiBold,
                        marginVertical: moderateScale(24),
                        alignSelf: "center",
                        textAlign: "center"
                    }}>{heading}</Text>

                    <TextInputWithLabel
                        // editable={isLoading ? false : true}
                        // value={username}
                        onChangeText={onChangeText}
                        placeholder={strings.telluswhathappened}
                        inputStyle={{
                            height: moderateScale(80),
                            padding: moderateScale(8),
                        }}
                        maxLength={200}
                        multiline={true}
                    />

                    <View
                        style={{
                            marginTop: moderateScale(24),
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >

                        <ButtonWithLoader
                            onPress={onPressSend}
                            btnStyle={{ width: "46%" }}
                            btnText={strings.SEND}
                        />

                        <ButtonWithLoader
                            onPress={onPressCancel}
                            btnStyle={{ width: "46%", backgroundColor: colors.grey_216_025 }}
                            btnTextStyle={{ color: colors.blackColor }}
                            btnText={strings.CANCEL}
                        />

                    </View>
                </View>
            </KeyboardAwareScrollView>
        </Modal>
    )
}

export const EndCallModal = ({
    isVisible,
    onPressYes,
    onPressNo
}) => {
    return (
        <Modal
            isVisible={isVisible}
            backdropOpacity={0.1}
        >
            <View style={{
                backgroundColor: colors.grey_255_1,
                padding: moderateScale(16),
                borderRadius: moderateScale(10)
            }}>
                <Image
                    source={imagePath.end_call}
                    style={{
                        height: moderateScale(76),
                        width: moderateScale(76),
                        alignSelf: "center"
                    }}
                    resizeMode={"contain"}
                />

                <Text style={{
                    ...commonStyles.font_16_semiBold,
                    marginVertical: moderateScale(24),
                    alignSelf: "center"
                }}>{strings.Doyouwishtostopthesession}</Text>

                <Text style={{
                    ...commonStyles.font_14_regular,
                    alignSelf: "center",
                    textAlign: "center",
                    width: "90%"
                }}>{strings.Pleasenotethatthiscancellationsarenonrefundable}</Text>

                <View
                    style={{
                        marginTop: moderateScale(24),
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >

                    <ButtonWithLoader
                        onPress={onPressYes}
                        btnStyle={{ width: "46%" }}
                        btnText={strings.yes}
                    />

                    <ButtonWithLoader
                        onPress={onPressNo}
                        btnStyle={{ width: "46%", backgroundColor: colors.grey_216_025 }}
                        btnTextStyle={{ color: colors.blackColor }}
                        btnText={strings.no}
                    />

                </View>
            </View>
        </Modal>
    )
}

export const EndCallSoonModal = ({
    isVisible,
    onPressYes,
    onPressNo,
    timeLeft = ""
}) => {
    return (
        <Modal
            isVisible={isVisible}
            backdropOpacity={0.1}
        >
            <View style={{
                backgroundColor: colors.grey_255_1,
                padding: moderateScale(16),
                borderRadius: moderateScale(10)
            }}>
                <Image
                    source={imagePath.Alarm_clock}
                    style={{
                        height: moderateScale(76),
                        width: moderateScale(76),
                        alignSelf: "center"
                    }}
                    resizeMode={"contain"}
                />

                <Text style={{
                    ...commonStyles.font_16_semiBold,
                    marginTop: moderateScale(24),
                    alignSelf: "center"
                }}>{strings.thesessionwillendsoon}</Text>
                <Text style={{
                    ...commonStyles.font_14_medium,
                    alignSelf: "center",
                    textAlign: "center",
                    width: "90%",
                    opacity: 0.6,
                    marginTop: moderateScale(2),
                }}>{strings.Thevideocallwillendin + " " + timeLeft}</Text>

                <Text style={{
                    ...commonStyles.font_14_regular,
                    alignSelf: "center",
                    textAlign: "center",
                    width: "80%",
                    marginTop: moderateScale(12),
                }}>{strings.wouldyoulikeextendthesessionformins}</Text>

                <View
                    style={{
                        marginTop: moderateScale(24),
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >

                    <ButtonWithLoader
                        onPress={onPressYes}
                        btnStyle={{ width: "46%" }}
                        btnText={strings.yes}
                    />

                    <ButtonWithLoader
                        onPress={onPressNo}
                        btnStyle={{ width: "46%", backgroundColor: colors.grey_216_025 }}
                        btnTextStyle={{ color: colors.blackColor }}
                        btnText={strings.no}
                    />

                </View>
            </View>
        </Modal>
    )
}

export const ExtendSessionModal = ({
    isVisible,
    onPressContinue,
    onPressCross,
    amount = "1"
}) => {
    return (
        <Modal
            isVisible={isVisible}
            style={{ flex: 1 }}
            backdropOpacity={0.9}
        >
            <View style={{ flex: 0.6 }}>
                <View style={{
                    backgroundColor: colors.grey_255_1,
                    padding: moderateScale(16),
                    borderRadius: moderateScale(10),

                }}>
                    <Text style={{ ...commonStyles.font_20_semiBold, textAlign: "center" }}>{strings.extendYourSession}</Text>

                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: colors.grey_217_1,
                            borderRadius: moderateScale(4),
                            padding: moderateScale(12),
                            marginTop: moderateScale(32)
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ ...commonStyles.font_14_medium }}>{strings.continueSession}</Text>
                            <Text style={{ ...commonStyles.font_16_bold }}>{strings.currencyIcon + amount}</Text>
                        </View>

                        <Text style={{ ...commonStyles.font_14_regular, opacity: 0.8, marginTop: moderateScale(4) }}>{"30" + strings.minutes}</Text>
                    </View>

                    <ButtonWithLoader
                        btnText={strings.CONTINUE}
                        btnStyle={{ marginTop: moderateScale(24) }}
                        onPress={onPressContinue}
                    />
                </View>
            </View>

            <View style={{ flex: 0.2, justifyContent: "flex-end", alignItems: "center" }}>
                <TouchableOpacity style={{
                    backgroundColor: colors.white_255_016,
                    height: moderateScale(70),
                    width: moderateScale(70),
                    borderRadius: moderateScale(35),
                    justifyContent: "center",
                    alignItems: "center"
                }}
                    onPress={onPressCross}
                    activeOpacity={0.9}
                >
                    <Image
                        source={imagePath.ic_close}
                        style={{
                            tintColor: colors.whiteColor,
                            height: moderateScale(28),
                            width: moderateScale(28),
                            margin: moderateScale(24)
                        }}
                    />
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export const RenderAllVideos = ({
    therapistVideoEnabled,
    peerIds,
    channelName,
    joinSucceed,
    callTimer,
    isVideoAvailable,
    onPressChat,
    isNewMessage
}) => {
    return (
        <View style={{
            width: width,
            height: height - moderateScale(60),
            backgroundColor: colors.blackColor
        }}>
            {/* {
                    isHost ? */}
            <View style={{ flex: 1 }}>

                {/* <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={["rgba(0,0,0,0.61)", "rgba(0,0,0,0)"]}
                    style={{
                        borderRadius: moderateScale(4),
                        
                    }}> */}

                {/* </LinearGradient> */}

                {/* {therapistVideoEnabled ?
                    peerIds.map((value) => {
                        return (
                            <RtcRemoteView.SurfaceView
                                style={{ flex: 1 }}
                                uid={value}
                                channelId={channelName}
                                renderMode={VideoRenderMode.Hidden}
                                zOrderMediaOverlay={true}
                            />
                        );
                    })
                    : */}
                {/* <View style={{flex:1}}> */}

                {peerIds.map((value, index) => {
                    return (
                        <View style={{ flex: 1 }}>
                            <RtcRemoteView.SurfaceView
                                style={{ flex: 1, overflow: "hidden" }}
                                uid={value}
                                channelId={channelName}
                                renderMode={VideoRenderMode.Hidden}
                                zOrderMediaOverlay={true}
                            />
                            {!therapistVideoEnabled ?
                                Platform.OS == "ios" ?
                                    <BlurView
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                        }}
                                        blurType={Platform.OS == "android" ? "xlight" : "light"}
                                        blurAmount={Platform.OS == "android" ? 100 : 25}
                                    />
                                    :
                                    <View
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                        }}>
                                        <Image
                                            // blurRadius={5}
                                            source={imagePath.blur_image}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                right: 0,
                                            }}
                                            resizeMode={"cover"}
                                        />
                                    </View>

                                : <></>}
                        </View>
                    );
                })}
                {/* <BlurView
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                            }}
                            blurType="light"
                            // blurAmount={5}
                        /> */}
                {/* </View>
                } */}

                {
                    joinSucceed ?
                        <TouchableOpacity
                            style={styles.localMainView}
                            activeOpacity={1}
                        >
                            {
                                Platform.OS == "ios" ?
                                    isVideoAvailable ?
                                        <RtcLocalView.SurfaceView
                                            style={styles.videoSessionStyle}
                                            channelId={channelName}
                                            renderMode={VideoRenderMode.Hidden}
                                            zOrderMediaOverlay={true}
                                        />
                                        :
                                        <>
                                            <RtcLocalView.SurfaceView
                                                style={styles.videoSessionStyle}
                                                channelId={channelName}
                                                renderMode={VideoRenderMode.Hidden}
                                                zOrderMediaOverlay={true}
                                            />
                                            <BlurView
                                                style={commonStyles.blurViewStyle}
                                                blurType={Platform.OS == "android" ? "xlight" : "light"}
                                                blurAmount={Platform.OS == "android" ? 100 : 25}
                                            />
                                        </>
                                    :
                                    // isVideoAvailable ?
                                    <RtcLocalView.TextureView
                                        style={styles.videoSessionStyle}
                                        channelId={channelName}
                                        renderMode={VideoRenderMode.Hidden}
                                        zOrderMediaOverlay={true}
                                    />
                                // :
                                // <RtcLocalView.TextureView
                                //     style={styles.videoSessionStyle}
                                //     channelId={channelName}
                                //     renderMode={VideoRenderMode.Hidden}
                                //     zOrderMediaOverlay={true}
                                // />
                            }
                        </TouchableOpacity>
                        :
                        <></>
                }

                {
                    (Platform.OS == "android" && isVideoAvailable == false) ?
                        <View
                            style={{
                                height: moderateScale(200),
                                width: moderateScale(150),
                                // borderWidth: 1,
                                // borderColor: colors.borderColor,
                                position: "absolute",
                                right: moderateScale(24),
                                bottom: moderateScale(80),
                            }}>
                            <Image
                                // blurRadius={5}
                                source={imagePath.blur_image}
                                style={{
                                    height: moderateScale(200),
                                    width: moderateScale(150),
                                }}
                                resizeMode={"cover"}
                            />
                        </View>
                        // <View
                        //     style={{
                        // height: moderateScale(200),
                        // width: moderateScale(150),
                        //         // borderWidth: 1,
                        //         // borderColor: colors.borderColor,
                        //         // position: "absolute",
                        //         // right: moderateScale(24),
                        //         // bottom: moderateScale(80),
                        //         // backgroundColor: "rgba(255,255,255,0.64)"

                        //         // display: 'flex',
                        // height: moderateScale(200),
                        // width: moderateScale(150),
                        // // borderWidth: 1,
                        // // borderColor: colors.borderColor,
                        // position: "absolute",
                        // right: moderateScale(24),
                        // bottom: moderateScale(80),
                        //     }}
                        // >
                        //     <BlurView
                        //         blurType="light"
                        //         blurAmount={32}
                        //         overlayColor={'transparent'}
                        //         // downsampleFactor={10}
                        //         style={{
                        //             height: moderateScale(200),
                        //             width: moderateScale(150),
                        //         }}>
                        //         {/* <LinearGradient
                        //             colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,1)']}
                        //             start={{ x: 0, y: 1 }}
                        //             end={{ x: 1, y: 1 }}
                        //             useAngle
                        //             angle={110}
                        //             style={{
                        //                 // height: '100%',
                        //                 // width: '100%',
                        //                 // borderRadius: 20,
                        //                 // borderWidth: 2,
                        //             }}
                        //         /> */}
                        //     </BlurView>
                        // </View>
                        :
                        <></>
                }
            </View>

            <View style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.themeColor,
                alignSelf: "center",
                paddingHorizontal: moderateScale(8),
                borderRadius: moderateScale(4),
                position: "absolute",
                marginTop: moderateScale(40)
            }}>
                <Text style={{
                    ...commonStyles.font_14_bold,
                    color: colors.whiteColor
                }}>{Math.floor(callTimer / 60) + ":" + callTimer % 60}</Text>
            </View>


            <TouchableOpacity style={{
                position: "absolute",
                marginTop: moderateScale(40),
                end: moderateScale(16)
            }}
                activeOpacity={0.7}
                onPress={onPressChat}
            >
                <Image source={imagePath.chat_icon}
                    style={{
                        height: moderateScale(24),
                        width: moderateScale(24),
                    }}
                />

                {isNewMessage ? <View style={{
                    height: moderateScale(10),
                    width: moderateScale(10),
                    borderRadius: moderateScale(5),
                    backgroundColor: colors.themeColor,
                    position: "absolute",
                    end: moderateScale(2),
                    top: moderateScale(2)
                }} />
                    : <></>}
            </TouchableOpacity>

        </View>
    )
}

export const SessionExtendPaymentModal = ({
    isVisible,
    totalAmount = 0,
    walletAmount = 0,
    isWalletSelected,
    selectedPaymentMethod,
    onPressCard,
    onPressPay,
    showCardsList,
    onPressWallet,

    paymentMethodListArray,
    onPressPaymentMethod
}) => {
    return (
        <Modal
            isVisible={isVisible}
        >
            <View style={{
                backgroundColor: colors.grey_255_1,
                padding: moderateScale(16),
                borderRadius: moderateScale(10)
            }}>
                <Text style={{ ...commonStyles.font_20_semiBold, textAlign: "center" }}>{strings.makePayment}</Text>

                <AmountWalletBox
                    serviceAmount={totalAmount}
                    walletAmount={walletAmount}
                    isSelected={isWalletSelected}
                    onPressWallet={onPressWallet}
                />

                {
                    selectedPaymentMethod?.type != "wallet_pay" ?
                        <Text style={{
                            ...commonStyles.font_20_semiBold,
                            marginVertical: moderateScale(12),
                            opacity: 0.8
                        }}>{strings.payWith}</Text>
                        :
                        <></>}

                {
                    selectedPaymentMethod?.type != "wallet_pay" ?
                        !showCardsList
                            ? <CardComponent
                                isSelected={selectedPaymentMethod == "" ? false : true}
                                type={selectedPaymentMethod?.type}
                                centerText={selectedPaymentMethod?.type == "card" ? selectedPaymentMethod?.last_four_digit : selectedPaymentMethod?.value}
                                onPress={onPressCard}
                            />
                            :
                            <FlatList
                                data={paymentMethodListArray}
                                extraData={paymentMethodListArray}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => item?.id}
                                style={{ height: moderateScale(200) }}
                                renderItem={({ item, index }) => {
                                    return (
                                        <PaymentMethodList
                                            icon={item?.image}
                                            isSelected={item?.isSelected}
                                            centerText={item?.type == "card" ? "XXXXXXXXXXXX" + item?.last_four_digit : item?.value}
                                            onPress={() => onPressPaymentMethod(item, index)}
                                        />
                                    )
                                }}
                                ListFooterComponent={<View style={{ marginVertical: moderateScale(24) }} />}
                            />
                        :
                        <></>
                }

                {
                    !showCardsList ?
                        <ButtonWithLoader
                            btnText={strings.pay}
                            btnStyle={{ marginTop: moderateScale(8) }}
                            onPress={onPressPay}
                        /> : <></>
                }
            </View>
        </Modal>
    )
}

export const ChatModalView = (props) => {

    const _renderSend = (sendProps) => {
        const _send = () => {
            if (sendProps.text.trim() != "") {
                sendProps.onSend({ text: sendProps.text.trim() }, true)
            }
        }
        return (
            <TouchableOpacity
                style={{ padding: moderateScale(14), backgroundColor: colors.themeColor }}
                activeOpacity={0.9}
                onPress={_send}>
                <Text style={{
                    ...commonStyles.font_14_bold,
                    color: colors.whiteColor
                }}>{strings.SEND}</Text>
            </TouchableOpacity>
        );
    }

    const _renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                textStyle={{
                    right: {
                        color: colors.whiteColor,
                    },
                    left: {
                        color: colors.whiteColor,
                    }
                }}
                wrapperStyle={{
                    left: {
                        backgroundColor: colors.themeColor,
                        marginBottom: moderateScale(6)
                    },
                    right: {
                        backgroundColor: colors.themeColor,
                        marginBottom: moderateScale(6)
                    },
                }}
                timeTextStyle={{
                    left: {
                        color: colors.whiteColorOpacity70,
                    },
                    right: {
                        color: colors.whiteColorOpacity70,
                    },
                }}
            />
        );
    }
    return (
        <Modal
            isVisible={props.isVisible}
        // backdropOpacity={0.1}
        >
            <View style={{ flex: 1, backgroundColor: colors.whiteColor }}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: moderateScale(8),
                    paddingHorizontal: moderateScale(16),
                    borderBottomWidth: 1,
                    borderColor: colors.borderColor
                }}>
                    <View />

                    <Text style={{ ...commonStyles.font_14_semiBold, color: colors.greyBlack }}>{strings.chat}</Text>

                    <TouchableOpacity style={{
                        backgroundColor: colors.whiteColor,
                        alignItems: "flex-end"
                    }}
                        activeOpacity={1}
                        onPress={props.closeModal}
                    >
                        <Image source={imagePath.ic_cross_close}
                            style={{
                                height: moderateScale(24), width: moderateScale(24),
                                tintColor: colors.blackColor,
                            }} />
                    </TouchableOpacity>
                </View>
                <GiftedChat
                    renderSend={_renderSend}
                    messages={props?.chatMessages}
                    onSend={props._onPressSend}
                    user={{ _id: 1 }}
                    alwaysShowSend
                    renderBubble={_renderBubble}
                    renderAvatar={null}
                    keyboardShouldPersistTaps="always"
                    textInputStyle={{
                        ...commonStyles.font_14_semiBold,
                        textAlign: strings.getLanguage() == "ar" ? "right" : "left",
                    }}
                    messagesContainerStyle={{ backgroundColor: "white" }}
                />
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    buttonHeading: {
        ...commonStyles.font_10_semiBold,
        marginVertical: moderateScale(3)
    },
    localMainView: {
        height: moderateScale(200),
        width: moderateScale(150),
        borderWidth: 1,
        borderColor: colors.borderColor,
        position: "absolute",
        right: moderateScale(24),
        bottom: moderateScale(80),
        // borderRadius: moderateScale(12)
    },
    videoSessionStyle: {
        flex: 1,
        // borderRadius: moderateScale(12),
        overflow: "hidden",
    }
})
