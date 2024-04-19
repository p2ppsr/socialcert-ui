import React, { useState } from 'react'
import { Authrite } from 'authrite-js'
import { Signia } from 'babbage-signia'
import getConstants from '../components/utils/getConstants'
import { useNavigate } from 'react-router-dom'

const EmailVerification = () => {
  const [email, setEmail] = useState('')
  const [valid, setValid] = useState(true)
  const [emailSentStatus, setEmailSentStatus] = useState(false)
  const [sentEmail, setSentEmail] = useState('')
  const authrite = new Authrite() // This could also be fixed by removing the enter phone number prompt once a text has been sent
  const signia = new Signia()
  const constants = getConstants()
  const navigate = useNavigate()
  signia.config.confederacyHost = constants.confederacyUrl

  function getUrl () {
    const hostname = window.location.hostname

    if (hostname.includes('staging')) {
      return 'https://staging-backend.socialcert.net/emailVerification'
    } else if (hostname.includes('localhost')) {
      return ('http://localhost:3002/emailVerification')
    } else {
      return 'https://backend.socialcert.net/emailVerification'
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value) // Update the email state with the new value
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    console.log(email)
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (regex.test(email)) {
      setValid(true)
      const data = { email, funcAction: 'sendEmail' }
      await authrite.request(getUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          setEmailSentStatus(data.emailtSentStatus)
          setSentEmail(data.textSentPhonenumber)
          console.log(`RETURNED DATA FROM SENDING TEXT ${data}`)
        })
        .catch(error => {
          console.log(error)
          console.error('Error in fetch call to phone verification occured')
        })
    } else {
      setValid(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleEmailSubmit}>
        <label>
          Email:
          <input
            type='text' name='emailField'
            value={email}
            onChange={handleEmailChange}
          />
        </label>
        <button type='submit'>Send Email</button>
      </form>
      {!valid && <p>A valid email is requird</p>}
    </div>
  )
}

export default EmailVerification
