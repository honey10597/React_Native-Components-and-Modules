import React, { useState, forwardRef, FC } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal'

import { moderateScale, textScale } from '../styles/responsiveSize';
import fontFamily from '../styles/fontFamily';
import colors from '../styles/colors';
import imagePath from '../constants/imagePath';
import commonStyles, { hitSlopProp } from '../styles/commonStyles';
import strings from "../constants/lang"

// interface CommonTextInputWithLabelProps {
//   value: string,
//   placeholder?: string,
//   label?: string,
//   onChangeText?: (val: string) => void,
//   onFocus?: () => void,
//   keyboardType?: string,
//   inputViewStyle?: object,
//   inputStyle?: object,
//   labelStyle?: object,
//   secureTextEntry?: boolean,
//   countryCode?: string,
//   countryPickerViewStyle?: object,
//   onPressCountryPicker?: () => void,
//   onSelect: () => void,
//   cca2: string,
//   visible: boolean,
//   onClose: () => void,
//   rightIcon: any,
//   onSubmitEditing?: () => void,
//   returnKeyType?: string,
//   editable?: boolean,
//   maxLength?: number
//   multiline?: boolean
//   onPressRightIcon: () => void
// }

const CommonTextInputWithLabel = ({
  value,
  placeholder,
  label,
  onChangeText,
  onFocus,
  keyboardType,
  inputViewStyle,
  inputStyle,
  labelStyle,
  secureTextEntry,
  countryCode,
  countryPickerViewStyle,
  onPressCountryPicker,
  onSelect,
  cca2,
  visible,
  onClose,
  autoFocus,
  rightIcon,
  onSubmitEditing,
  returnKeyType,
  editable,
  maxLength,
  multiline,
  onPressRightIcon,
  rightText,
  onPressRightText,
  leftIcon,
  onPressLeftIcon,
  required = false
}, ref) => {

  console.log(strings.getLanguage(), "In CutomInputWithBorder")

  const [focused, setFocused] = useState(false);
  return (
    <View style={{ ...styles.inputView, ...inputViewStyle }}>
      {label ? 
      <View style={{flexDirection: 'row'}}>
      <Text
        style={{
          ...styles.label,
          color: colors.blackColor,
          ...labelStyle,
        }}>
        {label}
      </Text>
      {required &&
      <Text
      style={{
        color: colors.themeColor,
        fontFamily: fontFamily.ComfortaaBold,
      }}>
       *
    </Text>}
    </View>
        : <></>}

      <View style={{
        flexDirection: "row",
        justifyContent: rightIcon ? "space-between" : "flex-start",
        borderRadius: moderateScale(4),
      }}>

        {countryCode ?
          <TouchableOpacity
            style={{
              flexDirection: "row",
              paddingEnd: moderateScale(8),
              borderRadius: moderateScale(4),
              borderColor: colors.whiteColor,
              justifyContent: "center",
              alignItems: "center",
              // paddingStart: moderateScale(12),
              borderEndWidth: 1,
              // borderColor: colo,
              height: moderateScale(44),
              ...countryPickerViewStyle
            }}
            activeOpacity={0.7}
            onPress={onPressCountryPicker}
          >
            <CountryPicker
              onSelect={onSelect}
              countryCode={countryCode}
              cca2={cca2}
              visible={visible}
              withFilter
              withAlphaFilter
              withCountryNameButton={false}
              onClose={onClose}
            />
            <Text style={{
              fontSize: textScale(14),
              fontWeight: Platform.OS == 'ios' ? '700' : 'normal',
              fontFamily: fontFamily.ComfortaaSemiBold,
              color: focused ? colors.themeColor : colors.blackOpacity40,
            }}>+{cca2 ? cca2 : ""}</Text>
            <Image
              source={imagePath.ic_down}
              style={{ marginHorizontal: moderateScale(4) }}
            />
          </TouchableOpacity> : <></>
        }

        {leftIcon ?
          <TouchableOpacity
            onPress={onPressLeftIcon}
            activeOpacity={0.9}
            style={{ justifyContent: "center" }}
            hitSlop={hitSlopProp}
          >
            <Image source={leftIcon}
              style={{
                marginStart: moderateScale(8),
                alignSelf: "center",
                height: moderateScale(16),
                width: moderateScale(16)
              }}
            />
          </TouchableOpacity>
          : <></>}

        <TextInput
          ref={ref}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          value={value}
          onFocus={() => setFocused(true)}
          keyboardType={keyboardType}
          style={{ ...styles.input, width: rightIcon ? "80%" : "100%", color: focused ? colors.themeColor : colors.blackOpacity40,...inputStyle }}
          placeholder={placeholder}
          placeholderTextColor={colors.textColor}
          onBlur={() => setFocused(false)}
          // autoCapitalize={"none"}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          editable={editable}
          maxLength={maxLength}
          multiline={multiline}
          autoFocus={autoFocus}
          textAlign={strings.getLanguage() == "ar" ? "right" : "left"}
        />
        {rightIcon ?
          <TouchableOpacity
            onPress={onPressRightIcon}
            activeOpacity={0.9}
            style={{ justifyContent: "center" }}
            hitSlop={hitSlopProp}
          >
            <Image source={rightIcon}
              style={{
                marginEnd: moderateScale(8),
                alignSelf: "center",
                height: moderateScale(16),
                width: moderateScale(16)
              }}
            />
          </TouchableOpacity>
          : <></>}

        {rightText ?
          <TouchableOpacity
            onPress={onPressRightText}
            activeOpacity={0.9}
            style={{ justifyContent: "center" }}
            hitSlop={hitSlopProp}
          >
            <Text style={{ ...commonStyles.font_12_bold }}>{rightText}</Text>
          </TouchableOpacity>
          : <></>}
      </View>
    </View>
  );
};

