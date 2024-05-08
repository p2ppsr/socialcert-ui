import React, { useState, useEffect } from 'react'
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

import { Authrite } from 'authrite-js'
import { Signia } from 'babbage-signia'
import getConstants from '../../utils/getConstants'
import { useNavigate } from 'react-router-dom'

const PhoneVerification = () => {
  const [valid, setValid] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [textSentStatus, setTextSentStatus] = useState(false)
  const [textSentPhonenumber, setTextSentPhonenumber] = useState('')
  const [successStatus, setSuccessStatus] = useState(false)
  const [verificationAttempts, setVerificationAttempts] = useState(5)
  const [locked, setLocked] = useState(false)
  const [verificationSubmitted, setVerificationSubmitted] = useState(false) // New state variable
  const authrite = new Authrite()
  const constants = getConstants()
  const signia = new Signia()
  signia.config.confederacyHost = constants.confederacyUrl
  const navigate = useNavigate()

  useEffect(() => {
    if (locked) {
      setTimeout(() => {
        setLocked(false)
        setVerificationAttempts(5)
      }, 600000) // Unlock after 10 minutes
    }
  }, [locked])

  function getUrl() {
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
          console.error('Error in fetch call to phone verification occurred:', error)
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
    if (textSentStatus === true && locked === false) {
      setVerificationSubmitted(true)
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
            if (verificationAttempts === 1) {
              setLocked(true)
            }
            setVerificationAttempts(verificationAttempts - 1)
          }
        })
        .catch(error => {
          console.error('Error in handling verification of text code:', error)
        })
    }
  }

  async function callSignia(data) {
    await signia.publiclyRevealAttributes({}, constants.certifierUrl, constants.certifierPublicKey, constants.certificateTypes.phone,
      true, { phoneNumber: data.verifiedPhonenumber, verificationType: 'phoneNumber' }, async (message) => {
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
      {verificationSubmitted && locked && <p>You must wait 10 minutes before trying again.</p>}
      {verificationSubmitted && !locked && <p>Remaining attempts until lock out: {verificationAttempts}</p>}
    </div>

  )
}

export default PhoneVerification