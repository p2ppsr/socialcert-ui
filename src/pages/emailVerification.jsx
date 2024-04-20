import React, { useState, useEffect } from 'react'
import { Authrite } from 'authrite-js'
import { Signia } from 'babbage-signia'
import getConstants from '../components/utils/getConstants'
import { useNavigate } from 'react-router-dom'

const EmailVerification = () => {
  const [email, setEmail] = useState('')
  const [valid, setValid] = useState(true)
  const [verificationCode, setVerificationCode] = useState('')
  const [emailSentStatus, setEmailSentStatus] = useState(false)
  const [sentEmail, setSentEmail] = useState('')
  const [successStatus, setSuccessStatus] = useState(false)
  const [verificationAttempts, setVerificationAttempts] = useState(5)
  const [locked, setLocked] = useState(false)
  const [verificationSubmitted, setVerificationSubmitted] = useState(false) // Keeps track of when to display attempts counter
  const authrite = new Authrite()
  const signia = new Signia()
  const constants = getConstants()
  const navigate = useNavigate()
  signia.config.confederacyHost = constants.confederacyUrl

  useEffect(() => {
    if (locked) {
      setTimeout(() => {
        setLocked(false)
        setVerificationAttempts(5)
      }, 600000)
    }
  }, [locked])

  function getUrl () {
    const hostname = window.location.hostname

    if (hostname.includes('staging')) {
      return 'https://staging-backend.socialcert.net/handleEmailVerification'
    } else if (hostname.includes('localhost')) {
      return 'http://localhost:3002/handleEmailVerification'
    } else {
      return 'https://backend.socialcert.net/handleEmailVerification'
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handleVerificationChange = (e) => {
    setVerificationCode(e.target.value)
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    console.log(email)
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (regex.test(email)) {
      setValid(true)
      const data = { email, funcAction: 'sendEmail' }
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
          setEmailSentStatus(data.emailSentStatus)
          setSentEmail(data.sentEmail)
          console.log(data.sentEmail)
          console.log(data.emailSentStatus)
          console.log(`RETURNED DATA FROM SENDING TEXT ${data.json}`)
        })
        .catch((error) => {
          console.log(error)
          console.error('Error in fetch call to phone verification occurred')
        })
    } else {
      setValid(false)
    }
  }

  const handleVerificationSubmit = async (e) => {
    e.preventDefault()
    if (emailSentStatus === true && locked === false) {
      setVerificationSubmitted(true)
      const data = { verifyEmail: sentEmail, verificationCode, funcAction: 'verifyCode' }
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
          if (data.verificationStatus === true) {
            callSignia(data)
          } else {
            if (verificationAttempts === 1) {
              setLocked(true)
            }
            setVerificationAttempts(verificationAttempts - 1)
          }
        })
        .catch((error) => {
          console.log(error)
          console.error('Error in handling verification of text code')
        })
    }
  }

  async function callSignia (data) {
    console.log('Inside Call Signia function')
    console.log(sentEmail)
    await signia.publiclyRevealAttributes(
      {},
      constants.certifierUrl,
      constants.certifierPublicKey,
      constants.certificateTypes.email,
      true,
      { email: sentEmail, verificationType: 'email' },
      async (message) => {}
    )
    setSuccessStatus(true)

    if (!successStatus) {
      return navigate('/')
    }
  }

  return (
    <div>
      <form onSubmit={handleEmailSubmit}>
        <label>
          Email:
          <input type='text' name='emailField' value={email} onChange={handleEmailChange} />
        </label>
        <button type='submit'>Send Email</button>
      </form>
      {!valid && <p>A valid email is required</p>}

      <form onSubmit={handleVerificationSubmit}>
        <label>
          Verification Code:
          <input type='text' name='verificationField' value={verificationCode} onChange={handleVerificationChange} />
        </label>
        <button type='submit'>Verify Email</button>
      </form>
      {verificationSubmitted && locked && <p>You must wait 10 minutes before trying again.</p>}
      {verificationSubmitted && !locked && <p>Remaining attempts until lock out: {verificationAttempts}</p>}
    </div>
  )
}

export default EmailVerification
