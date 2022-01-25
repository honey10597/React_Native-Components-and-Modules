
import React, { PureComponent } from 'react';
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar,
    Platform,
    RefreshControl,
    Dimensions,
    ImageBackground,
    ActivityIndicator,
    FlatList
} from 'react-native';
// import ActionSheet from 'react-native-action-sheet';
import {
    moderateScale,
} from 'react-native-size-matters';
// import { SwipeListView } from 'react-native-swipe-list-view';
import { connect } from 'react-redux';
// import cloneDeep from 'clone-deep';

import {
    Wrapper,
    // HeaderWithLeftTitle,
    // Button,
    // EmptyListComponent,
    Loader,
    Header
} from '../../../components/common';
import {
    colors,
    // screenNames,
    // chatOperationTypes,
    // socketEvents,
    // MESSAGE_STATUS,
    // dummyChat,
    // DummyFanImageUri,
    actionTypes,
    urls
} from '../../../utilities/constants';
// import { ChatCard } from '../../components/AllChats';
import { strings } from '../../../localization';
// import { navigate } from '../../../utilities/NavigationService';
import commonStyles from '../../../utilities/commonStyles';
import { icons, fonts } from '../../../../assets';
// import socketServices from '../../utilities/socketServices';
// import logger from '../../../utilities/logger';
import store from '../../../store';
import moment from 'moment';
import SocketIOClient from 'socket.io-client';

// const BUTTONSiOS = [
//     // 'Clear Chat',
//     'Delete Chat',
//     'Cancel'
// ];

// const BUTTONSandroid = [
//     // 'Clear Chat',
//     'Delete Chat',
// ];
// const keyExtractor = (item) => String(item.id);

const { width, height } = Dimensions.get('window');
const { dispatch } = store

