<GooglePlacesAutocomplete
placeholder='Pickup location'
onPress={(data, details = null) => {
console.log(data, details, "asjdkajsdjas");
setLocationValue(data?.description);
setCurrLocation({
latitude: details?.geometry?.location?.lat || 25.276987,
longitude: details?.geometry?.location?.lng || 55.296249,
})
}}
query={{
key: google_map_api_key,
language: 'en',
}}
GooglePlacesDetailsQuery={{
fields: ['name', 'geometry', 'formatted_address'],
}}
enableHighAccuracyLocation={true}
fetchDetails={true}
textInputProps={{
value: locationValue,
backgroundColor: colors.grey0,
// onChangeText:(val)=>setLocationValue(val)
}}
isPredefinedPlace={true}
predefinedPlacesAlwaysVisible={true}
enablePoweredByContainer={false}
nearbyPlacesAPI="GooglePlacesSearch"
GoogleReverseGeocodingQuery={{}}
GooglePlacesSearchQuery={{
rankby: 'distance',
type: 'address',
}}
keyboardShouldPersistTaps="handled"
filterReverseGeocodingByTypes={[
'locality',
'administrative_area_level_3',
]}
>
</GooglePlacesAutocomplete>
