//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Bubble } from 'react-native-gifted-chat'
import {
  colors,
} from '../../../utilities/constants';
import {
  icons,
  fonts
} from '../../../../assets';
import { moderateScale } from 'react-native-size-matters';

// create a component
const ChatBubble = (props) => {

  return (
    <Bubble
      {...props}
      textStyle={{
        right: {
          color: colors.blackOpacity90,
          fontFamily: fonts.regular,
        },
        left: {
          fontFamily: fonts.regular,
          color: colors.blackOpacity90,
        }
      }}
      wrapperStyle={{
        left: {
          backgroundColor: colors.grey6,
          marginBottom: moderateScale(6)
        },
        right: {
          backgroundColor: colors.primary,
          marginBottom: moderateScale(6)
        },
      }}
      timeTextStyle={{
        left: {
          fontFamily: fonts.regular,
          fontSize: moderateScale(10),
          color: colors.blackOpacity90,
        },
        right: {
          color: colors.blackOpacity90,
          fontFamily: fonts.regular,
          fontSize: moderateScale(10)
        },
      }}

    />
  );

};

// define your styles
const styles = StyleSheet.create({

});

//make this component available to the app
export default ChatBubble;
