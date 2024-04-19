import React, { useState } from 'react'
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

import { Authrite } from 'authrite-js'
import { Signia } from 'babbage-signia'
import getConstants from '../components/utils/getConstants'
import { useNavigate } from 'react-router-dom'

const PhoneRedirect = () => {
  const [valid, setValid] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [textSentStatus, setTextSentStatus] = useState(false)
  const [textSentPhonenumber, setTextSentPhonenumber] = useState('')// Makes sure user doesn't put in different phonenumber in submission box causing verification code to be messed up
  const [progressStatus, setProgressStatus] = useState('')
  const [successStatus, setSuccessStatus] = useState(false)
  const authrite = new Authrite() // This could also be fixed by removing the enter phone number prompt once a text has been sent
  const signia = new Signia()
  const constants = getConstants()
  const navigate = useNavigate()
  signia.config.confederacyHost = constants.confederacyUrl

  function getUrl () {
    const hostname = window.location.hostname

    if (hostname.includes('staging')) {
      return 'https://staging-backend.socialcert.net/sendVerificationText'
    } else if (hostname.includes('localhost')) {
      return ('http://localhost:3002/sendVerificationText')
    } else {
      return 'https://backend.socialcert.net/sendVerificationText'
    }
  }

  const handlePhoneNumberSubmit = async (e) => {
    e.preventDefault()
    if (valid) {
      const data = { phoneNumber, funcAction: 'sendText' }
      await authrite.request(getUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          setTextSentStatus(data.textSentStatus)
          setTextSentPhonenumber(data.textSentPhonenumber)
        })
        .catch(error => {
          console.log(error)
          console.error('Error in fetch call to phone verification occured')
        })
    }
  }

  const handleChange = (value) => {
    const regex = /[a-zA-Z]/
    if (!regex.test(value)) {
      setPhoneNumber(value)
      setValid(isValidPhoneNumber(value))
    }
  }

  const handleVerificationSubmit = async (e) => {
    e.preventDefault()
    if (textSentStatus === true) {
      const data = { phoneNumber: textSentPhonenumber, verificationCode, funcAction: 'verifyCode' }
      await authrite.request(getUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          if (data.verificationStatus) {
            callSignia(data)
          } else {
            // User entered incorrect code either show not verified screen or do nothing
          }
        })
        .catch(error => {
          console.log(error)
          console.error('Error in handling verification of text code')
        })
    }
  }

  async function callSignia (data) {
    console.log('Inside Call Signia function')
    console.log(`${data.verifiedPhonenumber}`)
    await signia.publiclyRevealAttributes({}, constants.certifierUrl, constants.certifierPublicKey, constants.certificateTypes.phone,
      true, { phoneNumber: data.verifiedPhonenumber, verificationType: 'phoneNumber' }, async (message) => {
        setProgressStatus(message)
      })
    setSuccessStatus(true)

    if (!successStatus) {
      return (
        navigate('/')
      )
    }
  }

  const handleVerificationChange = (e) => {
    setVerificationCode(e.target.value)
  }

  return (
    <div>

      <form onSubmit={handlePhoneNumberSubmit}>
        <PhoneInput
          defaultCountry='US'
          placeholder='Enter phone number'
          value={phoneNumber}
          rules={{ required: true }}
          onChange={handleChange}
        />

        <button type='submit'>Submit</button>
      </form>
      {!valid && <p>A valid phone number is requird</p>}

      <form onSubmit={handleVerificationSubmit}>
        <label>
          Verification Code:
          <input
            type='text' name='Verification Code'
            value={verificationCode}
            onChange={handleVerificationChange}
          />
        </label>
        <button type='submit'>Submit Verification Code</button>
      </form>

    </div>

  )
}

export default PhoneRedirect
