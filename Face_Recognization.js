// import liraries
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import ButtonComp from '../../Components/ButtonComp'
import DobComp from '../../Components/DobComp'
import HeaderComp from '../../Components/HeaderComp'
import { Loader } from '../../Components/Loader'
import PhoneTextComp from '../../Components/PhoneTextComp'
import TextInputComp from '../../Components/TextInputComp'
import UploadPicView from '../../Components/UploadPicView'
import WrapperContainer from '../../Components/WrapperContainer'
import imagesPath from '../../constants/imagesPath'
import strings from '../../constants/Languages'
import navigationString from '../../constants/navigationString'
import FaceDetection, {
  FaceDetectorContourMode,
  FaceDetectorLandmarkMode
} from 'react-native-face-detection'
import {
  checkEmailApi,
  checkUserNameApi,
  sendOtpApi
} from '../../redux/reduxActions/authActions'
import colors from '../../styles/colors'
import commonStyles from '../../styles/commonStyles'
import { height, moderateScale, width } from '../../styles/responsiveSize'
import {
  ApiError,
  selectSingleImage,
  showError,
  showSuccess
} from '../../utils/helperFunctions'
import {
  checkLocationSevice,
  requestCameraPermission
} from '../../utils/miscellaneous'
import {
  checkIsEmpty,
  checkLength,
  checkPasswordValidations,
  chekPhoneNumberValidations,
  isValidEmail
} from '../../utils/validations'

