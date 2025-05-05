// VerifyResult component
import { useNavigate, useParams } from "react-router-dom"
import errorIcon from "../../assets/images/errorIcon.webp"
import socialCertLogo from "../../assets/images/socialCert.svg"
import successIcon from "../../assets/images/successIcon.webp"

import NavigateButton from "../../components/NavigateButton"
import "./VerifyResult.scss"

/* 
  The success or failure contents are determined by the `status` parameter in the URL (see routes in App.tsx)
  It conditionally renders either the success page or failure page.
  The text on the page is determined by prop `certType: string` passed to the component
*/

interface VerifyResultProps {
  certType: string
}

const VerifyResult = ({ certType }: VerifyResultProps) => {
  const getCertNameText = () => {
    switch (certType) {
      case "phone":
        return "phone number"
      case "email":
        return "email address"
      case "X":
        return "X account"
      case "discord":
        return "Discord account"
    }
  }

  const getGoBackPath = () => {
    switch (certType) {
      case "phone":
        return "/PhoneVerification"
      case "email":
        return "/EmailVerification"
      case "X":
        return "/"
      case "discord":
        return "/"
    }
  }

  // Access url param to determine whether to show success or error elements; see App.tsx route for this page
  const { status } = useParams<{ status: string }>()
  const navigate = useNavigate()

  return (
    <div className="container result-page-container">
      {/* Success page contents */}
      <img src={socialCertLogo} className="main-logo" />
      {status === "success" ? (
        <>
          <img src={successIcon} className="result-icon" />
          <h1>Verification Success!</h1>
          <p>Your {getCertNameText()} certificate has been issued.</p>
          <button
            style={{ background: "transparent" }}
            onClick={() => {
              navigate("/")
            }}
          >
            Return to Landing Page
          </button>
        </>
      ) : (
        // Failure page contents
        <>
          <img src={errorIcon} className="result-icon" />
          <h1>Failed to Verify.</h1>
          <p>
            {/* {getCertNameText() !== "" ? <></> : <></>} */}
            Your {getCertNameText()} has failed to verify. <br />
            Please go back and try again.
          </p>
          <NavigateButton navigatePath={getGoBackPath()} label={"Go back"} />
        </>
      )}
    </div>
  )
}

export default VerifyResult
