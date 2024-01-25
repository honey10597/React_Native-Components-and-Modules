import React, { useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Alert
} from 'react-native'
import Lottie from 'lottie-react-native'
import RNFetchBlob from 'rn-fetch-blob'
import WrapperContainer from '../../Components/WrapperContainer'
import FaceSDK, {
  Enum,
  FaceCaptureResponse,
  MatchFacesResponse,
  MatchFacesRequest,
  MatchFacesImage,
  MatchFacesSimilarityThresholdSplit
} from '@regulaforensics/react-native-face-api'
import imagesPath from '../../constants/imagesPath'
import { moderateScale } from '../../styles/responsiveSize'
import colors from '../../styles/colors'
import commonStyles from '../../styles/commonStyles'
import ButtonComp from '../../Components/ButtonComp'
import lottiePath from '../../constants/lottiePath'
import { useSelector } from 'react-redux'
import {
  logoutApi,
  saveLoginPinToStore,
  saveLoginToStore,
  verifyFaceApi
} from '../../redux/reduxActions/authActions'
import Animated, { BounceIn } from 'react-native-reanimated'
import { Loader } from '../../Components/Loader'
import {
  ApiError,
  selectSingleImage,
  showError,
  showSuccess
} from '../../utils/helperFunctions'
import { clearLoginPin, getItem, removeItem, setItem } from '../../utils/utils'
import { removeZegoCloud } from '../../utils/zegoConfigureFile'

const image1 = new MatchFacesImage()
const image2 = new MatchFacesImage()
let request = null

