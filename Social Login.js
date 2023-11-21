import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LoginManager, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import { appleAuth } from '@invertase/react-native-apple-authentication';

export const handleGoogleLogin = async () => {
  GoogleSignin.configure()
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    return userInfo
  } catch (error) {
    return error
  }
}

export const fbLogin = (resCallback) => {
  LoginManager.logOut();
  return LoginManager.logInWithPermissions(['email', 'public_profile']).then(
    result => {
      console.log(result, 'the result of login i get are as follow');
      if (result.declinedPermissions && result.declinedPermissions.includes("email")) {
        resCallback({ message: "Email is required" });
      }
      if (result.isCancelled) {
        console.log("erorrr")
      } else {
        const infoRequest = new GraphRequest(
          '/me?fields=email,name,picture,friends',
          null,
          resCallback,
        );
        new GraphRequestManager().addRequest(infoRequest).start();
      }
    },
    function (error) {
      console.log('Login fail with error: ' + error);
    },
  );
};

export const appleLogin = async () => {
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
  console.log("APPLE AUTH", appleAuthRequestResponse);
  return appleAuthRequestResponse;
};
