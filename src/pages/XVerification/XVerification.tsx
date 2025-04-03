import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getBackendUrl, getBaseUrl } from "../../utils/getBackendUrl"
import getConstants from "../../utils/getConstants"
import { useAsyncEffect } from "use-async-effect"
import socialCertLogo from "../../assets/images/socialCert.svg"
import NavigateButton from "../../components/NavigateButton"
import { FaXTwitter } from "react-icons/fa6"
import { WalletClient, AuthFetch, AcquireCertificateResult, IdentityClient } from "@bsv/sdk"


const clientWallet = new WalletClient('json-api', 'localhost')


const XVerification = () => {
  // Constructors ============================================================
  const constants = getConstants()
  const hostname = window.location.hostname
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(window.location.search)
  const oauthToken = queryParams.get("oauth_token")
  const oauthVerifier = queryParams.get("oauth_verifier")

  // State ==================================================================
  const [status, setStatus] = useState("")

  useAsyncEffect(async () => {
    try {
      console.log("ON X PAGE")
      if (oauthToken && oauthVerifier) {
      console.log("IN GET USER INFO")

        const data = { oauthToken, oauthVerifier, funcAction: "getUserInfo" }

        const response = await new AuthFetch(clientWallet).fetch(getBackendUrl("X"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        const userData = await response.json()
        const newCertificate = await clientWallet.acquireCertificate({
            certifier: '02cf6cdf466951d8dfc9e7c9367511d0007ed6fba35ed42d425cc412fd6cfd4a17',
            certifierUrl: getBaseUrl(),
            type: 'vdDWvftf1H+5+ZprUw123kjHlywH+v20aPQTuXgMpNc=',
            acquisitionProtocol: 'issuance',
            fields: {
              userName: userData.userName,
              profilePhoto: userData.profilePhoto,
            }
          })

          const publicationResult = await new IdentityClient(new WalletClient()).publiclyRevealAttributes(
                    newCertificate,
                    ['userName', 'profilePhoto'],
                  )
                  console.log('PUBLIC REVELATION RESULT:', publicationResult)
     
        navigate("/")
      } else {
        const data = { funcAction: "makeRequest", hostURL: hostname }
        const response = await new AuthFetch(clientWallet).fetch(getBackendUrl("X"), {
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
