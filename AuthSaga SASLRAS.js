import { put, retry } from 'redux-saga/effects';
import { request } from '../../utilities/request';
import { navigate, goBack } from '../../utilities/NavigationService';
import { actionTypes, urls, screenNames } from '../../utilities/constants';
import logger from '../../utilities/logger';
import {
 getAPIError,
 showErrorAlert,
 showSuccessAlert,
 getLocalUserData
} from "../../utilities/helperFunctions";

function* fetchAll({ params }) {
 try {
 const config = {
 url: 'https://dog.ceo/api/breeds/image/random',
 };

 const response = yield request(config);
 yield put({
 type: actionTypes.FETCH_DATA_SUCCEEDED,
 url: response.data.message
 });

 } catch (error) {
 yield put({
 type: actionTypes.FETCH_DATA_FAIL,
 });
 }
}

function* getSearchSaga({ params, token }) {
 debugger
 try {
 const config = {
 url: `${urls.search_artist}${params.query}`,
 headers: {
 Authorization: `Bearer ${params.token}`
 }
 };

 const response = yield request(config);

 console.log(response, "responseresponseresponseresponse");

 if (response && response.data && response.data.status == 200) {

 yield put({
 type: actionTypes.SEARCH_ARTIST_SUCCEEDED,
 payload: response.data.data
 });
 }

 } catch (error) {
 yield put({
 type: actionTypes.SEARCH_ARTIST_FAIL,
 });
 }
}

function* getArtistProfileSaga({ params }) {
 debugger
 try {
 const config = {
 url: urls.get_artist,
 // headers: {
 // Authorization: `Bearer ${params.token}`
 // },
 data: params.params,
 method: 'POST',
 };

 const response = yield request(config);
 console.log(response, 'response getting from Artist_profile api')
 if (response && response.data && response.data.status == 200) {
 yield put({
 type: actionTypes.GET_ARTIST_SUCCEEDED,
 payload: response.data.data
 });
 }

 } catch (error) {

 logger.apiError('login error: ', error);

 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.GET_ARTIST_FAIL,
 });
 }
}

function* addLocationSaga({ params }) {
 debugger
 try {
 console.log('params', params)
 let dataGettingInParams = params.dataToBeSendToApi;
 let token = params.token;

 const config = {
 url: urls.add_address,
 headers: {
 Authorization: `Bearer ${token}`
 },
 method: 'POST',
 data: dataGettingInParams
 };

 const response = yield request(config);

 console.log(response, 'addLocationSaga api ')

 if (response && response.data && response.data.status == 200) {

 let payload = 'Your address has been saved successfully.';

 yield put({
 type: actionTypes.ADD_LOCATION_SUCCEEDED,
 });
 showSuccessAlert(payload)
 goBack();
 }

 } catch (error) {
 console.log(error.response.data.msg || error.response.data.message)
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.ADD_LOCATION_FAIL
 });
 }
}

function* getAddressesOfuser({ params }) {
 console.log('coming in getaddress', params)
 try {
 const config = {
 url: `${urls.get_addresses}${params.dataToSendInApiParams.user_id}`,
 headers: {
 Authorization: `Bearer ${params.dataToSendInApiParams.token}`
 },
 };

 const response = yield request(config);

 console.log(response, 'response getAddressesOfuser api')
 if (response && response.data && response.data.status == 200) {

 yield put({
 type: actionTypes.GET_LOCATION_ADDED_BY_USER_SUCCEEDED,
 payload: response.data.data
 });
 }
 } catch (error) {
 // logger.apiError('login error: ', error);
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.GET_LOCATION_ADDED_BY_USER_FAIL,
 });
 }
}

