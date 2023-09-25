import React, {useState} from 'react';
import {showError} from './helperFunctions';

export const isValidEmail = email => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (emailRegex.test(email) == false) {
    return false;
  } else {
    return true;
  }
};

// Empty or not
export const checkIsEmpty = inputValue => {
  if (inputValue == undefined) {
    return true;
  } else if (inputValue == null) {
    return true;
  } else if (inputValue.trim() == '') {
    return true;
  } else {
    return false;
  }
};

// check valid length
export const checkLength = (value, expectedLength = 8) => {
  if (!checkIsEmpty(value)) {
    if (value.length >= expectedLength) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

// Phone number validation
export const chekPhoneNumberValidations = phoneNumber => {
  if (checkIsEmpty(phoneNumber)) {
    showError('Please enter mobile number');
    return false;
  } else if (checkLength(phoneNumber, 8) == false) {
    showError('Phone number must be of minimum 8 characters.');
    return false;
  } else {
    return true;
  }
};

// Email , Password validations
export const checkPasswordValidations = (password, message = '') => {
  if (checkIsEmpty(password)) {
    showError(`Please enter ${message} password.`);
    return false;
  } else if (checkLength(password, 8) == false) {
    showError(`${message} password must be of minimum 8 characters`);
    return false;
  } else {
    return true;
  }
};

export const BonkersFilterValidations = (
  maxHeight,
  preferredGenderValue,
  sexualityValue,
  // ink,
  // education,
  // occupation,
  // children,
  religion,
  // drinking,
  // fitness,
  // lifestyle,
  // personality,
  // languages,
  // hobies,
  // favPlaces,
  // interests,
  // cuisin,
  // starSign
) => {
  if (maxHeight === 0) {
    showError('Please select your maximum height preferences');
    return false;
  }
  if (!preferredGenderValue?.name) {
    showError('Please choose your preferred gender');
    return false;
  }
  if (!sexualityValue?.name) {
    showError('Please choose your preferred sexuality');
    return false;
  }
  // if (!ink?.name) {
  //     showError('Please choose your preferred Ink');
  //     return false;
  // }
  // if (!education?.name) {
  //     showError('Please choose your preferred education');
  //     return false;
  // }
  // if (!occupation?.name) {
  //     showError('Please choose your preferred occupation');
  //     return false;
  // }
  // if (!children?.name) {
  //     showError('Please choose your preferred children');
  //     return false;
  // }
  if (!religion?.name) {
    showError('Please choose your preferred religion');
    return false;
  }
  // if (!drinking?.name) {
  //     showError('Please choose your preferred drinking');
  //     return false;
  // }
  // if (!fitness?.name) {
  //     showError('Please choose your preferred fitness');
  //     return false;
  // }
  // if (!lifestyle?.name) {
  //     showError('Please choose your preferred lifestyle');
  //     return false;
  // }
  // if (!personality?.name) {
  //     showError('Please choose your preferred personality');
  //     return false;
  // }
  // if (Array.isArray(languages) && languages && languages.length == 0) {
  //     showError('Please choose your preferred languages');
  //     return false;
  // }
  // if (Array.isArray(hobies) && hobies && hobies.length == 0) {
  //     showError('Please choose your hobbies');
  //     return false;
  // }
  // if (Array.isArray(favPlaces) && favPlaces && favPlaces.length == 0) {
  //     showError('Please choose your favourite places');
  //     return false;
  // }
  // if (Array.isArray(interests) && interests && interests.length == 0) {
  //     showError('Please choose your preferred interests');
  //     return false;
  // }
  // if (Array.isArray(cuisin) && cuisin && cuisin.length == 0) {
  //     showError('Please choose your preferred cuisin');
  //     return false;
  // }
  // if (!starSign?.name) {
  //     showError('Please choose your zodiac sign');
  //     return false;
  // }
  return true;
};

export const BonksFilterValidations = (
  maxHeight,
  // weight,
  sexualityValue,
  lookingFor,
  // ink,
  // education,
  // occupation,
  // children,
  religion,
  // position,
  fantasy,
  kink,
) => {
  if (maxHeight === 0) {
    showError('Please select your maximum height preferences');
    return false;
  }
  // if (weight === 0) {
  //     showError('Please choose your preferred weight');
  //     return false;
  // }
  if (!sexualityValue?.name) {
    showError('Please choose your preferred sexuality');
    return false;
  }
  if (!lookingFor?.name) {
    showError('Please choose your preferred looking for');
    return false;
  }
  // if (!ink?.name) {
  //     showError('Please choose your preferred Ink');
  //     return false;
  // }
  // if (!education?.name) {
  //     showError('Please choose your preferred education');
  //     return false;
  // }
  // if (!occupation?.name) {
  //     showError('Please choose your preferred occupation');
  //     return false;
  // }
  // if (!children?.name) {
  //     showError('Please choose your preferred children');
  //     return false;
  // }
  if (!religion?.name) {
    showError('Please choose your preferred religion');
    return false;
  }
  // if (Array.isArray(position) && position && position.length == 0) {
  //   showError('Please choose your preferred positions');
  //   return false;
  // }
  if (Array.isArray(fantasy) && fantasy && fantasy.length == 0) {
    showError('Please choose your preferred fantasy');
    return false;
  }
  if (Array.isArray(kink) && kink && kink.length == 0) {
    showError('Please choose your preferred kink');
    return false;
  }
  return true;
};
