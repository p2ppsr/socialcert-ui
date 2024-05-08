import { Authrite } from "authrite-js"
import { Signia } from "babbage-signia"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import socialCertLogo from "../../assets/images/socialCert.svg"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import NavigateButton from "../../components/NavigateButton"
import VerifyCodeInput from "../../components/VerifyCodeInput/VerifyCodeInput"
import { getBackendUrl } from "../../utils/getBackendUrl"
import getConstants from "../../utils/getConstants"
import "./EmailVerification.scss"
import { sendVerificationEmail } from "./utils/emailUtils"
import { toast } from "react-toastify"

const EmailVerification = () => {
  // Constructors ======================================================================
  const authrite = new Authrite()
  const signia = new Signia()
  const constants = getConstants()
  const navigate = useNavigate()
  signia.config.confederacyHost = constants.confederacyUrl

  // State =======================================================================

  const [email, setEmail] = useState<string>("")
  const [valid, setValid] = useState<boolean>(true)
  const [verificationCode, setVerificationCode] = useState<string>("")
  const [emailSentStatus, setEmailSentStatus] = useState<boolean>(false)
  const [sentEmail, setSentEmail] = useState<string>("")
  const [successStatus, setSuccessStatus] = useState<boolean>(false)
  const [verificationAttempts, setVerificationAttempts] = useState<number>(5)
  const [locked, setLocked] = useState<boolean>(false)
  const [verificationSubmitted, setVerificationSubmitted] = useState<boolean>(
    false
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Effects ====================================================================

  useEffect(() => {
    if (locked) {
      setTimeout(() => {
        setLocked(false)
        setVerificationAttempts(5)
      }, 600000)
    }
  }, [locked])

  // Reset valid state if email input changes
  useEffect(() => {
    setValid(true)
  }, [email])

  // Handlers ====================================================================

  const handleEmailSubmit = async (e: React.FormEvent) => {
    console.log("submitted form")
    e.preventDefault()

    const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!validEmailRegex.test(email)) {
      setValid(false)
      return
    }

    setIsSubmitting(true)

    const data = { email, funcAction: "sendEmail" }
    console.log("data: ", data)
    try {
      const responseData = await sendVerificationEmail(email)
      setEmailSentStatus(responseData.emailSentStatus)
      setSentEmail(responseData.sentEmail)

      setHasSubmitted(true)
    } catch (error) {
      console.error(
        "Error in fetch call to email verification occurred:",
        error
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    // Guard/early return for locked or no email sent status
    if (!emailSentStatus || locked) {
      console.error(
        "No email sent status found, or has been locked from too many attempts."
      )
      toast.error(
        "No email sent status found, or has been locked from too many attempts."
      )
      return
    }

    setVerificationSubmitted(true)
    const data = {
      verifyEmail: sentEmail,
      verificationCode,
      funcAction: "verifyCode",
    }
    try {
      const response = await authrite.request(getBackendUrl("email"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      if (responseData.verificationStatus) {
        await callSignia(responseData)
      } else {
        if (verificationAttempts === 1) {
          setLocked(true)
        }
        setVerificationAttempts(verificationAttempts - 1)
      }

      setSuccessStatus(true)
      navigate("/EmailVerification/VerifyResult/success")
    } catch (error) {
      console.error("Error in handling verification of email code:", error)
      setSuccessStatus(false)
      navigate("/EmailVerification/VerifyResult/error")
    }
  }

  const callSignia = async (data: any) => {
    // Define the data type if possible
    await signia.publiclyRevealAttributes(
      {},
      constants.certifierUrl,
      constants.certifierPublicKey,
      constants.certificateTypes.email,
      true,
      { email: sentEmail, verificationType: "email" },
      async (message: any) => {
        // Define the message type if possible
        console.log("status:", message)
      }
    )
    setSuccessStatus(true)

    if (!successStatus) {
      navigate("/")
    }
  }

  return (
    <div className="container">
      <img
        src={socialCertLogo}
        alt="Social Certification Logo"
        className="main-logo"
      />
      <p className="sub-header-text">
        Certify your identity using your email address
      </p>

      {!hasSubmitted && (
        <>
          <div style={{ textAlign: "center", maxWidth: "25rem" }}>
            <p>We'll send you an email to verify.</p>
          </div>
          <form onSubmit={handleEmailSubmit}>
            <div className="flex-wrap">
              <input
                type="text"
                name="emailField"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                placeholder="janedoe@gmail.com"
                required
              />
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </form>
          {!valid && (
            <b style={{ color: "tomato" }}>A valid email is required</b>
          )}
        </>
      )}

      {/* Text + spinner when the user has submitted their email */}
      {isSubmitting && (
        <>
          <div className="flex" style={{ alignItems: "center" }}>
            <p>Checking verification status...</p>
            <LoadingSpinner />
          </div>
        </>
      )}

      {/* Enter verification page. TODO: This should be its own component-- see src/pages/PhoneVerification/EnterPhoneCode.tsx */}
      {hasSubmitted && (
        <>
          <form onSubmit={handleVerificationSubmit}>
            <div style={{ display: "block", margin: "auto" }}>
              <p>
                Please enter the 6 digit code sent to <b>{email}</b>
              </p>
              <VerifyCodeInput
                onChange={setVerificationCode}
                handleSubmit={handleVerificationSubmit}
              />
            </div>
          </form>
          {verificationSubmitted && locked && (
            <p>You must wait 10 minutes before trying again.</p>
          )}
          {verificationSubmitted && !locked && (
            <p>Remaining attempts until lock out: {verificationAttempts}</p>
          )}

          {verificationSubmitted && (
            <>
              <div className="flex" style={{ alignItems: "center" }}>
                <p>Checking verification code...</p>
                <LoadingSpinner />
              </div>
            </>
          )}

          {verificationSubmitted && (
            <>
              <p style={{ textAlign: "center" }}>
                Haven't received an email in 1-2 mins? <br />
                Make sure your email is correct above, then <br />
                <a
                  className="request-new-code-link"
                  onClick={async () => {
                    try {
                      await sendVerificationEmail(sentEmail)
                      toast.success("A new code has been sent to your email.")
                    } catch (e) {
                      toast.error(
                        `There was an error resending a code to your email: ${e}`
                      )
                    }
                  }}
                >
                  request a new code
                </a>
              </p>
            </>
          )}
        </>
      )}
      {/* <p style={{ margin: "0" }}>Wrong email?</p> */}
      <NavigateButton
        navigatePath="/"
        label="Go back"
        style={{ marginTop: "4rem" }}
      />
    </div>
  )
}

export default EmailVerification