// create a component
const CreateProfile = ({ navigation }) => {
  const debouncingRef = useRef(null)
  const [profileApproved, setProfileApproved] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [profilePic, setProfilePic] = useState('')
  const [name, setName] = useState('')
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [imageObject, setImageObject] = useState()
  const [startUserNameSearch, setStartUserNameSearch] = useState(false)
  const [userNameAvail, setUserNameAvail] = useState(false)
  const [userNameSearching, setUserNameSearching] = useState(false)

  const [countryCode, setCountryCode] = useState('44')
  const [countryFlag, setCountryFlag] = useState('GB')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(true)
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [calanderModal, setCalanderModal] = useState(false)
  const [imageSize, setImageSize] = useState()
  const [bio, setBio] = useState('')
  const [occupation, setOccupation] = useState('')
  const [faceRects, setFaceRects] = useState()

  function calculateImageSize(originalWidth, originalHeight) {
    const ratio = originalWidth / originalHeight

    const w = originalWidth > width ? width : originalWidth
    const h = w / ratio

    return {
      width: w,
      height: h,
      originalWidth,
      originalHeight
    }
  }

  function calculateFaceRectInsideImage(boundingBox, imageSize) {
    const wRatio = imageSize.originalWidth / imageSize.width
    const hRatio = imageSize.originalHeight / imageSize.height

    const faceX = boundingBox[0] / wRatio
    const faceY = boundingBox[1] / hRatio

    const faceWidth = boundingBox[2] / wRatio - faceX
    const faceHeight = boundingBox[3] / hRatio - faceY

    return {
      x: faceX,
      y: faceY,
      width: Math.ceil(faceWidth),
      height: Math.ceil(faceHeight)
    }
  }

  const callFaceFeature = faces => {
    if (faces.length > 0) {
      console.log(faces, 'hello faces ===>>>>>>>>>>>>>.')
      setProfileApproved(true)
    } else {
      setProfileApproved(false)
      alert('Please use a profile pic with better face exposure')
    }
  }

  useEffect(() => {
    const processImage = async () => {
      if (imageObject && imageObject.path) {
        setLoading(true)
        const options = {
          landmarkMode: FaceDetectorLandmarkMode.ALL,
          contourMode: FaceDetectorContourMode.ALL
        }

        const faces = await FaceDetection.processImage(
          imageObject.path,
          options
        )

        console.log(faces, 'hello faces ====>>>>>>>>>>')

        if (faces.length === 0) {
          alert("We didn't detected any face")
          setProfileApproved(false)
        } else if (faces.length > 1) {
          alert('We detected more than one face')
          setProfileApproved(false)
        } else {
          callFaceFeature(faces)
        }

        const imageSizeResult = calculateImageSize(
          imageObject.width,
          imageObject.height
        )

        const faceRectResults = []

        faces.forEach(face => {
          const faceRect = calculateFaceRectInsideImage(
            face.boundingBox,
            imageSizeResult
          )

          faceRectResults.push(faceRect)
        })

        console.log(faceRectResults, 'face rect results ===>>>>>>>>>>>')
        setImageSize(imageSizeResult)
        setFaceRects(faceRectResults)
        setLoading(false)
      }
    }

    processImage()
  }, [imageObject])

  // function to hide and show the password...

  const _hideShowPassword = () => {
    setShow(!show)
  }

  const ageLimit = new Date(
    moment().subtract(18, 'years').format('yyyy-MM-DD')
  )

  //* ********   Select the Image   ********************* */

  const _selectImage = async () => {
    await requestCameraPermission().then(res => {
      selectSingleImage().then(res => {
        console.log(res, 'resresresresres')
        setProfilePic(res)
        setImageObject(res)
      })
    })
  }

  const _onConfirm = () => {

    if (!profilePic?.path) {
      return showError(strings.pleaseSelectYourProfilePic)
    } else if (!profileApproved) {
      return showError(strings.youCannotProceedWithThisProfilePic)
    } else if (checkIsEmpty(name)) {
      return showError(strings.NameIsRequired)
    } else if (checkIsEmpty(userName)) {
      return showError(strings.UserNameIsRequired)
    } else if (!isValidEmail(email)) {
      return showError(strings.EnterValidEmail)
    } else if (!chekPhoneNumberValidations(phoneNumber)) {
    } else if (!checkPasswordValidations(password)) {
    } else if (checkIsEmpty(dateOfBirth)) {
      return showError(strings.DateOfBirthIsRequired)
    } else if (checkIsEmpty(bio)) {
      return showError(strings.bioIsRequired)
    } else if (checkLength(bio, 20) == false) {
      return showError(strings.EnterAtleast20WordsInBio)
    } else if (checkIsEmpty(occupation)) {
      return showError(strings.OccupationIsRequired)
    } else {
      setLoading(true)
      _checkEmailExists()
    }
  }

  const _checkEmailExists = () => {
    const apiData = {
      email
    }
    checkEmailApi(apiData)
      .then(res => {
        _checkLocationPermission()
      })
      .catch(error => {
        setLoading(false)
        showError(ApiError(error))
      })
  }

  const _checkLocationPermission = () => {
    checkLocationSevice()
      .then(res => {
        _createProfileApi()
      })
      .catch(error => {
        setLoading(false)
        showError(ApiError(error))
      })
  }

  const _createProfileApi = () => {

    Keyboard.dismiss()

    const createProfileData = {
      profile_image: profilePic,
      name,
      user_name: userName,
      email,
      country_code: countryCode,
      country_flag: countryFlag,
      phone_number: phoneNumber,
      password,
      bio,
      occupation,
      dob: dateOfBirth,
      device_type: Platform.OS,
      device_token: 'deviceToken'
    }

    const sendOtpData = {
      country_code: `${countryCode}`,
      phone_number: phoneNumber
    }

    sendOtpApi(sendOtpData)
      .then(res => {
        setLoading(false)
        showSuccess(strings.OTPSentOn + phoneNumber)
        navigation.navigate(navigationString.OTPSCREEN, {
          createProfileData,
          sendOtpData
        })
      })
      .catch(error => {
        setLoading(false)
        showError(ApiError(error))
      })
  }

  // check the username if  it exits

  const _checkUserName = text => {
    clearTimeout(debouncingRef.current)
    setUserName(text)
    debouncingRef.current = setTimeout(() => {
      _checkUserNameExists(text)
    }, 400)
  }

  const _checkUserNameExists = text => {
    const apiData = {
      user_name: text
    }
    setStartUserNameSearch(true)
    setUserNameSearching(true)
    checkUserNameApi(apiData)
      .then(res => {
        console.log(res, 'resesresrs')
        setUserNameAvail(true)
        setUserNameSearching(false)
      })
      .catch(error => {
        setUserName('')
        setUserNameAvail(false)
        setUserNameSearching(false)
        showError(ApiError(error))
      })
  }

  //* ******************   Main Body of the Component  **************************

  return (
    <WrapperContainer>
      <HeaderComp
        // rightText="Skip"
        leftIcon={imagesPath.ic_back}
        onPressBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        <Text style={styles.txtStyle}>{strings.CreateProfile}</Text>

        <UploadPicView
          selectImage={_selectImage}
          profilePic={profilePic?.path}
        />

        <TextInputComp
          inputText={strings.name}
          // keyboardType="email-address"
          value={name}
          placeholder={'John Michael'}
          maxLength={20}
          onChangeText={e => setName(e)}
        />

        <TextInputComp
          inputText={strings.UserName}
          placeholder={'john.michael175'}
          // keyboardType="email-address"
          maxLength={20}
          image={
            startUserNameSearch
              ? userNameSearching
                ? ''
                : userNameAvail
                  ? imagesPath.ic_greenTick
                  : imagesPath.ic_cross
              : ''
          }
          onChangeText={_checkUserName}
          _anotherComp={
            startUserNameSearch
              ? (
                <ActivityIndicator
                  animating={userNameSearching}
                  color={colors.blackOpacity90}
                  style={{ marginEnd: moderateScale(8) }}
                />
              )
              : (
                <></>
              )
          }
          textInputStyle={{ width: '84%' }}
        />

        {startUserNameSearch
          ? (
            !userNameSearching
              ? (
                <Text
                  style={{
                    ...commonStyles.font_14_medium,
                    marginTop: moderateScale(16),
                    color: userNameAvail ? colors.seaGreen : colors.red,
                    textAlign: 'right'
                  }}>
                  {userNameAvail
                    ? strings.UsernameAvailable
                    : strings.UsernameDoesntExists}
                </Text>
              )
              : (
                <></>
              )
          )
          : (
            <></>
          )}

        <TextInputComp
          // inputView={{ marginTop: moderateScale(32) }}
          inputText={strings.email}
          placeholder={'john@gmail.com'}
          keyboardType="email-address"
          value={email}
          maxLength={30}
          onChangeText={e => setEmail(e)}
        />

        <PhoneTextComp
          countryCode={countryCode}
          countryFlag={countryFlag}
          setCountryCode={event => setCountryCode(event)}
          setCountryFlag={event => setCountryFlag(event)}
          setPhoneNumber={val => setPhoneNumber(val)}
        />

        <TextInputComp
          inputText={strings.Password}
          onPress={_hideShowPassword}
          placeholder={'********'}
          secureTextEntry={show}
          onChangeText={e => setPassword(e)}
          textInputStyle={{ width: '90%' }}
          maxLength={20}
          image={show ? imagesPath.ic_closeEye : imagesPath.ic_openEye}
        />

        <DobComp onSelect={val => setDateOfBirth(val)} />

        <TextInputComp
          inputText={strings.Bio}
          keyboardType="email-address"
          value={bio}
          multiline={true}
          textInputStyle={{
            minHeight: moderateScale(80),
            marginVertical: moderateScale(10)
          }}
          maxLength={200}
          placeholder={
            'If you couldn’t skip a single song while listening to an album, which would you choose?'
          }
          onChangeText={e => setBio(e)}
        />

        <TextInputComp
          inputText={strings.occupation}
          keyboardType="email-address"
          value={occupation}
          maxLength={30}
          placeholder={'Professional Dancer'}
          onChangeText={e => setOccupation(e)}
        />

        <ButtonComp
          btnText={strings.Confirm}
          onPressBtn={_onConfirm}
          btnView={styles.btnStyle}
        />
      </KeyboardAwareScrollView>

      {/* <DatePicker
        modal
        mode={'date'}
        open={calanderModal}
        date={dateOfBirth ? new Date(dateOfBirth) : ageLimit}
        maximumDate={ageLimit}
        minimumDate={new Date('1960-01-01')}
        onConfirm={date => {
          setDateOfBirth(moment(date).format('yyyy-MM-DD'))
          setCalanderModal(false)
        }}
        onCancel={() => {
          setCalanderModal(false)
        }}
      /> */}
      <Loader isLoading={isLoading} />
    </WrapperContainer>
  )
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  txtStyle: {
    ...commonStyles.font_26_bold,
    marginTop: moderateScale(18),
    color: colors.themecolor2
  },
  imgStyle: {
    position: 'absolute',
    zIndex: 2000,
    bottom: moderateScale(-1),
    right: moderateScale(-10)
  },
  imgView: {
    height: moderateScale(100),
    width: moderateScale(100),
    borderRadius: moderateScale(24),
    borderWidth: 0.3
  },
  birthdayView: {
    borderColor: colors.likePink,
    padding: moderateScale(14),
    borderWidth: 0.5,
    height: moderateScale(58),
    borderRadius: moderateScale(12),
    marginTop: moderateScale(34),
    justifyContent: 'center'
  },
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputStyle: {
    borderWidth: moderateScale(0.5),
    height: moderateScale(60),
    width: '100%',
    borderRadius: moderateScale(10),
    borderColor: colors.likePink,
    marginTop: moderateScale(40),
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textStyle: {
    ...commonStyles.font_12_medium,
    position: 'absolute',
    top: moderateScale(-16),
    left: moderateScale(24),
    padding: moderateScale(6),
    color: colors.grey,
    backgroundColor: colors.darkBlack
  },
  btnStyle: {
    backgroundColor: colors.themecolor2,
    marginTop: moderateScale(38),
    marginBottom: moderateScale(48)
  }
})

export default CreateProfile