const CustomInputWithBorder = forwardRef(CommonTextInputWithLabel)

export default React.memo(CustomInputWithBorder)

const styles = StyleSheet.create({
  inputView: {
    marginTop: moderateScale(24),
    borderBottomWidth: 1,
    borderBottomColor: colors.themeColor,
  },
  label: {
    ...commonStyles.font_12_medium,
  },
  input: {
    ...commonStyles.font_16_bold,
    color: colors.themeColor,
    paddingVertical: moderateScale(8),
    // paddingStart: moderateScale(4),
    textAlignVertical: "top"
  },
});



// import React, { useState, forwardRef, FC } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   Platform,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import CountryPicker from 'react-native-country-picker-modal'

// import { moderateScale, textScale } from '../styles/responsiveSize';
// import fontFamily from '../styles/fontFamily';
// import colors from '../styles/colors';
// import imagePath from '../constants/imagePath';
// import commonStyles, { hitSlopProp } from '../styles/commonStyles';
// import strings from "../constants/lang"

// interface CommonTextInputWithLabelProps  {
//   value: string,
//   placeholder?: string,
//   label?: string,
//   onChangeText?: (val: string) => void,
//   onFocus?: () => void,
//   keyboardType?: string,
//   inputViewStyle?: object,
//   inputStyle?: object,
//   labelStyle?: object,
//   secureTextEntry?: boolean,
//   countryCode?: Array<string>,
//   countryPickerViewStyle?: object,
//   onPressCountryPicker?: () => void,
//   onSelect: () => void,
//   cca2: string,
//   visible: boolean,
//   onClose: () => void,
//   rightIcon: any,
//   onSubmitEditing?: () => void,
//   returnKeyType?: string,
//   editable?: boolean,
//   maxLength?: number
//   multiline?: boolean
//   onPressRightIcon: () => void
// }

// const CommonTextInputWithLabel: FC<CommonTextInputWithLabelProps> = forwardRef<TextInput, CommonTextInputWithLabelProps>(({
//   value,
//   placeholder,
//   label,
//   onChangeText,
//   onFocus,
//   keyboardType,
//   inputViewStyle,
//   inputStyle,
//   labelStyle,
//   secureTextEntry,

//   countryCode,
//   countryPickerViewStyle,
//   onPressCountryPicker,
//   onSelect,
//   cca2,
//   visible,
//   onClose,

