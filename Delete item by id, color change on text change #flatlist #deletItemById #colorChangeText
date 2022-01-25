import React, { Component, } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    ScrollView,
    FlatList,
    TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNPickerSelect from 'react-native-picker-select';

import styles from './CartStyles';
import { colors } from '../../styles/colors';
import { Images } from '../../constants/ImagePath';
import { spacing } from '../../styles/spacing';
import strings from '../../constants/LocalizedStrings';
import { moderateScale, width } from '../../styles/responsiveStyles';
import { typography, fontNames } from '../../styles/typography';
import commonStyles from '../../styles/commonStyles';
import { ThemeButtton } from '../../components/molecules/Button';
import { Header } from '../../components/molecules/Header'
import { Colors } from 'react-native/Libraries/NewAppScreen';


export default class CartScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            price: "",

            CART: [
                {
                    id: 1,
                    img: Images.ic_cart_img_1,
                    itemName: "Four colored striped ties",
                    price: "2,990.00",
                    quantity: [
                        { label: '02', value: 2 },
                        { label: '03', value: 3 },
                        { label: '04', value: 4 },
                    ],
                },
                // {
                //     id: 2,
                //     img: Images.ic_cart_img_2,
                //     itemName: "Elegant Set of Coat and Scarf",
                //     price: "2,990.00",
                //     quantity: [
                //         { label: '02', value: 2 },
                //         { label: '03', value: 3 },
                //         { label: '04', value: 4 },
                //     ],
                // },
                // {
                //     id: 3,
                //     img: Images.ic_cart_img_3,
                //     itemName: "Beautiful sky color formal shirt",
                //     price: "2,990.00",
                //     quantity: [
                //         { label: '02', value: 2 },
                //         { label: '03', value: 3 },
                //         { label: '04', value: 4 },
                //     ],
                // }
            ],
            promoCode: "",
            borderBottomColor: Colors.APP_BLACK,
            validPromoCode: '123456',
            totalAmount: "8,997.00",
            promoCodeAmmount: "00.00",
            totalTax: "745.58",
            netTotal: "9,742.58",
        };
    }

    componentDidMount = async () => {
        const value = await AsyncStorage.getItem('TITLE');
        const valueTwo = await AsyncStorage.getItem('PRICE');
        this.setState({
            title: value,
            price: valueTwo,
        })
    }

    deleteItemById = (id) => {
        const filteredData = this.state.CART.filter(item => item.id !== id);
        this.setState({ CART: filteredData });
    }

    cleanPromoCode = () => {
        this.setState({
            promoCode: "",
            borderBottomColor: colors.APP_BLACK
        })
    }


    onChangeTextPromoCode = (promoCode) => {
        this.setState({
            promoCode: promoCode,
            borderBottomColor: colors.RED_WARNING
        })
        if (promoCode == "" || promoCode == this.state.validPromoCode) {
            this.setState({
                borderBottomColor: colors.APP_BLACK
            })
        }
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    checkoutScreen = () => {
        this.props.navigation.navigate("checkoutScreen");
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
                <Header
                    leftIcon={Images.ic_back}
                    leftIconStyle={{ marginTop: spacing.MARGIN_4 }}
                    onPressLeft={this.goBack}
                    centerTitle={strings.shoppingCart}
                />
                <ScrollView>
                    <View style={{ ...commonStyles.margin16_24, }}>
                        <FlatList
                            data={this.state.CART}
                            renderItem={({ item }) =>
                                <View>
                                    <View style={{ ...styles.flatListView }}>
                                        <View style={{ flex: 0.18 }}>
                                            <Image source={item.img} />
                                        </View>
                                        <View style={{ flex: 0.78, paddingLeft: spacing.MARGIN_16 }}>
                                            <View style={{ ...commonStyles.flexBetween }}>
                                                <Text style={{ ...styles.fontSize14 }}>{this.state.title}</Text>
                                                <TouchableOpacity onPress={() => this.deleteItemById(item.id)}>
                                                    <Image source={Images.ic_delete} />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={{ ...styles.fontSizeBLACK16 }}>{item.itemName}</Text>
                                            <View style={{ ...commonStyles.flexBetween, marginTop: spacing.MARGIN_8 }}>
                                                <View style={{ ...styles.rnPickerView }}>
                                                    <Text style={{ ...styles.fontSize14Black }}>{strings.qty}</Text>
                                                    <RNPickerSelect
                                                        items={item.quantity}
                                                        placeholder={{
                                                            label: '01', value: 1,
                                                        }}
                                                        onValueChange={(value) => console.log(value)}
                                                        style={{
                                                            placeholder: { color: colors.APP_BLACK },
                                                            inputAndroid: { ...styles.rnSelector },
                                                            inputIOS: { ...styles.rnSelector },
                                                            iconContainer: {
                                                                top: "46%",
                                                                marginRight: spacing.MARGIN_12
                                                            },
                                                        }}
                                                        Icon={() => {
                                                            return <Image source={Images.ic_chevron_down} style={{ alignSelf: "center" }} />;
                                                        }}
                                                        useNativeAndroidPickerStyle={false}
                                                    />
                                                </View>
                                                <Text style={{ ...styles.fontSize16Bold }}>{strings.indian_currency}{item.price}</Text>
                                            </View>
                                            <TouchableOpacity>
                                                <Text style={{ ...styles.saveFor }}>{strings.saveForLater}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ ...commonStyles.horizontalLine, marginVertical: 8 }} />
                                </View>
                            }
                        />
                    </View>
                    <View style={{ ...commonStyles.margin16_24 }}>
                        <Text style={{ ...commonStyles.fontSize16Book }}>{strings.thePriceAndAvails}</Text>
                    </View>

                    <View style={{ ...commonStyles.margin16_48 }}>
                        <Text style={{ ...commonStyles.fontSize14Bold }}>{strings.promoCode}</Text>

                        <View style={{ borderBottomWidth: 1, borderBottomColor: this.state.borderBottomColor, ...commonStyles.flexBetween }}>
                            <TextInput style={{ ...styles.promoCodeTextInput }}
                                underlineColorAndroid="transparent"
                                placeholder={strings.promoCode}
                                placeholderTextColor={colors.GREY_066}
                                autoCapitalize="none"
                                underlineColorAndroid="transparent"
                                onChangeText={
                                    (promoCode) => this.onChangeTextPromoCode(promoCode)
                                }
                                value={this.state.promoCode}
                                color={
                                    this.state.promoCode == this.state.validPromoCode ?
                                        colors.APP_BLACK : colors.RED_WARNING
                                }
                            />
                            {
                                this.state.promoCode != "" ?
                                    <TouchableOpacity style={{ justifyContent: "center" }} onPress={this.cleanPromoCode}>
                                        <Image source={Images.ic_close} style={{ alignSelf: "center" }} />
                                    </TouchableOpacity>
                                    :
                                    <View />
                            }

                        </View>

                        {
                            this.state.promoCode != this.state.validPromoCode && this.state.promoCode != "" ?
                                <View style={{ flexDirection: 'row', marginTop: spacing.MARGIN_24 }}>
                                    <Image source={Images.ic_alert} style={{ alignSelf: "center" }} />
                                    <Text style={{ ...styles.fontSize14, color: colors.APP_BLACK, marginLeft: spacing.MARGIN_8 }}>{strings.promoCodeWrongWarning}</Text>
                                </View> : <View />
                        }

                    </View>

                    <View style={{ ...commonStyles.margin16_56 }}>
                        <Text style={{ ...commonStyles.fontSize14Bold }}>{strings.orderSummary}</Text>
                        <View style={{ marginVertical: spacing.MARGIN_24 }}>
                            <View style={{ ...commonStyles.flexBetween }}>
                                <Text style={{ ...styles.fontSizeBLACK16 }}>{strings.orderSubTotal}</Text>
                                <Text style={{ ...styles.fontSizeBLACK16 }}>{strings.indian_currency}{this.state.totalAmount}</Text>
                            </View>
                            <View style={{ ...commonStyles.flexBetween, marginTop: spacing.MARGIN_8 }}>
                                <Text style={{ ...styles.fontSizeBLACK16 }}>{strings.promoCode}</Text>
                                <Text style={{ ...styles.fontSizeBLACK16 }}>{strings.indian_currency}{this.state.promoCodeAmmount}</Text>
                            </View>

                            <View style={{ ...styles.horizontal }} />

                            <View style={{ ...commonStyles.flexBetween }}>
                                <Text style={{ ...styles.fontSizeBLACK16 }}>{strings.taxesCharges}</Text>
                                <Text style={{ ...styles.fontSizeBLACK16 }}>{strings.indian_currency}{this.state.totalTax}</Text>
                            </View>

                            <View style={{ ...styles.horizontal }} />

                            <View style={{ ...commonStyles.flexBetween }}>
                                <Text style={{ ...commonStyles.fontSize18Bold }}>{strings.netAmount}</Text>
                                <Text style={{ ...commonStyles.fontSize18Bold }}>{strings.indian_currency}{this.state.netTotal}</Text>
                            </View>
                        </View>
                    </View>

                    <ThemeButtton
                        buttonText={strings.proceedToCheckOut}
                        btnStyle={{ ...commonStyles.margin16_24, marginBottom: spacing.MARGIN_24 }}
                        onPress={() => alert("comming soon.....!")}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}
