// VerifyResult component
import { useNavigate, useParams } from "react-router-dom"
import errorIcon from "../../../assets/images/errorIcon.webp"
import socialCertLogo from "../../../assets/images/socialCert.svg"
import successIcon from "../../../assets/images/successIcon.webp"

import NavigateButton from "../../../components/NavigateButton"
import "./VerifyResult.scss"

/* 
  The page contents are determined by the `status` parameter in the URL. 
  It conditionally renders either the success page or failure page
*/

const VerifyResult = () => {
  // Access url param to determine whether to show success or error elements; see App.tsx route for this page
  const { status } = useParams<{ status: string }>()
  const navigate = useNavigate()

  return (
    <div className="container result-page-container">
      {/* // Success page contents */}
      <img src={socialCertLogo} className="main-logo" />
      {status === "success" ? (
        <>
          <img src={successIcon} className="result-icon" />
          <h1>Verification Success!</h1>
          <p>Your phone number certificate has been issued.</p>
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
            Your phone number has failed to verify. <br />
            Please go back and try again.
          </p>
          <NavigateButton
            navigatePath={"/PhoneVerification"}
            label={"Go back"}
          />
        </>
      )}
    </div>
  )
}

export default VerifyResult
