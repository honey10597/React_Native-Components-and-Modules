import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

import WrapperWithStatusbar from '../../components/WrapperWithStatusbar';
import { HeaderComponent } from "../../components/HeaderComponent"
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import commonStyles from '../../styles/commonStyles';
import { height, moderateScale, width } from '../../styles/responsiveSize';
import colors from '../../styles/colors';
import moment from 'moment';
import { showError } from '../../helper/helperFunctions';
import { getTherapistData } from '../../redux/actions/homeAction';
import ButtonWithLoader from '../../components/ButtonWithLoader';
import { DropDownModal } from '../../components/DropDownModal';
import { GENDER_DATA } from '../../utils/staticData';

const ScheduleAppointment = (props) => {

    const therapistData = props.route.params.therapistData
    const [selectedDate, setSelectedDate] = useState({})
    const [slots, setSlots] = useState([])
    const [showSlotsList, setShowSlotsList] = useState(false)
    const [selectedSlot, setSelectedSlot] = useState(null)

    useEffect(() => {
        _getData(new Date())
        _selectCurrentDate()
    }, [])

    const _getData = (date) => {
        let apiData = {
            therapist_id: therapistData?.therapist_id,
            month: moment(date).format("MM"),
            year: moment(date).format("YYYY"),
            date: moment(date).format("DD"),
        }
        getTherapistData(apiData).then((res) => {
            if (res?.data?.available_slots && res?.data?.available_slots.length) {
                res?.data?.available_slots.map((item, index) => {
                    item.label = _formatTime(item?.start_time) + " - " + _formatTime(item?.end_time)
                })
                setSlots(res?.data)
                setSelectedSlot(res?.data?.available_slots[0])
                console.log(res?.data, "dsfajsdfkjbaskdfkj");
            }
        }).catch(error => {
            showError(error.message || error.data.message || "/therapist/get-therapist-data API Error");
        })
    }

    const _selectCurrentDate = () => {
        let day = moment(new Date()).format("YYYY-MM-DD").toString()
        setSelectedDate({ [day]: { selected: true, selectedColor: colors.themeColor } })
    }

    const _onSelectDate = (day) => {
        _getData(day.dateString)
        let selectedDateIs = day.dateString
        setSelectedDate({ [selectedDateIs]: { selected: true, selectedColor: colors.themeColor } })
    }

    const _onMonthChange = (month) => {
        console.log(month, "_onMonthChange");
        _getData(month.dateString)
    }

    const _formatTime = (time) => {
        let formattedDate = moment(time, "hh:mm").format("hh:mm a")
        return formattedDate;
    }

    return (
        <WrapperWithStatusbar>
            <HeaderComponent
                leftIcon={imagePath.icBack}
                onPressLeft={() => props.navigation.goBack()}
                centerText={strings.scheduleAnAppointment}
                leftViewStyle={{ width: "15%" }}
                centerViewStyle={{ width: "80%" }}
            />
            <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                style={{ flex: 0.9 }}
            >

                <Text style={{ ...commonStyles.font_16_semiBold, marginVertical: moderateScale(16) }}>{"Select your Date"}</Text>

                <View style={{ ...commonStyles.shadowStyle }}>
                    <Calendar
                        hideExtraDays={true}
                        onDayPress={_onSelectDate}
                        onMonthChange={_onMonthChange}
                        monthFormat={'dd MMM yyyy'}
                        markedDates={selectedDate}
                        // markedDates={{
                        //     '2022-01-10': { selected: true, marked: true, selectedColor: 'red' },
                        // }}
                        dayComponent={({ date, state }) => {
                            const selectedDateIs = Object.keys(selectedDate)[0]

                            // console.log(slots, "unavailableDates 1111")
                            let unavailableDates;
                            if (slots && slots?.unavailability_based_on_date && slots?.unavailability_based_on_date?.length) {
                                unavailableDates = slots?.unavailability_based_on_date.filter(item => item.date === date.dateString)
                            }
                            if (unavailableDates && unavailableDates?.length) {
                                return (
                                    <View style={{
                                        height: moderateScale(40),
                                        width: moderateScale(40),
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <View style={{ flexDirection: "row" }}>
                                            <TouchableOpacity
                                                style={{
                                                    height: moderateScale(26),
                                                    width: moderateScale(26),
                                                    borderRadius: moderateScale(15),
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                                onPress={() => showError("Therapist unavailable on this date.Please select other date")}
                                                activeOpacity={0.9}
                                            >
                                                <Text style={{
                                                    ...commonStyles.font_14_bold,
                                                    color: colors.red
                                                }}>{date?.day}</Text>
                                            </TouchableOpacity>
                                            <Image source={imagePath.red_cross} style={{ height: moderateScale(16), width: moderateScale(16) }} />
                                        </View>
                                    </View>
                                )
                            } else {
                                return (
                                    <View style={{
                                        height: moderateScale(40),
                                        width: moderateScale(40),
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        {selectedDateIs == date.dateString ?
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: colors.themeColor,
                                                    height: moderateScale(30),
                                                    width: moderateScale(30),
                                                    borderRadius: moderateScale(15),
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                                activeOpacity={0.9}
                                                onPress={() => _onSelectDate(date)}
                                            >
                                                <Text style={{
                                                    ...commonStyles.font_14_bold,
                                                    color: colors.whiteColor
                                                }}>{date?.day}</Text>
                                            </TouchableOpacity>
                                            :
                                            <View style={{ flexDirection: "row" }}>
                                                <TouchableOpacity
                                                    style={{
                                                        height: moderateScale(30),
                                                        width: moderateScale(30),
                                                        borderRadius: moderateScale(15),
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                    onPress={() => _onSelectDate(date)}
                                                    activeOpacity={0.9}
                                                >
                                                    <Text style={{
                                                        ...commonStyles.font_14_bold,
                                                        color: colors.themeColor
                                                    }}>{date?.day}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </View>
                                )
                            }

                        }}
                        theme={{
                            // backgroundColor: '#ffffff',
                            // calendarBackground: '#ffffff',
                            textSectionTitleColor: colors.textColorOpacity,//'#b6c1cd',
                            // textSectionTitleDisabledColor: '#d9e1e8',
                            selectedDayBackgroundColor: '#00adf5',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: colors.themeColor,
                            dayTextColor: colors.themeColor,
                            textDisabledColor: colors.textColorOpacity,//'#d9e1e8',
                            // dotColor: '#00adf5',
                            // selectedDotColor: '#ffffff',
                            // arrowColor: 'orange',
                            // disabledArrowColor: '#d9e1e8',
                            monthTextColor: colors.textColor,
                            indicatorColor: colors.textColor,
                            // textDayFontFamily: 'monospace',
                            // textMonthFontFamily: 'monospace',
                            // textDayHeaderFontFamily: 'monospace',
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 12
                        }}
                        renderArrow={(direction) => {
                            if (direction === 'left') {
                                return <View style={{
                                    width: moderateScale(30),
                                    height: moderateScale(30),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderColor: colors.themeColor,
                                    borderRadius: 4,
                                    borderWidth: 1
                                }} ><Image source={imagePath.ic_left_arrow} /></View>
                            } else {
                                return <View style={{
                                    width: moderateScale(30),
                                    height: moderateScale(30),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderColor: colors.themeColor,
                                    borderRadius: 4,
                                    borderWidth: 1
                                }} ><Image source={imagePath.ic_right_arrow} /></View>
                            }
                        }}
                    />
                </View>

                <Text style={{
                    ...commonStyles.font_10_extraBod,
                    marginVertical: moderateScale(16),
                    opacity: 0.6
                }}>{strings.selectedAvailableTime.toUpperCase()}</Text>

                <View>
                    <TouchableOpacity style={{
                        borderWidth: 1,
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: moderateScale(16),
                        paddingVertical: moderateScale(6),
                        borderRadius: moderateScale(4),
                        borderColor: colors.grey_217_1
                    }}
                        onPress={() => setShowSlotsList(!showSlotsList)}
                        activeOpacity={0.9}
                    >
                        <Text style={{
                            ...commonStyles.font_16_medium,
                        }}>{_formatTime(selectedSlot?.start_time) + " - " + _formatTime(selectedSlot?.end_time)}</Text>

                        <Image source={imagePath.ic_list_down}
                            style={{ transform: [{ rotateX: showSlotsList ? '180deg' : '0deg' }] }}
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={{ flex: 0.1 }}>
                <ButtonWithLoader
                    btnText={strings.CONFIRM}
                    onPress={() => props.navigation.popToTop()}
                />
            </View>
            {showSlotsList ?
                <DropDownModal
                    data={{
                        data: slots?.available_slots,
                        label: "Select time slot"
                    }}
                    showSearchBar={false}
                    isVisible={true}
                    onSelect={(type, data) => {
                        setSelectedSlot(data)
                        setShowSlotsList(!showSlotsList)
                    }}
                    onPressBack={() => setShowSlotsList(!showSlotsList)}
                /> :
                <></>
            }
        </WrapperWithStatusbar>
    )
}

export default ScheduleAppointment;