//   rightIcon,
//   onSubmitEditing,
//   returnKeyType,
//   editable,
//   maxLength,
//   multiline,
//   onPressRightIcon,
// }, ref: any) => {

//   console.log(strings.getLanguage(), "In CutomInputWithBorder")

//   const [focused, setFocused] = useState(false);
//   return (
//     <View style={{ ...styles.inputView, ...inputViewStyle }}>
//       {label ? <Text
//         style={{
//           ...styles.label,
//           color: focused ? colors.themeColor : colors.blackColor,
//           ...labelStyle,
//         }}>
//         {label}
//       </Text>
//         : <></>}

//       <View style={{
//         flexDirection: "row",
//         justifyContent: rightIcon ? "space-between" : "flex-start",
//         borderRadius: moderateScale(4),
//       }}>

//         {countryCode ?
//           <TouchableOpacity
//             style={{
//               flexDirection: "row",
//               paddingEnd: moderateScale(8),
//               borderRadius: moderateScale(4),
//               borderColor: colors.whiteColor,
//               justifyContent: "center",
//               alignItems: "center",
//               paddingStart: moderateScale(12),
//               borderEndWidth: 1,
//               // borderColor: colo,
//               height: moderateScale(44),
//               ...countryPickerViewStyle
//             }}
//             activeOpacity={0.7}
//             onPress={onPressCountryPicker}
//           >
//             <CountryPicker
//               onSelect={onSelect}
//               countryCodes={countryCode}
//               cca2={cca2}
//               visible={visible}
//               withFilter
//               withAlphaFilter
//               withCountryNameButton={false}
//               onClose={onClose}
//             />
//             <Text style={{
//               fontSize: textScale(18),
//               fontWeight: Platform.OS == 'ios' ? '700' : 'normal',
//               fontFamily: fontFamily.ComfortaaSemiBold,
//               color: colors.themeColor,
//             }}>+{cca2 ? cca2 : ""}</Text>
//             <Image
//               source={imagePath.ic_down}
//               style={{ marginHorizontal: moderateScale(4) }}
//             />
//           </TouchableOpacity> : <></>
//         }

//         <TextInput
//           ref={ref}
//           secureTextEntry={secureTextEntry}
//           onChangeText={onChangeText}
//           value={value}
//           onFocus={() => setFocused(true)}
//           keyboardType={keyboardType}
//           style={{ ...styles.input, width: rightIcon ? "80%" : "100%", ...inputStyle }}
//           placeholder={placeholder}
//           placeholderTextColor={colors.textColor}
//           onBlur={() => setFocused(false)}
//           // autoCapitalize={"none"}
//           onSubmitEditing={onSubmitEditing}
//           returnKeyType={returnKeyType}
//           editable={editable}
//           maxLength={maxLength}
//           multiline={multiline}
//           textAlign={strings.getLanguage() == "ar" ? "right" : "left"}
//         />

//         {rightIcon ?
//           <TouchableOpacity
//             onPress={onPressRightIcon}
//             activeOpacity={0.9}
//             style={{ justifyContent: "center" }}
//             hitSlop={hitSlopProp}
//           >
//             <Image source={rightIcon}
//               style={{
//                 marginEnd: moderateScale(8),
//                 alignSelf: "center",
//                 height: moderateScale(16),
//                 width: moderateScale(16)
//               }}
//             />
//           </TouchableOpacity>
//           : <></>}
//       </View>

//     </View>
//   )
// })

// // const CustomInputWithBorder = forwardRef(CommonTextInputWithLabel)

// export default React.memo(CommonTextInputWithLabel)

// const styles = StyleSheet.create({
//   inputView: {
//     marginTop: moderateScale(32),
//     borderBottomWidth: 1,
//     borderBottomColor: colors.themeColor,
//   },
//   label: {
//     ...commonStyles.font_16_bold,

//   },
//   input: {
//     ...commonStyles.font_14_bold,
//     color: colors.themeColor,
//     paddingVertical: moderateScale(8),
//     paddingStart: moderateScale(4),
//     textAlignVertical: "top"
//   },
// });
