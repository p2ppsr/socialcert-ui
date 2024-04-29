import React, { useEffect, useRef, useState } from "react"
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"
import "react-phone-number-input/style.css"

import { Authrite } from "authrite-js"
import { Signia } from "babbage-signia"
import { useNavigate } from "react-router-dom"
import socialCertLogo from "../../assets/images/socialCert.svg"
import getConstants from "../../utils/getConstants"

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import "./PhoneVerification.scss"
import GoBackButton from "../../components/NavigateButton"
import { usePhoneStore } from "../../stores/stores"
import { getBackendUrl } from "../../utils/getBackendUrl"
import { sendVerificationText } from "./utils/phoneUtils"
import NavigateButton from "../../components/NavigateButton"

const PhoneVerification = () => {
  // Constructors ===========================================================
  const authrite = new Authrite()
  const signia = new Signia()
  const constants = getConstants()
  const navigate = useNavigate()

  // State ==================================================================

  // Form state
  const [valid, setValid] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Phone number response from authrite, used in EnterPhoneCode
  const [
    textSentPhonenumber,
    setTextSentPhonenumber,
    textSentStatus,
    setTextSentStatus,
  ] = usePhoneStore((state: any) => [
    state.textSentPhonenumber,
    state.setTextSentPhonenumber,
    state.textSentStatus,
    state.setTextSentStatus,
  ])

  signia.config.confederacyHost = constants.confederacyUrl

  // Handlers ===================================================================

  const handlePhoneNumberSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (valid) {
      try {
        // const data = { phoneNumber, funcAction: "sendText" }
        // const response = await authrite.request(getBackendUrl(), {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(data),
        // })
        const responseData = await sendVerificationText(phoneNumber)
        setTextSentPhonenumber(responseData.textSentPhonenumber)
        setTextSentStatus(responseData.textSentStatus)

        // navigate to enter phone code page
        navigate("EnterPhoneCode")
      } catch (error) {
        console.error(
          "Error in fetch call to phone verification occurred",
          error
        )
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handlePhoneInputChange = (value: string) => {
    const regex = /[a-zA-Z]/
    if (!regex.test(value)) {
      setPhoneNumber(value)
      setValid(isValidPhoneNumber(value))
    }
  }

  return (
    <div className="container">
      <img src={socialCertLogo} className="main-logo" />

      <p className="sub-header-text">
        Certify your identity using your phone number
      </p>
      <div style={{ textAlign: "center", maxWidth: "25rem" }}>
        <p style={{ marginBottom: ".25rem" }}>
          Add your number for securtiy, login, and account-related purposes.{" "}
        </p>
        <p>We'll send you a text to verify.</p>
      </div>
      <form onSubmit={handlePhoneNumberSubmit}>
        <div className="flex phone-input-container">
          {/* Phone input component*/}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
            }}
          >
            <PhoneInput
              defaultCountry="US"
              placeholder="555-867-5309"
              value={phoneNumber}
              rules={{ required: true }}
              onChange={handlePhoneInputChange}
              className="phone-input"
            />
            {/* Background component to add contrast under the country select */}
            <div className="phone-input-country-background" />
          </div>

          <button
            type="submit"
            className="submit-button"
            onClick={() => {
              setHasSubmitted(true)
            }}
          >
            Submit
          </button>
        </div>
      </form>
      {!valid && hasSubmitted && (
        <p style={{ color: "tomato" }}>A valid phone number is required</p>
      )}

      {isSubmitting && (
        <>
          <div className="flex" style={{ alignItems: "center" }}>
            <p>Checking verification status...</p>
            <LoadingSpinner />
          </div>
        </>
      )}

      {/* {false && (
        <>
          <form onSubmit={handleVerificationSubmit}>
            <label>
              Verification Code:
              <input
                type="text"
                name="Verification Code"
                value={verificationCode}
                onChange={handleVerificationChange}
              />
            </label>
            <button type="submit">Submit Verification Code</button>
          </form>
          {verificationSubmitted && locked && (
            <p>You must wait 10 minutes before trying again.</p>
          )}
          {verificationSubmitted && !locked && (
            <p>Remaining attempts until lock out: {verificationAttempts}</p>
          )}
        </>
      )} */}

      <NavigateButton navigatePath="/" label={"Go back"} />
    </div>
  )
}

export default PhoneVerification
