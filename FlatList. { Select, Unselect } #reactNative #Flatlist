import React, { Component, } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Dimensions,
    TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker'

import styles from './CheckoutStyles'
import { colors } from '../../styles/colors';
import { Images } from '../../constants/ImagePath';
import { spacing } from '../../styles/spacing';
import strings from '../../constants/LocalizedStrings';
import { moderateScale, width } from '../../styles/responsiveStyles';
import { CommonHeaderHome } from '../../components/molecules/CommonHeaderHome';
import { typography, fontNames } from '../../styles/typography';
import commonStyles from '../../styles/commonStyles';
import { CommonHomeButtons, ThemeButtton } from '../../components/molecules/Button';
import { Header } from '../../components/molecules/Header'

export default class CheckoutScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: "",
            name: "Nicholas Harmon",
            address: "3065 Kirlin Prairie Suit 200, Sector 29D, opp.t Tribune colony Chandigarh, 160036 ",
            ADDRESS: [
                {
                    id: 1,
                    name: "Nicholas Harmon",
                    address: "3065 Kirlin Prairie Suit 200, Sector 29D, opp.t Tribune colony Chandigarh, 160036 ",
                },
                {
                    id: 2,
                    name: "Nicholas Harmon",
                    address: "3065 Kirlin Prairie Suit 200, Sector 29D, opp.t Tribune colony Chandigarh, 160036 ",
                }
            ],
            SAVED_CARD: [
                {
                    id: 1,
                    cardName: "Credit Card"
                },
                {
                    id: 2,
                    cardName: "Debit Card"
                },
                {
                    id: 3,
                    cardName: "MyVitrines Wallet"
                },
                {
                    id: 4,
                    cardName: "Cash on delivery"
                },
            ],
            price: "9,742.58",
        };
    }

    componentDidMount() {
        const { ADDRESS, SAVED_CARD } = this.state;

        let arr = ADDRESS.map((item, index) => {
            item.isSelect = false;
            return { ...item };
        })

        let saveCardArr = SAVED_CARD.map((item, index) => {
            item.isSelect = false;
            return { ...item };
        })
    }


    goBack = () => {
        this.props.navigation.goBack();
    }

    selectAddress = (id) => {
        const { ADDRESS } = this.state;
        let arr = ADDRESS.map((item, index) => {
            item.isSelect = false;
            if (id - 1 == index) {
                item.isSelect = !item.isSelect
            }
            return { ...item }
        })
        this.setState({ ADDRESS: arr })
    }
    selectCard = (id) => {
        const { SAVED_CARD } = this.state;

        let arr = SAVED_CARD.map((item, index) => {
            item.isSelect = false;
            if (id - 1 == index) {
                item.isSelect = !item.isSelect
            }
            return { ...item }
        })
        this.setState({ SAVED_CARD: arr })
    }

    render() {
        const { ADDRESS, SAVED_CARD } = this.state;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
                <Header
                    leftIcon={Images.ic_back}
                    leftIconStyle={{ justifyContent: "center" }}
                    onPressLeft={this.goBack}
                    centerTitle={strings.checkout}
                />
                <ScrollView>
                    <View style={{ ...commonStyles.margin8_16 }}>
                        <Text style={{ ...styles.fontSize14Bold }}>{strings.deliveryAddress}</Text>
                    </View>

                    <View style={{ ...commonStyles.margin16_16, marginTop: 0 }}>
                        <FlatList
                            data={ADDRESS}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) =>
                                <View style={{ flexDirection: "row", flex: 1, marginTop: spacing.MARGIN_16 }}>
                                    <TouchableOpacity style={{ flex: 0.1 }} onPress={() => this.selectAddress(item.id)}>
                                        <Image source={
                                            item.isSelect ?
                                                Images.ic_radio : Images.ic_radio_inactive
                                        } />
                                    </TouchableOpacity>
                                    <View style={{ flex: 0.9 }}>
                                        <Text style={{ ...styles.fontSize16Bold }}>{item.name}</Text>
                                        <Text style={{ ...styles.fontSize16Book, masrginTop: spacing.MARGIN_4 }}>{item.address}</Text>

                                    </View>
                                </View>
                            }
                        />
                    </View>
                    <View style={{ marginHorizontal: spacing.MARGIN_16, marginTop: spacing.MARGIN_48 }}>
                        <Text style={{ ...styles.fontSize14Bold }}>{strings.deliveryAddress}</Text>
                    </View>

                    <View style={{ ...commonStyles.margin16_16, marginTop: 0, marginBottom: spacing.MARGIN_32 }}>
                        <FlatList
                            data={SAVED_CARD}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) =>
                                <View style={{ flexDirection: "row", flex: 1, marginTop: spacing.MARGIN_16 }}>
                                    <TouchableOpacity style={{ flex: 0.1 }} onPress={() => this.selectCard(item.id)}>
                                        <Image source={
                                            item.isSelect ?
                                                Images.ic_radio : Images.ic_radio_inactive
                                        } />
                                    </TouchableOpacity>
                                    <View style={{ flex: 0.9 }}>
                                        <Text style={{ ...styles.fontSize16Bold }}>{item.cardName}</Text>
                                        {
                                            item.isSelect == true && (item.cardName == "Credit Card" || item.cardName == "Debit Card") ?
                                                <View>
                                                    <View style={{ flex: 1, ...commonStyles.flexBetween, marginTop: spacing.MARGIN_24, borderBottomWidth: 1, paddingBottom: spacing.MARGIN_16 }}>
                                                        <View style={{ flex: 0.86 }}>
                                                            <View style={{}}>
                                                                <TextInput
                                                                    style={{ ...styles.fontSize18 }}
                                                                    underlineColorAndroid="transparent"
                                                                    placeholder={"1234 5678 1012 3456"}
                                                                    keyboardType="numeric"
                                                                    maxLength={16}
                                                                    placeholderTextColor={colors.GREY_066}
                                                                    autoCapitalize="none"
                                                                // onChangeText={}
                                                                />
                                                            </View>
                                                        </View>
                                                        <View style={{ flex: 0.1 }}>
                                                            <Image source={Images.ic_card_thumbnail} />
                                                        </View>
                                                    </View>

                                                    <View style={{ flex: 1, ...commonStyles.flexBetween, marginTop: spacing.MARGIN_24, borderBottomWidth: 1, paddingBottom: spacing.MARGIN_16 }}>
                                                        <View style={{}}>
                                                            <View style={{}}>
                                                                <TextInput
                                                                    style={{ ...styles.fontSize18, }}
                                                                    underlineColorAndroid="transparent"
                                                                    placeholder={"Name on the Card"}
                                                                    placeholderTextColor={colors.GREY_066}
                                                                    autoCapitalize="none"
                                                                // onChangeText={}
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View style={{ flex: 1, ...commonStyles.flexBetween, marginTop: spacing.MARGIN_24 }}>
                                                        <View style={{ flex: 0.48, borderBottomWidth: 1, }}>

                                                            <DatePicker
                                                                style={{ borderWidth: 0, ...styles.fontSize18, }}
                                                                date={this.state.date}
                                                                mode="date"
                                                                placeholder="Expiry Date"
                                                                placeholderText={{ fontSize: 16, }}
                                                                format="DD-MM-YYYY"
                                                                minDate="2020-05-01"
                                                                maxDate="2050-06-01"
                                                                confirmBtnText="Confirm"
                                                                cancelBtnText="Cancel"
                                                                showIcon={false}
                                                                customStyles={{
                                                                    dateInput: {
                                                                        borderWidth: moderateScale(0),
                                                                        fontSize: 16,
                                                                        alignItems: "flex-start",
                                                                        marginBottom: spacing.MARGIN_16
                                                                    },
                                                                    dateText: {
                                                                        ...styles.fontSize18,
                                                                        textAlign: "left"
                                                                    },
                                                                    placeholderText: {
                                                                        ...styles.fontSize18,
                                                                        textAlign: "left",
                                                                        color: colors.GREY_066
                                                                    }
                                                                }}
                                                                onDateChange={(date) => { this.setState({ date: date }) }}
                                                            />

                                                        </View>
                                                        <View style={{ ...commonStyles.flexBetween, flex: 0.48, borderBottomWidth: 1, }}>
                                                            <View style={{}}>

                                                                <TextInput
                                                                    style={{ ...styles.fontSize18, }}
                                                                    underlineColorAndroid="transparent"
                                                                    placeholder={"CVV"}
                                                                    keyboardType="numeric"
                                                                    maxLength={3}
                                                                    placeholderTextColor={colors.GREY_066}
                                                                    autoCapitalize="none"
                                                                // onChangeText={}
                                                                />

                                                            </View>
                                                            <TouchableOpacity>
                                                                <Image source={Images.ic_alert_small} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                                :
                                                <View />
                                        }
                                    </View>
                                </View>
                            }
                        />
                    </View>
                </ScrollView>

                <View style={{ marginHorizontal: spacing.MARGIN_16, marginVertical: spacing.MARGIN_24 }}>
                    <ThemeButtton
                        buttonText={[strings.pay, strings.indian_currency, " ", this.state.price]}
                    />
                </View>
            </SafeAreaView>
        );
    }
}
