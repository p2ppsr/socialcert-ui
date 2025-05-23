import socialCertLogo from "../../../assets/images/socialCert.svg"
import GoBackButton from "../../../components/NavigateButton"
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner"
import { Signia } from "babbage-signia"
import getConstants from "../../../utils/getConstants"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { usePhoneStore } from "../../../stores/stores"
import { Authrite } from "authrite-js"
import { getBackendUrl } from "../../../utils/getBackendUrl"
import { formatPhoneNumber } from "react-phone-number-input"

import "./EnterPhoneCode.scss"
import NavigateButton from "../../../components/NavigateButton"
import { sendVerificationText } from "../utils/phoneUtils"
import { toast } from "react-toastify"

// TODO: Correct response type should be updated in Signia
interface SigniaResponse {
  status?: string
  description?: string
  code?: string
}

const EnterPhoneCode = () => {
  // Constructors ============================================================
  const constants = getConstants()
  const signia = new Signia()
  signia.config.confederacyHost = constants.confederacyUrl
  const navigate = useNavigate()
  const authrite = new Authrite()

  // State ===================================================================
  const [successStatus, setSuccessStatus] = useState(false)
  const [verificationAttempts, setVerificationAttempts] = useState(5)
  const [locked, setLocked] = useState(false)
  const [verificationSubmitted, setVerificationSubmitted] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")

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

  // Handlers ================================================================

  const callSignia: (data: SigniaData) => Promise<void> = async (data) => {
    const response: SigniaResponse = await signia.publiclyRevealAttributes(
      {},
      constants.certifierUrl,
      constants.certifierPublicKey,
      constants.certificateTypes.phone,
      true,
      {
        phoneNumber: data.verifiedPhonenumber,
        verificationType: "phoneNumber",
      },
      async (message: any) => {
        // Process message here if necessary
      }
    )

    // Check if any HTTP errors were thrown
    if (response.status === 'error') {
      throw new Error(response.description)
    }

    setSuccessStatus(true)

    if (!successStatus) {
      navigate("/")
    }
  }

  useEffect(() => {
    console.log(
      "text sent status: ",
      textSentStatus,
      "locked: ",
      locked,
      textSentPhonenumber
    )
  }, [textSentStatus, locked])

  const handleVerificationSubmit = async (): // e: React.FormEvent<HTMLFormElement>
    Promise<void> => {
    if (textSentStatus === false || locked === true) {
      console.error("Error: Number is locked or text has not been sent")
    }

    setVerificationSubmitted(true)
    const data: VerificationData = {
      phoneNumber: textSentPhonenumber,
      verificationCode,
      funcAction: "verifyCode",
    }

    try {
      const response = await authrite.request(getBackendUrl("phone"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData: VerificationResponse = await response.json()

      if (responseData.verificationStatus && responseData.verifiedPhonenumber) {
        const signiaResponse = await callSignia({
          verifiedPhonenumber: responseData.verifiedPhonenumber,
        }) // Pass as SigniaData
      } else {
        if (verificationAttempts === 1) {
          setLocked(true)
        }
        setVerificationAttempts(verificationAttempts - 1)
      }

      // Verification has succeeded, navigate to result page with success params
      navigate("/PhoneVerification/VerifyResult/success")
    } catch (error) {
      console.error("Error in handling verification of text code", error)
      // Verification failed, navigate to result page with error params
      navigate("/PhoneVerification/VerifyResult/error")
    }
  }

  // Effects =============================================================

  // Optional: Return user to phone verification if they end up in this component with no phone number provided
  // useEffect(() => {
  //   if (!textSentPhonenumber) {
  //     navigate("/PhoneVerification")
  //   }
  // }, [textSentPhonenumber])

  // Max attempts locking logic
  const unlockMinutes = 10
  useEffect(() => {
    if (locked) {
      setTimeout(() => {
        setLocked(false)
        setVerificationAttempts(5)
      }, unlockMinutes * 60000)
    }
  }, [locked])

  return (
    <div className="container">
      <img src={socialCertLogo} className="main-logo" />
      <p className="sub-header-text">Check Your Texts</p>
      <p>
        Please enter the code we just sent to{" "}
        <b>{formatPhoneNumber(textSentPhonenumber)}</b>
      </p>

      <div className="flex-wrap" style={{ marginBottom: ".5rem" }}>
        <div className="code-input-container">
          <div style={{ transform: "translateY(.25rem)" }}>
            <input
              maxLength={6}
              placeholder="xxxxxx"
              onChange={(e) => {
                setVerificationCode(e.target.value)
              }}
            />
            <div className="code-input-underline" />
          </div>
        </div>
        <button
          className="submit-button"
          style={{ width: "8rem", alignSelf: "center" }}
          onClick={async () => {
            await handleVerificationSubmit()
          }}
        >
          Verify
        </button>
      </div>

      {verificationSubmitted && (
        <>
          <div className="flex" style={{ alignItems: "center" }}>
            <p>Checking verification code...</p>
            <LoadingSpinner />
          </div>
        </>
      )}

      <p style={{ textAlign: "center" }}>
        Haven't received a text in 1-2 mins? <br />
        Make sure your number is correct above, then <br />
        <a
          className="request-new-code-link"
          onClick={async () => {
            try {
              await sendVerificationText(textSentPhonenumber)
              toast.success('A new code has been sent to your phone.')
            } catch (e) {
              toast.error(`There was an error resending a code to your phone: ${e}`)
            }
          }}
        >
          request a new code
        </a>
      </p>

      <p style={{ margin: "0" }}>Wrong number?</p>

      <NavigateButton
        navigatePath="/PhoneVerification"
        style={{ marginTop: "1rem" }}
        label={"Go back"}
      />
    </div>
  )
}

export default EnterPhoneCode
