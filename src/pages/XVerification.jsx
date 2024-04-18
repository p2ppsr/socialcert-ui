import React, { useEffect } from 'react'
import { Authrite } from 'authrite-js'
import { Signia } from 'babbage-signia'
import getConstants from '../components/utils/getConstants'
import { useNavigate } from 'react-router-dom'
const constants = getConstants()
const authrite = new Authrite()
const signia = new Signia()
signia.config.confederacyHost = constants.confederacyUrl

const getUrl = () => { // should move into utils
  const hostname = window.location.hostname

  if (hostname.includes('staging')) {
    return 'https://staging-backend.socialcert.net/handleXVerification'
  } else if (hostname.includes('localhost')) {
    return 'http://localhost:3002/handleXVerification'
  } else {
    return 'https://backend.socialcert.net/handleXVerification'
  }
}

const getCallbackUrl = () => { // should move into utils
  const hostname = window.location.hostname

  if (hostname.includes('staging')) {
    return 'https://staging.socialcert.net/XVerification'
  } else if (hostname.includes('localhost')) {
    return 'http://localhost:8088/XVerification'
  } else {
    return 'https://socialcert.net/XVerification'
  }
}

const XVerification = () => {
  const callbackUrl = getCallbackUrl()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(window.location.search)
  const oauthToken = queryParams.get('oauth_token')
  const oauthVerifier = queryParams.get('oauth_verifier')

  useEffect(() => {
    if (oauthToken && oauthVerifier) {
      (async () => {
        console.log(`CALLBACKURL: ${callbackUrl}`)
        const data = { oauthToken, oauthVerifier, funcAction: 'getUserInfo' }
        await authrite
          .request(getUrl(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then((response) => response.json())
          .then(async (data) => {
            await signia.publiclyRevealAttributes({}, constants.certifierUrl, constants.certifierPublicKey, constants.certificateTypes.x,
              true, { XData: { userName: data.userName, profilePhoto: data.profilePhoto }, verificationType: 'X' }, async (message) => {

              })
            navigate('/')
          })
          .catch(() => {
            console.error('Error in fetch call to getUserInfo') // Navigate to failure page
          })
      })()
    } else {
      (async () => {
        const data = { funcAction: 'makeRequest' } // Sending initial request to backend to get the request token
        await authrite
          .request(getUrl(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then((response) => response.json())
          .then((data) => {
            console.log(`CALLBACKURL: ${callbackUrl}`)
            window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_callback=${encodeURIComponent(callbackUrl)}&oauth_token=${data.requestToken}`
          })
          .catch(() => {
            console.error('Error in fetch call to make first X request')
          })
      })()
    }
  }, [])

  return (
    <p>test landing page</p>
  )
}

export default XVerification
