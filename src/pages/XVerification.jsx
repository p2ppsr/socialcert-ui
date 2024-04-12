import React from 'react';
import { Authrite } from 'authrite-js';
import { Signia } from 'babbage-signia';
import getConstants from '../components/utils/getConstants';
const constants = getConstants()
const authrite = new Authrite();
const signia = new Signia();
const getUrl = () => {
    const hostname = window.location.hostname;

    if (hostname.includes('staging')) {
      return 'https://staging-backend.socialcert.net/handleXVerification';
    } else if (hostname.includes('localhost')) {
      return 'http://localhost:3002/handleXVerification';
    } else {
      return 'https://backend.socialcert.net/handleXVerification';
    }
  };

const XVerification = () => {
 
    const queryParams = new URLSearchParams(location.search);
    const oauthToken = queryParams.get('oauth_token');
    const oauthVerifier = queryParams.get('oauth_verifier');

    if (oauthToken && oauthVerifier) {
      // Use oauthToken and oauthVerifier to complete authentication with Twitter
      // You can make another request to your backend to exchange these tokens for access tokens
      // Once you have the access tokens, you can perform authenticated requests on behalf of the user
      getUserData(oauthToken, oauthVerifier)

      return <p>SUCCESSFULLY GOT OAUTH TOKEN</p>
  }

  async function callSignia(data){
    console.log("Inside Call Signia function")
await signia.publiclyRevealAttributes({}, constants.certifierUrl, constants.certifierPublicKey, constants.certificateTypes.phone,
    true, {XData: {userName: data.userName, profilePhoto: data.profilePhoto}, verificationType: "X"}, async (message)=>{
     
    })
    setSuccessStatus(true)

    if(!successStatus){
        return(
            navigate('/') 
        );
      }
}
  
  async function getUserData(oauthToken, oauthVerifier) {
      console.log('OAuth Token:', oauthToken);
      console.log('OAuth Verifier:', oauthVerifier);
      const data = {oauthToken: oauthToken, oauthVerifier: oauthVerifier, funcAction: "getUserInfo"}
      await authrite
      .request(getUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then((response) => response.json())
      .then((data) => {
        callSignia(data);
      })
      .catch((error) => {
        console.error('Error in fetch call to getUserInfo');
      });
  }

  const makeRequest = async () => {
    const data = { funcAction: 'makeRequest' }; // Sending initial request to backend to get the request token
    await authrite
      .request(getUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then((response) => response.json())
      .then((data) => {
        window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${data.requestToken}`;
      })
      .catch((error) => {
        console.error('Error in fetch call to make first X request');
      });
  }; 
    
  makeRequest(); 

  return <p>X VERIFICATION TEST TEXT</p>;
};

export default XVerification