function* getCustomerBookingSaga({ params }) {
 try {

 const { token } = yield getLocalUserData();

 if (params && params.dataToSendInApiParams && params.dataToSendInApiParams.token) {
 config = {
 url: urls.get_user_booking,
 headers: {
 Authorization: `Bearer ${params.dataToSendInApiParams.token}`
 },
 };
 }
 config = {
 url: urls.get_user_booking,
 headers: {
 Authorization: `Bearer ${token}`
 },
 };


 // const config = {
 // url: urls.get_user_booking,
 // headers: {
 // Authorization: `Bearer ${params.dataToSendInApiParams.token}`
 // },
 // };

 const response = yield request(config);
 console.log(response, 'response getCustomerBookingSaga api')
 if (response && response.data && response.data.status == 200) {

 if (response.data.data.length > 0) {

 response.data.data.map((v, i) => {
 if (v.artist.images) {
 let newImages = JSON.parse(v.artist.images)
 v.artist.newImages = newImages;
 }
 })

 }

 yield put({
 type: actionTypes.GET_CUSTOMER_BOOKING_SUCCEEDED,
 payload: response.data.data
 });
 }
 } catch (error) {
 logger.apiError('login error: ', error);
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.GET_CUSTOMER_BOOKING_FAIL,
 });
 }
}

function* rescheduleBookingSaga({ params }) {

 try {
 let dataGettingInParams = params.dataToBeSendToApi;
 let token = params.token;

 const config = {
 url: urls.reschedule_booking,
 headers: {
 Authorization: `Bearer ${token}`
 },
 method: 'POST',
 data: dataGettingInParams
 };

 const response = yield request(config);
 console.log(response, 'reschedule_booking api ')

 if (response && response.data && response.data.status == 200) {

 let payload = response.data.message;

 yield put({
 type: actionTypes.RESCHEDULE_BOOKING_SUCCEEDED,
 // payload:
 });

 showSuccessAlert(payload)
 }
 } catch (error) {
 console.log(error.response.data.msg || error.response.data.message)
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.RESCHEDULE_BOOKING_FAIL
 });
 }
}

function* getBookingByServiceSaga({ params }) {
 console.log(params, 'params ')
 try {
 let dataGettingInParams = params.dataToSendInApiParams;
 let token = params.token;

 const config = {
 url: urls.get_booking_by_service,
 headers: {
 Authorization: `Bearer ${token}`
 },
 method: 'POST',
 data: dataGettingInParams
 };

 const response = yield request(config);
 console.log(response, 'get_booking_by_service api ')

 if (response && response.data && response.data.status == 200) {

 if (response.data.data.length > 0) {

 response.data.data.map((v, i) => {
 if (v.artist.images) {
 let newImages = JSON.parse(v.artist.images)
 v.artist.newImages = newImages;
 }
 })

 }

 yield put({
 type: actionTypes.GET_BOOKING_BY_SERVICE_SUCCEEDED,
 payload: response.data.data
 });

 }

 } catch (error) {
 // console.log(error.response.data.msg || error.response.data.message)
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.GET_BOOKING_BY_SERVICE_FAIL
 });
 }
}

function* getUpcomingBookingMemberSaga({ params }) {
 try {

 let token = params.token;

 const config = {
 url: urls.get_upcoming_booking_artist,
 headers: {
 Authorization: `Bearer ${token}`
 },
 };

 const response = yield request(config);
 console.log(response.data.data, 'get_upcoming_booking_artist api ')

 if (response && response.data && response.data.status == 200) {

 // if (response.data.data.length > 0) {

 // response.data.data.map((v, i) => {
 // if (v.artist.images) {
 // let newImages = JSON.parse(v.artist.images)
 // v.artist.newImages = newImages;
 // }
 // })

 // }
 let arrTobe = [
 {
 id: 'Start',
 name: 'Start'
 },
 {
 id: 'Complete',
 name: 'Complete'
 }
 ]
 // if (response && response.data && response.data.data.length > 0) {
 // response.data.data.forEach(element => {
 // console.log(element,'element in loop')
 // element['arrTobe']=[
 // {
 // id: 'Start',
 // name: 'Start'
 // },
 // {
 // id: 'Complete',
 // name: 'Complete'
 // }
 // ]
 // });
 // }
 yield put({
 type: actionTypes.GET_UPCOMING_BOOKING_MEMBER_SUCCEEDED,
 payload: response.data.data
 });

 }

 } catch (error) {
 // console.log(error.response.data.msg || error.response.data.message)
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.GET_UPCOMING_BOOKING_MEMBER_FAIL
 });
 }
}


