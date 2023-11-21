import React, { PureComponent } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Platform,
    TextInput,
    Dimensions,
    ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import { Wrapper, Header, Loader } from '../../../components/common';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
    moderateScale,
} from 'react-native-size-matters';
import { actionTypes, colors, } from '../../../utilities/constants';
import { strings } from '../../../localization';
import { icons, fonts } from '../../../../assets';

import {
    GiftedChat,
    Bubble,
    Send,
    Composer,
    InputToolbar,
    SystemMessage
} from 'react-native-gifted-chat'
import ChatBubble from './ChatBubble';
import SocketIOClient from 'socket.io-client';
import { showErrorAlert } from '../../../utilities/helperFunctions';
import store from '../../../store';

const { width, height } = Dimensions.get('window');

const { dispatch } = store

class OneToOneChat extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            isLocalLoading: false,
            name: props.navigation.getParam('name'),
            id: props.navigation.getParam('id')
        };
    }

    componentDidMount() {
        this.setState({ isLocalLoading: true })
        this._navListener = this.props.navigation.addListener('willFocus', () => {
            this.connectSocket();
            this.getAllChat();
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    getAllChat = () => {
        let data = {}
        data.token = this.props && this.props.userDetails && this.props.userDetails.token
        data.other_user_id = this.state.id
        dispatch({
            type: actionTypes.GET_ALL_CHAT_MESSAGES_REQUEST,
            payload: { data },
            cb: (response) => {
                console.log(response, "get all chat user response")
                if (response.status == 200) {
                    this.setState({ isLocalLoading: false })

                    let apiData = response.data.data.messages
                    apiData.map((item, indexedDB) => {
                        item['_id'] = item.id
                        item['text'] = item.message
                        item['createdAt'] = item.created_at
                        item['user'] = {
                            _id: item.sender_id == data.other_user_id ? 1 : 2
                        }
                    })
                    this.setState({
                        messages: [...this.state.messages, ...apiData],
                    })
                } else {
                    this.setState({ isLocalLoading: false })
                    showErrorAlert(response && response.data && response.data.message || strings.serverError)
                }
            }
        })
    }

    connectSocket = () => {
        let token = this.props && this.props.userDetails && this.props.userDetails.token

        let socketUrl = `http://socket.saslras.com/?access_token=${token}`;

        let socket = SocketIOClient(socketUrl, { transports: ['websocket'] });

        socket.on('connect', () => {
            console.log('=====> socket connected <=====');
        })

        socket.on('sendMsgResp', (response) => {
            console.log(response, "socket listner response customer");
            let newMessage = {}
            newMessage._id = response.message.id
            newMessage.createdAt = response.message.created_at
            newMessage.text = response.message.message
            newMessage.user = {
                _id: response.message.sender_id
            }

            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, newMessage),
            }));
        })

        // let markReadData = {}
        // markReadData.sender_id = this.props.userDetails.id
        // markReadData.receiver_id = this.state.id
        // socket.emit("mark-read", markReadData, (response) => {
        //     console.log(response, "response------> mark read");
        // })

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

    renderSystemMessage = (props) => {
        return (
            <SystemMessage {...props}>
                {/* <TouchableWithoutFeedback onPress={() => {
                    props.navigation.navigate("SupportTopTabStack")
                    // props.navigation.navigate("Profile", { screen: "SupportTopTabStack", initial: false })
                }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <View style={styles.iconContainer}>
                            <Image
                                source={require('../../../src/assets/images/ic_pin.png')}
                                style={commonStyles.image}
                                resizeMode="cover"
                            />
                        </View>
                        <View style={{ paddingLeft: moderateScale(10) }}>
                            <Text style={styles.themeHeading}>Chat with FanBasis</Text>
                            <Text style={styles.themeText}>Have any questions? Let us know!</Text>
                        </View>

                    </View>
                </TouchableWithoutFeedback> */}
            </SystemMessage>
        )
    }

    renderChats = (props) => {
        return (
            <ChatBubble {...props} />
        );

    }

    onSend = (messages = []) => {
        console.log(messages, "on-send");
        if (messages[0].text.trim()) {
            let token = this.props && this.props.userDetails && this.props.userDetails.token

            let socketUrl = `http://socket.saslras.com/?access_token=${token}`;

            let socket = SocketIOClient(socketUrl, { transports: ['websocket'] });

            socket.on('connect', () => {
                console.log('=====> socket connected <===== 111');
            })

            let socketMessage = {};
            socketMessage._id = Math.random()
            socketMessage.sender_id = this.props.userDetails.id
            socketMessage.receiver_id = this.state.id
            socketMessage.message = messages[0].text.trim()
            socketMessage.message_type = 1


            socket.emit("send-message", socketMessage, (response) => {
                console.log(response, "<<< ==== SOCKET EMIT RES");
                if (response.statusCode == 200) {
                    this.setState(previousState => ({
                        messages: GiftedChat.append(previousState.messages, messages),
                    }));
                } else {
                    showErrorAlert(response && response.message || strings.serverError)
                }
            });

            socket.on('sendMsgResp', (response) => {
                console.log(response, "socket listner response customer");
                let newMessage = {}
                newMessage._id = response.message.id
                newMessage.createdAt = response.message.created_at
                newMessage.text = response.message.message
                newMessage.user = {
                    _id: response.message.sender_id
                }
                this.setState(previousState => ({
                    messages: GiftedChat.append(previousState.messages, newMessage),
                }));
            })

            // console.log(("1111111"));
            // let markReadData = {}
            // markReadData.sender_id = this.props.userDetails.id
            // markReadData.receiver_id = this.state.id
            // socket.emit("mark-read", markReadData, (response) => {
            //     console.log(response, "response------> mark read");
            // })
            // console.log(("222222"));
        }
    };

    renderSend = (sendProps) => {
        console.log(sendProps, "sendProps")
        return (
            <TouchableOpacity style={{ margin: moderateScale(14) }}
                onPress={() => sendProps.onSend({ text: sendProps.text.trim() }, true)}>
                <Text style={{
                    fontFamily: fonts.bold,
                    fontSize: moderateScale(14),
                    color: colors.blue2
                }}>{strings.send}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        const { messages, isLocalLoading } = this.state;
        const { userDetails } = this.props;
        let sendFirstHi = [{
            createdAt: new Date(),
            text: "Hi",
            user: {
                _id: 2
            },
            _id: Math.random() + "1760-8b27-b9951cccf861" + Math.random()
        }]

        return (
            <ImageBackground source={icons.ic_marble_bg}
                style={{ width: '100%', height: "100%" }}
                resizeMode={"cover"}
            >

                <Wrapper wrapperStyle={{ backgroundColor: "transparent" }}>
                    <Header
                        containerStyle={{ backgroundColor: colors.black2 }}
                        titleStyle={{ fontFamily: fonts.bold }}
                        leftIconSource={strings.getLanguage() == "ar" ? icons.ic_forward_white : icons.ic_back_white}
                        onLeftPress={() => {
                            this.getAllChat(),
                                this.props.navigation.goBack()
                        }}
                        selectedLangIs={strings.getLanguage()}
                        centerTitle={this.state.name}
                    />

                    <GiftedChat
                        isTyping={true}
                        messages={messages}
                        renderSend={this.renderSend}
                        onSend={messages => this.onSend(messages)}
                        renderBubble={this.renderChats}
                        user={{ _id: 2 }}
                        alwaysShowSend
                        // renderSend={renderSend}
                        renderAvatar={null}
                        keyboardShouldPersistTaps="handled"
                        textInputStyle={{
                            ...styles.messageTextInput,
                            textAlign: strings.getLanguage() == "ar" ? "right" : "left"
                        }}
                        placeholder={strings.typeHere}
                        renderChatFooter={() => (!messages.length && isLocalLoading == false) ?
                            <TouchableOpacity
                                onPress={() => this.onSend(sendFirstHi)}
                            >
                                <Text style={{
                                    textAlign: "center",
                                    marginBottom: moderateScale(24)
                                }}>Say 'Hi'</Text></TouchableOpacity> : <></>}
                    // renderActions={() => <Text>Test</Text>}
                    // renderInputToolbar={renderInputToolbar}

                    // }}
                    // renderComposer={renderComposer}
                    // minComposerHeight={60}
                    // minInputToolbarHeight={(65)}
                    // renderSystemMessage={(props) => {
                    //     console.log("-----INSIDE renderSystemMessage-----")
                    //     this.renderSystemMessage(props)
                    // }}
                    />
                </Wrapper>
                <Loader
                    isLoading={this.state.isLocalLoading}
                    isAbsolute
                />
            </ImageBackground>
        )
    }
}
const styles = StyleSheet.create({
    name: {
        fontFamily: fonts.regular,
        fontSize: 15,
        color: "#282525",
    },
    backIconContainer: {
        height: width * .08,
        width: width * .08,
        overflow: "hidden",
        // backgroundColor: "lightgreen",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: Platform.OS === "android" ? moderateScale(10) : 0

    },
    imageContainer: {
        height: width * .08,
        width: width * .08,
        borderWidth: 1,
        borderRadius: (width * .08) / 2,
        borderColor: colors.white1,
        overflow: "hidden",
        marginHorizontal: moderateScale(10)
        // marginBottom: 10.
    },
    iconContainer: {
        height: 24,
        width: 24,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: colors.white1,
        overflow: "hidden",
        // marginBottom: 10.
    },
    separator: {
        width: "100%",
        marginVertical: 2
    },
    themeHeading: {
        fontFamily: fonts.regular,
        fontSize: 16,
        color: colors.themeColor,
    },
    themeText: {
        fontFamily: fonts.regular,
        fontSize: 13,
        color: colors.themeColor,
    },

    messageTextInput: {
        backgroundColor: colors.lightGray,
        paddingTop: Platform.OS == 'ios' ? 8 : undefined,
        // padding: Platform.OS == 'ios' ? 8 : undefined,
        // paddingTop: moderateScaleVertical(10),
        borderRadius: 20,
        paddingRight: 5,
        // marginVertical: 30,
        textAlignVertical: 'center',
        fontFamily: fonts.regular,
        alignSelf: 'center',
        // borderWidth: 1,
        // borderColor: colors.blackOpacity12,
        // backgroundColor: "pink",
        // marginTop: Platform.OS == 'android' ? moderateScaleVertical(10) : moderateScaleVertical(5),
        // marginBottom: moderateScaleVertical(5)
    },

});



const mapStateToProps = ({ auth, app }) => ({
    userDetails: auth.userDetails,
    loading: app.loading,
});
export default connect(mapStateToProps, null)(OneToOneChat);