const FaceDetection = ({ navigation }) => {
  const userData = useSelector(state => state?.authReducers?.userData || {})
  const [isLoading, setIsLoading] = useState(false)
  const [img1, setImg1] = useState(null)
  const [img2, setImg2] = useState(null)
  const [similarity, setSimilarity] = useState('')
  const [startVerification, setStartVerification] = useState(false)
  const [profileMatched, setProfileMatched] = useState(false)
  const [profileDeclined, setProfileDeclined] = useState(false)
  const fs = RNFetchBlob.fs

  let imagePath = null

  useEffect(() => {
    if (img1 === null) {
      getBase64Url()
    }
  }, [img1])

  useEffect(() => {
    if (img2) {
      matchFaces()
    }
  }, [img2])

  console.log(img1, 'hello image ========>>>>>>>>>>>>>>>')

  const pickImage = first => {
    setSimilarity('')
    setImg2(null)

    setProfileDeclined(false)
    setProfileMatched(false)
    setIsLoading(true)
    FaceSDK.presentFaceCaptureActivity(
      result => {
        const res = JSON.parse(result)
        console.log(res, 'resresres')
        if (res?.exception?.message == 'Cancelled by user.') {
          return setIsLoading(false)
        }
        setImage(
          first,
          FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap,
          Enum.ImageType.LIVE
        )
      },
      e => { }
    )
  }

  // useEffect(() => {
  //   onPressProceed()
  // // logoutApi()
  // }, [])

  const onPressProceed = () => {
    setIsLoading(true)
    saveLoginToStore(true)

    const apiData = {
      is_verify: 1
    }

    verifyFaceApi(apiData)
      .then(res => {
        setIsLoading(false)
        _logout()
      })
      .catch(error => {
        setIsLoading(false)
        showError(ApiError(error))
      })
  }

  const setImage = (first, base64, type) => {
    console.log(first, 'hello-------------', base64, type)
    if (base64 == null) return
    setSimilarity('')
    if (first) {
      image1.bitmap = base64
      image1.imageType = type
      setImg1({ uri: 'data:image/png;base64,' + base64 })
    } else {
      image2.bitmap = base64
      image2.imageType = type
      setImg2({ uri: 'data:image/png;base64,' + base64 })
    }
    setIsLoading(false)
  }

  // const clearResults = () => {
  //   setImg1(null)
  //   setImg2(null)
  //   setSimilarity('Take a Selfie')
  //   setLiveness('nil')
  //   image1 = new MatchFacesImage()
  //   image2 = new MatchFacesImage()
  // }

  const lottieRefDecline = useRef(null)

  const matchFaces = () => {
    if (
      image1 == null ||
      image1.bitmap == null ||
      image1.bitmap === '' ||
      image2 == null ||
      image2.bitmap == null ||
      image2.bitmap === ''
    ) {
      return
    }
    setStartVerification(true)
    setSimilarity('Processing...')
    request = new MatchFacesRequest()
    request.images = [image1, image2]
    FaceSDK.matchFaces(
      JSON.stringify(request),
      response => {
        response = MatchFacesResponse.fromJson(JSON.parse(response))
        console.log(JSON.stringify(response), 'helllo response --->>>>>>>>.')
        if (JSON.stringify(response)?.includes('Face not detected on image.')) {
          setSimilarity('Sorry, Face not detected on image!!')
          setProfileDeclined(true)
          setStartVerification(false)
          setProfileMatched(false)
          lottieRefDecline.current.play()
          return
        }
        FaceSDK.matchFacesSimilarityThresholdSplit(
          JSON.stringify(response.results),
          0.75,
          str => {
            console.log(str, 'aslksjalkasdslakjsdalk')
            const split = MatchFacesSimilarityThresholdSplit.fromJson(
              JSON.parse(str)
            )
            console.log(split, 'split ===========>>>>>>>>>>>>>>>>>')
            if (split?.matchedFaces?.length > 0) {
              const matchPercentage = (
                split.matchedFaces[0].similarity * 100
              ).toFixed(2)
              setSimilarity(
                'Congrats! The image matched by ' + matchPercentage + '%'
              )
              if (matchPercentage > 40) {
                setProfileMatched(true)
                setProfileDeclined(false)
                // lottieRef.current.play()
              }
              setStartVerification(false)
            } else if (split?.unmatchedFaces?.length > 0) {
              setSimilarity('Sorry, the image doesn`t matched')
              setProfileMatched(false)
              setProfileDeclined(true)
              setStartVerification(false)
              lottieRefDecline.current.play()
            } else {
              setSimilarity('Sorry, the image doesn`t matched')
              setProfileMatched(false)
              setProfileDeclined(true)
              setStartVerification(false)
              lottieRefDecline.current.play()
            }
          },
          e => {
            setSimilarity(e)
            setProfileDeclined(true)
            setStartVerification(false)
            setProfileMatched(false)
            lottieRefDecline.current.play()
          }
        )
      },
      e => {
        setSimilarity(e)
        setProfileDeclined(true)
        setStartVerification(false)
        setProfileMatched(false)
        lottieRefDecline.current.play()
      }
    )
  }

  console.log(userData?.profile_image, 'user pic hahahahahh')

  const getBase64Url = async () => {
    const base64Image = await getItem('PROFILE_BASE_64')
    console.log(base64Image, 'base64Imagebase64Image')
    if (base64Image != null) {
      setImage(true, base64Image, Enum.ImageType.PRINTED)
      setIsLoading(false)
      return
    }

    RNFetchBlob.config({
      fileCache: true
    })
      .fetch('GET', userData?.profile_image)
      .then(resp => {
        setIsLoading(false)
        imagePath = resp.path()
        return resp.readFile('base64')
      })
      .then(base64Data => {
        setIsLoading(false)
        console.log(base64Data, 'hello user hahahahahh')
        setImage(true, base64Data, Enum.ImageType.PRINTED)
        return fs.unlink(imagePath)
      })
  }

  const onPressSignup = () => {
    removeItem('PROFILE_BASE_64')
    setIsLoading(true)
    logoutApi()
      .then(res => {
        setIsLoading(false)
        // saveLoginToStore(false)
        // saveLoginPinToStore(null)
        // clearLoginPin()
      })
      .catch(() => {
        setIsLoading(false)
      })
    removeZegoCloud()
  }

  const _logout = () => {
    removeItem('PROFILE_BASE_64')
    setIsLoading(true)
    logoutApi()
      .then(res => {
        setIsLoading(false)
        // saveLoginToStore(false)
        // saveLoginPinToStore(null)
        // clearLoginPin()
      })
      .catch(() => {
        setIsLoading(false)
      })
    removeZegoCloud()

    showSuccess(
      'Congrats! Your account has been successfully created.Please Signin to continue.',
      15000
    )
  }

  return (
    <WrapperContainer>
      <View style={{ flex: 0.95 }}>
        <View style={{ ...styles.viewStyle }}>
          <View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ ...styles.boxView }}
              activeOpacity={0.9}>
              <Image
                style={{
                  height: moderateScale(18),
                  width: moderateScale(18),
                  // tintColor: colors.white
                }}
                source={imagesPath?.ic_back}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              ...commonStyles.font_20_bold,
              marginStart: moderateScale(24)
            }}>
            Profile Verification
          </Text>
        </View>

        <View
          style={{
            flex: 0.6,
            padding: moderateScale(20),
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: moderateScale(20)
          }}>
          {img2
            ? (
              <ImageBackground
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: moderateScale(70)
                }}
                borderRadius={moderateScale(60)}
                source={img2}
                resizeMode={'cover'}>
                {startVerification && (
                  <View
                    style={{
                      height: '100%',
                      width: '100%',
                      backgroundColor: colors.blackOpacity50
                    }}>
                    <Lottie source={lottiePath.faceMatching} autoPlay loop />
                  </View>
                )}
              </ImageBackground>
            )
            : (
              <Image source={imagesPath?.ic_selfie} />
            )}
        </View>
        {similarity && (
          <>
            <Text
              style={{
                ...commonStyles.font_20_SemiBold,
                color: colors.black,
                textAlign: 'center'
              }}>
              Matching:
            </Text>
            <Text
              style={{
                ...commonStyles.font_16_regular,
                color: colors.blackOpacity70,
                textAlign: 'center',
                marginTop: moderateScale(6)
              }}>
              {similarity}
            </Text>
          </>
        )}
        <View
          style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center' }}>
          {profileMatched && (
            // <Lottie
            //   source={lottiePath.starEmoji}
            //   // autoPlay
            //   ref={lottieRef}
            //   loop={false}
            //   style={{ height: '90%', width: '100%' }}
            // />
            <Animated.View entering={BounceIn.duration(2000)}>
              {/* <Image source={imagesPath?.ic_logo_royo_dating} /> */}
            </Animated.View>
          )}
          {profileDeclined && (
            <Lottie
              source={lottiePath.failedEmoji}
              // autoPlay
              ref={lottieRefDecline}
              loop={false}
              style={{ height: '90%', width: '100%' }}
            />
          )}
        </View>
      </View>
      {profileMatched
        ? (
          <ButtonComp btnText={'Proceed'} onPressBtn={onPressProceed} />
        )
        : (
          <>
            {similarity == 'Processing...'
              ? (
                <></>
              )
              : (
                <ButtonComp
                  btnText={profileDeclined ? 'Retake' : 'Take a Selfie'}
                  btnView={{
                    // borderWidth: 1,
                    // borderColor: colors.themecolor2,
                    // backgroundColor: '#000'
                  }}
                  onPressBtn={() => pickImage(false)}
                // txtStyle={{
                //   color: colors.themecolor2
                // }}
                />
              )}
            {profileDeclined && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: moderateScale(14)
                }}>
                <Text style={{ ...commonStyles.font_12_regular }}>
                  Failed to verify account?
                </Text>
                <TouchableOpacity onPress={onPressSignup}>
                  <Text style={{ ...commonStyles.font_14_bold }}> Signup</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      <Loader
        isLoading={isLoading}
      // message={'Please hold on. We are verifying your profile picture.'}
      />
    </WrapperContainer>
  )
}

export default FaceDetection

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: moderateScale(10)
    // backgroundColor: colors.darkBlack,
    paddingTop: moderateScale(8)
  },
  boxView: {
    borderColor: colors.blackOpacity40,
    borderWidth: 0.5,
    height: moderateScale(48),
    width: moderateScale(48),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginBottom: 12
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  resultsScreenBackButton: {
    position: 'absolute',
    bottom: 0,
    right: 20
  }
})