function* getHistoryBookingCustomerSaga({ params }) {
 try {
 let token = params.token;

 const config = {
 url: urls.get_history_booking_customer,
 headers: {
 Authorization: `Bearer ${token}`
 },
 };

 const response = yield request(config);
 console.log(response, 'get_history_booking_customer api ')

 if (response && response.data && response.data.status == 200) {

 yield put({
 type: actionTypes.GET_HISTORY_BOOKING_CUSTOMER_SUCCEEDED,
 payload: response.data.data
 });

 }

 } catch (error) {
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.GET_HISTORY_BOOKING_CUSTOMER_FAIL
 });
 }
}

function* getHistoryBookingMemberSaga({ params }) {
 try {
 let token = params.token;

 const config = {
 url: urls.get_history_booking_artist,
 headers: {
 Authorization: `Bearer ${token}`
 },
 };

 const response = yield request(config);
 console.log(response, 'get_history_booking_artist api ')

 if (response && response.data && response.data.status == 200) {

 yield put({
 type: actionTypes.GET_HISTORY_BOOKING_MEMBER_SUCCEEDED,
 payload: response.data.data
 });

 }

 } catch (error) {
 // console.log(error.response.data.msg || error.response.data.message)
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.GET_HISTORY_BOOKING_MEMBER_FAIL
 });
 }
}


function* acceptBookingSaga({ params }) {
 try {
 let dataGettingInParams = params.dataToBeSendToApi;
 let token = params.token;

 const config = {
 url: urls.accept_booking,
 headers: {
 Authorization: `Bearer ${token}`
 },
 method: 'POST',
 data: dataGettingInParams
 };

 const response = yield request(config);
 console.log(response, 'acceptBookingSaga api ')

 if (response && response.data && response.data.status == 200) {

 let payload = response.data.message;

 yield put({
 type: actionTypes.ACCEPT_BOOKING_SUCCEEDED,
 });

 showSuccessAlert(payload)
 }

 } catch (error) {
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.ACCEPT_BOOKING_FAIL
 });
 }
}

function* getUpcomingBookingCustomerSaga({ params }) {
 try {

 let token = params.token;

 const config = {
 url: urls.get_upcoming_booking_customer,
 headers: {
 Authorization: `Bearer ${token}`
 },
 };

 const response = yield request(config);
 console.log(response, 'get_upcoming_booking_customer api ')

 if (response && response.data && response.data.status == 200) {

 yield put({
 type: actionTypes.GET_UPCOMING_BOOKING_CUSTOMER_SUCCEEDED,
 payload: response.data.data
 });

 }

 } catch (error) {
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.GET_UPCOMING_BOOKING_CUSTOMER_FAIL
 });
 }
}

function* cancelBookingSaga({ params }) {
 try {
 let dataGettingInParams = params.dataToBeSendToApi;
 let token = params.token;

 const config = {
 url: urls.cancel_booking,
 headers: {
 Authorization: `Bearer ${token}`
 },
 method: 'POST',
 data: dataGettingInParams
 };

 const response = yield request(config);
 console.log(response, 'cancelBooking api ')

 if (response && response.data && response.data.status == 200) {

 let payload = 'Your booking has been cancelled.';

 yield put({
 type: actionTypes.CANCEL_BOOKING_SUCCEEDED,
 });

 showSuccessAlert(payload)
 }

 } catch (error) {
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.CANCEL_BOOKING_FAIL
 });
 }
}

function* completeBookingSaga({ params }) {
 try {
 let dataGettingInParams = params.dataToBeSendToApi;
 let token = params.token;

 const config = {
 url: urls.complete_booking,
 headers: {
 Authorization: `Bearer ${token}`
 },
 method: 'POST',
 data: dataGettingInParams
 };

 const response = yield request(config);
 console.log(response, 'complete booking api ')

 if (response && response.data && response.data.status == 200) {

 yield put({
 type: actionTypes.MARK_COMPLETE_BOOKING_SUCCEEDED,
 });
 // showSuccessAlert(response && response.data && response.data.message)
 }

 } catch (error) {
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.MARK_COMPLETE_BOOKING_FAIL
 });
 }
}


