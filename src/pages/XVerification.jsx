import { Authrite } from 'authrite-js'
import { Signia } from 'babbage-signia'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBackendUrl } from "../utils/getBackendUrl"
import getConstants from '../utils/getConstants'
const constants = getConstants()
const authrite = new Authrite()
const signia = new Signia()
signia.config.confederacyHost = constants.confederacyUrl
const hostname = window.location.hostname

const XVerification = () => {
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(window.location.search)
  const oauthToken = queryParams.get('oauth_token')
  const oauthVerifier = queryParams.get('oauth_verifier')
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (oauthToken && oauthVerifier) {
      (async () => {
        const data = { oauthToken, oauthVerifier, funcAction: 'getUserInfo' }
        await authrite
          .request(getBackendUrl("X"), {
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
                setStatus(message)
              })
            navigate('/')
          })
          .catch(() => {
            console.error('Error in fetch call to getUserInfo') // Navigate to failure page
          })
      })()
    } else {
      (async () => {
        const data = { funcAction: 'makeRequest', hostURL: hostname } // Sending initial request to backend to get the request token
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
            window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${data.requestToken}`
          })
          .catch(() => {
            console.error('Error in fetch call to make first X request')
          })
      })()
    }
  }, [])

  // TODO: Make the UX better on this page!
  return (
    <div>
      <p>X verification page</p>
      <p>Status: {status}</p>
    </div>
  )
}

export default XVerification