class AllChats extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // listViewData: Array(2)
            //     .fill('')
            //     .map((_, i) => ({ key: `${i}`, text: `item #${i}` })),
            chatUserList: [],
            isLoading: false,
            lastMessage: "",
            lastMessageTime: ""
        };

        // this.rowSwipeAnimatedValues = {};
        // Array(2)
        //     .fill('')
        //     .forEach((_, i) => {
        //         this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
        //     });
    }

    componentDidMount() {
        this.setState({ isLoading: true })
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            this.connectSocket();
            this.getChatUserListing()
        });
    }

    connectSocket = () => {
        let token = this.props && this.props.userDetails && this.props.userDetails.token

        let socketUrl = `http://socket.saslras.com/?access_token=${token}`;

        let socket = SocketIOClient(socketUrl, { transports: ['websocket'] });

        socket.on('connect', () => {
            console.log('=====> socket connected <=====');
        })

        socket.on('sendMsgResp', (response) => {
            console.log(response, "socket listner response customer at all chats");
            let newMessage = {}
            newMessage._id = response.message.id
            newMessage.createdAt = response.message.created_at
            newMessage.text = response.message.message
            newMessage.user = {
                _id: response.message.sender_id
            }
            this.getChatUserListing()
        })

        // socket.on('disconnect', () => {
        //     console.log('socket disconnected');
        // });
        socket.on('connect_error', err => {
            console.log('socket connection error: ', JSON.stringify(err));
        })
        socket.on('error', err => {
            console.log('socket error: ', JSON.stringify(err));
        })
        socket.on('connection', () => {
            console.log('response from server')
        })
    }

    getChatUserListing = () => {
        // console.log(this.props.userDetails.user_type, "ooopopoopop");
        let data = {}
        data.token = this.props.userDetails.token
        data.user_type = this.props.userDetails.user_type
        dispatch({
            type: actionTypes.GET_ALL_CHAT_USERS_LIST_REQUESTED,
            payload: { data },
            cb: (res) => {
                this.setState({ isLoading: false, isRefreshing: false })
                if (res.status == 200) {
                    this.setState({
                        chatUserList: res.data.data
                    }, () => {
                        console.log(this.state.chatUserList, "chatUserList");
                    })
                }
            }
        })
    }

    // componentWillUnmount() {
    //     this._navListener.remove();
    //     socketServices.removeListener(socketEvents.onMessageReceivedOnAllChatsScreen);
    // }


    // onLoginPress = () => {
    //     if (getAppId() === appTypes.shilengae.id) {
    //         return navigate(screenNames.Signup, { hasComeFromMainApp: true, loginKeyId: this.props.navigation.state.key });
    //     }
    //     return navigate(screenNames.Login, { hasComeFromMainApp: true });
    // }


    // onRowDidOpen = rowKey => {
    //     console.log('This row opened', rowKey);
    // };

    // onSwipeValueChange = swipeData => {
    //     const { key, value } = swipeData;
    //     this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
    // };

    // onRefreshChats = () => this.props.getAllChats();

    // addSocketListeners = () => {
    //     const { userId } = this.props;
    //     socketServices.on(socketEvents.onMessageReceivedOnAllChatsScreen, (messageData) => {
    //         logger.log('message received on AllChats Screen is: ', messageData);

    //         /* if (
    //             messageData.senderId === userId //other user sent the message
    //             && messageData.chatId !== this.props.currentChatData.chatId //other chat is opened
    //             // && messageData.receiverId !== this.props.currentChatData.receiverid
    //         ) { //other user sent the message. mark the message as delivered
    //             console.log('other chat is opened');
    //             socketServices.emit(socketEvents.deliverMessage, messageData);
    //         } */

    //         if (
    //             messageData.senderId !== userId //other user sent the message
    //             && messageData.chatId !== this.props.currentChatData.chat_id //other chat is opened
    //         ) { //other user sent the message. mark the message as delivered
    //             socketServices.emit(socketEvents.deliverMessage, messageData);
    //         }

    //         const chat = this.props.allChats.find((c) => c.chat_id === messageData.chatId);

    //         if (chat) {
    //             let updatedAllChats = cloneDeep(this.props.allChats);

    //             updatedAllChats = updatedAllChats.map((c) => {
    //                 if (c.chat_id === messageData.chatId) {
    //                     c.message = messageData.message;
    //                     c.msgtype = messageData.messageType;
    //                     c.created_atz = messageData.created_at;
    //                     c.sender_id = messageData.senderId;

    //                     if (messageData.senderId !== this.props.userId) {
    //                         c.message_status = MESSAGE_STATUS.delivered;
    //                     }
    //                 }

    //                 return c;
    //             });

    //             logger.data('updated chats: ', updatedAllChats, true);

    //             this.props.updateAllChatsFromSocket(updatedAllChats);
    //         } else {
    //             this.props.getAllChats();
    //         }
    //     });
    // };

    // closeRow(rowMap, rowKey) {
    //     if (rowMap[rowKey]) {
    //         rowMap[rowKey].closeRow();
    //     }
    // }

    // deleteRow(rowMap, rowKey) {
    //     this.closeRow(rowMap, rowKey);
    //     const newData = [...this.state.listViewData];
    //     const prevIndex = this.state.listViewData.findIndex(
    //         item => item.key === rowKey
    //     );
    //     newData.splice(prevIndex, 1);
    //     this.setState({ listViewData: newData });
    // }

    // openActionSheet = ({ item }) => {
    //     ActionSheet.showActionSheetWithOptions({
    //         options: (Platform.OS === 'ios') ? BUTTONSiOS : BUTTONSandroid,
    //         cancelButtonIndex: 1,
    //     },
    //         async (buttonIndex) => {
    //             switch (buttonIndex) {
    //                 case 0:
    //                     this.props.clearOrDeleteChat({
    //                         chatId: item.chat_id,
    //                         otherUserId: item.receiverid,
    //                         operationType: chatOperationTypes.delete
    //                     });
    //                     break;

    //                 default:
    //                     break;
    //             }
    //         }
    //     );
    // };


    renderChats = ({ item }) => {

        return (
            <TouchableOpacity
                style={{
                    margin: moderateScale(6),
                    backgroundColor: colors.black1,
                    borderRadius: moderateScale(8)
                }}
                onPress={() => this.props.navigation.navigate("OneToOneChat", { name: item.first_name, id: item.id })}
            >
                <View style={styles.chat}>
                    <View style={styles.left}>
                        <View style={{
                            // height: width * .15,
                            // width: width * .15,
                            borderWidth: 1,
                            borderRadius: (width * .15) / 2,
                            borderColor: colors.whiteColor,
                            overflow: "hidden",
                            margin: moderateScale(6)
                        }}>
                            <Image
                                source={{ uri: urls.imageUrl1 + item.profile_picture || 'https://manjeettattooz.com/wp-content/uploads/2018/09/User-dummy-300x300.png' }}
                                style={{
                                    height: moderateScale(54),
                                    width: moderateScale(54),
                                    backgroundColor: colors.white1
                                }}
                            // resizeMode="cover"
                            />
                        </View>
                        <View style={{ paddingLeft: moderateScale(10) }}>
                            <Text style={commonStyles.blackText16}>{item.first_name + " " + item.last_name}</Text>
                            <Text style={{
                                ...styles.msgText,
                                fontFamily: (item?.last_msg?.is_read == 0 && item?.last_msg?.sender_id != this.props.userDetails.id) ? fonts.regular : fonts.bold,
                                fontSize: (item?.last_msg?.is_read == 0 && item?.last_msg?.sender_id != this.props.userDetails.id) ? moderateScale(17) : moderateScale(14),
                            }}>{item?.last_msg?.message}</Text>
                        </View>
                    </View>

                    <View style={{ paddingRight: moderateScale(8) }}>
                        {item?.last_msg?.message ?
                            // <Text style={{ ...styles.msgTime }}>{moment(item?.last_msg?.created_at).format("hh:mm a")}</Text> 


                            <Text style={{ ...styles.msgTime }}>{moment(item?.last_msg?.created_at).startOf('minute').fromNow()}</Text>

                            : <></>
                        }
                        {item?.unread > 0 ?
                            <View style={{ ...styles.unReadCount }}>
                                <Text style={{
                                    color: colors.black1,
                                    fontFamily: fonts.regular
                                }}>{item?.unread}</Text>
                            </View> : <></>}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    // renderHiddenItem = (data, rowMap) => (
    //     <View style={styles.hiddenContainer}>
    //         <TouchableOpacity
    //             style={styles.moreButton}
    //             onPress={() => {
    //                 // this.closeRow(rowMap, data.item.key);
    //                 this.openActionSheet(data);
    //             }}
    //             activeOpacity={0.6}
    //         >
    //             <Image source={icons.ic_chat_more} />
    //             <Text style={styles.moreText}>
    //                 {'More'}
    //             </Text>
    //         </TouchableOpacity>
    //     </View>
    // );

    // renderListEmptyComponent = () => {
    //     const { loading } = this.props;

    //     if (loading) {
    //         return null;
    //     }

    //     return (
    //         <EmptyListComponent
    //             message={strings.noDataFound}
    //             emptyTextStyle={commonStyles.emptyListText}
    //             containerStyle={commonStyles.emptyListContainer}
    //         />
    //     );
    // };

    handleRefresh = () => {
        this.setState({ isRefreshing: true })
        this.getChatUserListing();
    }

    render() {
        // let t = moment("2021-05-26T12:12:55.000000Z").format('llll')
        // console.log(moment(t).startOf('minute').fromNow(), "oppopopppoppopopop");
        const { userDetails } = this.props;
        // if (userId) {
        // let content = (
        //     <>
        //         <SwipeListView
        //             data={this.state.chatUserList}
        //             previewRowKey={'0'}
        //             rightOpenValue={-moderateScale(90)}
        //             previewOpenValue={-moderateScale(90)}
        //             previewOpenDelay={3000}
        //             disableRightSwipe
        //             contentContainerStyle={styles.listContainer}
        //             keyExtractor={keyExtractor}
        //             showsVerticalScrollIndicator={false}

        //             renderItem={this.renderChats}
        //             // renderHiddenItem={this.renderHiddenItem}
        //             ListEmptyComponent={this.renderListEmptyComponent}

        //         // refreshControl={
        //         //     <RefreshControl
        //         //         refreshing={loading}
        //         //         onRefresh={this.onRefreshChats}
        //         //     />
        //         // }

        //         // onRowDidOpen={this.onRowDidOpen}
        //         // onSwipeValueChange={this.onSwipeValueChange}
        //         />
        //         {/* <Loader
        //             isLoading={deletingChat}
        //             isAbsolute
        //         /> */}
        //     </>
        // );
        // } 
        // else if (userId && allChats.length === 0 && loading) {
        //     content = (
        //         <Loader isLoading />
        //     );
        // } 
        // else if (userId && allChats.length === 0) {
        //     content = (
        //         <EmptyListComponent
        //             message={strings.noChatsYet}
        //             emptyTextStyle={commonStyles.emptyListText}
        //         />
        //     );
        // }

        return (
            <ImageBackground source={icons.ic_marble_bg}
                style={{ width: '100%', height: '100%' }}
                resizeMode={"cover"}
            >
                <Wrapper wrapperStyle={styles.wrapperStyle}>
                    <Header
                        containerStyle={{ backgroundColor: colors.black2 }}
                        // title={strings.appName}
                        titleStyle={{ fontFamily: fonts.bold }}
                        leftIconSource={strings.getLanguage() == "ar" ? icons.ic_forward_white : icons.ic_back_white}
                        onLeftPress={() => { this.props.navigation.goBack() }}
                        selectedLangIs={strings.getLanguage()}
                        centerTitle={strings.chat}
                    />
                    {/* {content} */}

                    <FlatList
                        data={this.state.chatUserList}
                        renderItem={this.renderChats}
                        onEndReachedThreshold={0.5}
                        ListEmptyComponent={
                            <Text
                                style={{
                                    alignSelf: "center",
                                    marginTop: moderateScale(16)
                                }}
                            >{this.state.isLoading ? strings.loading : strings.No_record_found}</Text>
                        }
                        ListFooterComponent={this.state.endLoading ? <View style={{
                            marginVertical: moderateScale(6),
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <ActivityIndicator color={"black"} />
                        </View> : <View style={{ height: moderateScale(152) }} />
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                    />
                    <Loader
                        isLoading={this.state.isLoading}
                        isAbsolute
                    />
                </Wrapper>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    wrapperStyle: {
        backgroundColor: "transparent"
    },
    listContainer: {
        paddingBottom: moderateScale(60),
        // paddingLeft: moderateScale(15)
    },
    headerContainer: {
        borderBottomWidth: moderateScale(0.5),
        borderBottomColor: colors.grey4
    },
    hiddenContainer: {
        flex: 1,
        alignItems: 'flex-end'
    },
    moreButton: {
        flex: 1,
        width: moderateScale(90),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.grey2,
    },
    moreText: {
        color: colors.white1,
        fontFamily: fonts.regular,
        fontSize: moderateScale(16)
    },
    chat: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 5
    },
    imageContainer: {
        height: width * .15,
        width: width * .15,
        borderWidth: 1,
        borderRadius: (width * .15) / 2,
        borderColor: colors.whiteColor,
        overflow: "hidden",
        margin: moderateScale(6)
    },
    left: {
        flexDirection: "row",
        width: "60%",
        alignItems: "center"
    },
    right: {
        // flex: 1,
        alignItems: "flex-end"
    },
    separator: {
        width: "100%",
        borderBottomWidth: 1,
        borderColor: colors.blackOpacity10,
        marginVertical: 10
    },
    msgText: {
        fontSize: moderateScale(14),
        color: colors.white1,
        marginTop: moderateScale(4)
    },
    msgTime: {
        fontFamily: fonts.regular,
        fontSize: 14,
        color: colors.white1,
        textAlign: "right"
    },
    unReadCount: {
        backgroundColor: colors.white1,
        height: moderateScale(16),
        borderRadius: moderateScale(8),
        width: moderateScale(16),
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginTop: moderateScale(4)
    }
});


const mapStateToProps = ({ auth, app }) => ({
    userDetails: auth.userDetails,
    loading: app.loading,
});

export default connect(mapStateToProps, null)(AllChats);