function* startBookingSaga({ params }) {
 try {
 let dataGettingInParams = params.dataToBeSendToApi;
 let token = params.token;

 const config = {
 url: urls.start_booking,
 headers: {
 Authorization: `Bearer ${token}`
 },
 method: 'POST',
 data: dataGettingInParams
 };

 const response = yield request(config);
 console.log(response, 'start booking api ')

 if (response && response.data && response.data.status == 200) {

 yield put({
 type: actionTypes.GET_SERVICES_BY_ID_SUCCEEDED,
 });
 // showSuccessAlert(response && response.data && response.data.message)
 }

 } catch (error) {
 console.log(getAPIError(error), 'start booking api error')
 showErrorAlert(getAPIError(error.message));
 yield put({
 type: actionTypes.MARK_START_BOOKING_FAIL
 });
 }
}

function* getMemberBookingSaga({ params }) {
 try {
 const config = {
 url: `${urls.get_booking_member}${params.artist_id}`,
 headers: {
 Authorization: `Bearer ${params.token}`
 },
 };

 const response = yield request(config);
 console.log(response, 'response getMemberBookingSaga api')
 if (response && response.data && response.data.status == 200) {

 // if (response.data.data.length > 0) {

 // response.data.data.map((v, i) => {
 // if (v.artist.images) {
 // let newImages = JSON.parse(v.artist.images)
 // v.artist.newImages = newImages;
 // }
 // })

 // }
 yield put({
 type: actionTypes.GET_MEMBER_BOOKING_SUCCEEDED,
 payload: response.data.data
 });
 }
 } catch (error) {
 logger.apiError('login error: ', error);
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.GET_MEMBER_BOOKING_FAIL,
 });
 }
}


function* getAllCategoriesSaga({ params }) {
 console.log(params, 'params in getcategory')
 try {
 // const { token } = yield getLocalUserData();

 // if (params && params.dataToSendInApiParams && params.dataToSendInApiParams.token) {
 // config = {
 // url: `${urls.menu}?gender=${params.dataToSendInApiParams.gender == 0 ? 0 : params.dataToSendInApiParams.gender == 1 ? 1 : 0}`,
 // headers: {
 // Authorization: `Bearer ${params.dataToSendInApiParams.token}`
 // },
 // };
 // }
 config = {
 // url: urls.menu,
 url: `${urls.menu}?gender=${params.dataToSendInApiParams.gender == 0 ? 0 : params.dataToSendInApiParams.gender == 1 ? 1 : 0}`,
 headers: {
 Authorization: `Bearer ${params.dataToSendInApiParams.token}`
 },
 };

 const response = yield request(config);
 console.log(response, 'response by getAllCategories api')

 if (response && response.status == 200) {
 yield put({
 type: actionTypes.GET_ALL_CATAGERY_SUCCEEDED,
 payload: response.data.data
 });
 }
 } catch (error) {
 logger.apiError('login error: ', error);
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.GET_ALL_CATAGERY_FAIL,
 });
 }
}

function* getServicesByCatagoryIdSaga({ params }) {
 try {
 const config = {
 url: `${urls.get_services_by_category}${params.dataToSendInApiParams.category_id}`,
 headers: {
 Authorization: `Bearer ${params.token}`
 },
 };

 const response = yield request(config);
 console.log(response, 'response by service id api')

 if (response && response.data && response.data.status == 200) {
 // navigate('Search')
 navigate('ServicesByCatagory')
 yield put({
 type: actionTypes.GET_SERVICES_BY_ID_SUCCEEDED,
 payload: response.data.data
 });
 }

 } catch (error) {
 logger.apiError('login error: ', error);
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.GET_SERVICES_BY_ID_FAIL,
 });
 }
}

function* getAllArtistByServiceIdSaga({ params }) {
 try {
 const config = {
 url: `${urls.search_artist_by_serviceID}${params.dataToSendInApiParams.service_id}`,
 headers: {
 Authorization: `Bearer ${params.token}`
 },
 };

 const response = yield request(config);
 console.log(response, 'response by service id api')

 if (response && response.data && response.data.status == 200) {
 navigate('ArtistByServices')
 yield put({
 type: actionTypes.GET_ARTIST_BY_SERVICESID_SUCCEEDED,
 payload: response.data.data
 });
 }

 } catch (error) {
 logger.apiError('API error: ', error);
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.GET_ARTIST_BY_SERVICESID_FAIL,
 });
 }
}




