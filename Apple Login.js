import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button
} from 'react-native';

import { appleAuth } from '@invertase/react-native-apple-authentication';

const App = () => {

  const handleSignIn = () => {
    return appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    }).then(appleAuthRequestResponse => {
      console.log(appleAuthRequestResponse, "Qwerty")
      let { identityToken, email } = appleAuthRequestResponse;
      alert(identityToken + "\nEmail : " + email)
    }).catch(error => {
      console.log(error, "ERROR")
    })
  }
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <Button title="SignIn With Apple" onPress={handleSignIn} />
    </SafeAreaView>
  );
};

export default App;
