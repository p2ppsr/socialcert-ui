import { Authrite } from "authrite-js"
import { Signia } from "babbage-signia"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getBackendUrl } from "../../utils/getBackendUrl"
import getConstants from "../../utils/getConstants"
import { useAsyncEffect } from "use-async-effect"
import socialCertLogo from "../../assets/images/socialCert.svg"
import NavigateButton from "../../components/NavigateButton"
import { FaXTwitter } from "react-icons/fa6"

const XVerification = () => {
  // Constructors ============================================================
  const constants = getConstants()
  const authrite = new Authrite()
  const signia = new Signia()
  signia.config.confederacyHost = constants.confederacyUrl
  const hostname = window.location.hostname
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(window.location.search)
  const oauthToken = queryParams.get("oauth_token")
  const oauthVerifier = queryParams.get("oauth_verifier")

  // State ==================================================================
  const [status, setStatus] = useState("")

  useAsyncEffect(async () => {
    try {
      if (oauthToken && oauthVerifier) {
        const data = { oauthToken, oauthVerifier, funcAction: "getUserInfo" }

        const response = await authrite.request(getBackendUrl("X"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        const userData = await response.json()

        await signia.publiclyRevealAttributes(
          {},
          constants.certifierUrl,
          constants.certifierPublicKey,
          constants.certificateTypes.x,
          true,
          {
            XData: {
              userName: userData.userName,
              profilePhoto: userData.profilePhoto,
            },
            verificationType: "X",
          },
          async (message) => {
            setStatus(message)
          }
        )
        navigate("/")
      } else {
        const data = { funcAction: "makeRequest", hostURL: hostname }
        const response = await authrite.request(getBackendUrl("X"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        const requestTokenData = await response.json()
        window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${requestTokenData.requestToken}`
      }
      navigate('/XVerification/VerifyResult/success')
    } catch (error) {
      console.error("Error in processing authrite request", error)
      // Optionally, navigate to a failure page or handle the error specifically
      navigate('/XVerification/VerifyResult/error')
    }
  }, [])

  return (
    <div className="container">
      <img src={socialCertLogo} className="main-logo" />
      <p className="sub-header-text">
        Certify your identity using your{" "}
        <FaXTwitter style={{ transform: "translateY(.25rem)" }} /> account
      </p>

      <NavigateButton navigatePath="/" label={"Go back"} style={{marginTop:'1rem'}}/>
    </div>
  )
}

export default XVerification