function* applyPromocodeSaga({ params }) {
 try {
 console.log('params', params)
 let dataGettingInParams = params.dataToBeSendToApi;
 let token = params.token;

 const config = {
 url: urls.apply_coupon,
 headers: {
 Authorization: `Bearer ${token}`
 },
 method: 'POST',
 data: dataGettingInParams
 };

 const response = yield request(config);
 console.log(response, 'apply_coupon api ')

 if (response && response.data && response.data.status == 200) {

 let showMsg = 'Promo code applied successfully.';

 let payload = {};
 payload.discount = response.data.discount;
 payload.grand_total = response.data.grand_total;

 yield put({
 type: actionTypes.APPLY_PROMO_SUCCEEDED,
 payload: payload
 });
 // showSuccessAlert(showMsg)
 }
 } catch (error) {
 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.APPLY_PROMO_FAIL
 });
 }
}

function* getAllNotificationsSaga({ params }) {
 try {
 const config = {
 url: urls.getnotifications,
 headers: {
 Authorization: `Bearer ${params.token}`
 }
 };
 const response = yield request(config);
 if (response && response.data && response.data.statuscode == 200) {

 yield put({
 type: actionTypes.GET_NOTIFICATIONS_SUCCEEDED,
 payload: response && response.data && response.data.data && response.data.data.notifications
 });
 }

 } catch (error) {

 logger.apiError('login error: ', error);

 showErrorAlert(getAPIError(error));
 yield put({
 type: actionTypes.GET_NOTIFICATIONS_FAIL,
 });
 }
}

function* changeColorHeaderCalenderSaga(param) {
 yield put({
 type: actionTypes.CHANGE_COLOR_HEADER_CALENDER_SUCCEEDED,
 payload: param.params
 });
}

function* genderKeySaga(param) {
 yield put({
 type: actionTypes.GENDER_KEY_SUCCEEDED,
 payload: param
 });
}

function* rateArtistSaga(param) {
 try {
 const config = {
 url: urls.rateArtist,
 headers: {
 Authorization: `Bearer ${param.params.token}`
 },
 data: param.params,
 method: 'POST',
 };
 const response = yield request(config);
 console.log(response, "rate artist api response");
 showSuccessAlert(response.data.message)
 } catch (error) {
 console.log(error.message, "rate artist api error");
 showErrorAlert(getAPIError(error));
 }
}

function* getArtistRatingSaga(apiData) {
 console.log(apiData, "get ratings api tRatingSaga");
 try {
 const config = {
 url: urls.get_artist_rating_calc + apiData.payload.data.artistId,
 headers: {
 Authorization: `Bearer ${apiData.payload.data.token}`
 },
 method: 'GET',
 };
 const response = yield request(config);
 console.log(response, "get ratings api response");
 apiData.cb(response)
 yield put({
 type: actionTypes.ARTIST_RATING_SUCCEEDED,
 payload: response.data.data
 });
 // showSuccessAlert(response.data.message)
 } catch (error) {
 console.log(error.message, "get ratings api error");
 }
}

function* getCommentsSaga(apiData) {
 console.log(apiData, "get comments api");
 try {
 const config = {
 url: urls.getArtistComments + apiData.payload.data.artistId + "&page=" + apiData.payload.data.commentsPageNo,
 headers: {
 Authorization: `Bearer ${apiData.payload.data.token}`
 },
 method: 'GET',
 };
 const response = yield request(config);
 console.log(response, "get comments api response");
 apiData.cb(response)
 } catch (error) {
 console.log(error.message, "get comments api error");
 }
}

export {
 fetchAll,
 getSearchSaga,
 getArtistProfileSaga,
 addLocationSaga,
 getAddressesOfuser,
 getCustomerBookingSaga,
 rescheduleBookingSaga,
 getBookingByServiceSaga,
 getUpcomingBookingMemberSaga,
 getHistoryBookingMemberSaga,
 acceptBookingSaga,
 cancelBookingSaga,
 getUpcomingBookingCustomerSaga,
 getMemberBookingSaga,
 applyPromocodeSaga,
 getServicesByCatagoryIdSaga,
 getAllCategoriesSaga,
 completeBookingSaga,
 startBookingSaga,
 getHistoryBookingCustomerSaga,
 getAllArtistByServiceIdSaga,
 getAllNotificationsSaga,
 changeColorHeaderCalenderSaga,

 genderKeySaga,
 rateArtistSaga,
 getArtistRatingSaga,
 getCommentsSaga
};
