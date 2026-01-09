import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getBackendUrl, getBaseUrl } from "../../utils/getBackendUrl"
import getConstants from "../../utils/getConstants"
import { useAsyncEffect } from "use-async-effect"
import { FaXTwitter } from "react-icons/fa6"
import { WalletClient, AuthFetch, IdentityClient } from "@bsv/sdk"
import VerificationLayout from "../../components/Layout/VerificationLayout"
import Button from "../../components/ui/Button"

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
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Processing...");


  // Initialize isChecked from localStorage if it exists, otherwise default to false
  const [isChecked, setIsChecked] = useState<boolean>(() => {
    const savedValue = localStorage.getItem("isChecked");
    return savedValue === null ? true : savedValue === "true";
  });

  // Store isChecked state in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isChecked", isChecked.toString());
    console.log(`Saved to localStorage: ${isChecked}`);
  }, [isChecked]);

  useAsyncEffect(async () => {
    try {
      if (oauthToken && oauthVerifier) {
        setLoadingMessage("Creating your certificate, please check the metanet client...")
        setIsLoading(true)

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

        // Get the current value from localStorage to ensure it's the most up-to-date
        const shouldRevealPublicly = localStorage.getItem("isChecked") === "true";

        if (shouldRevealPublicly) {
          const publicationResult = await new IdentityClient(new WalletClient()).publiclyRevealAttributes(
            newCertificate,
            ['userName', 'profilePhoto'],
          )
        }

        navigate('/XVerification/VerifyResult/success')
      }
    } catch (error) {
      console.error("Error in processing request", error)
      navigate('/XVerification/VerifyResult/error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSignIn = async () => {
    setLoadingMessage("You will be redirected to the X sign-in page shortly...");
    setIsLoading(true);
    try {
      console.log("ON X PAGE")
      // Ensure the current checkbox state is saved before redirecting
      localStorage.setItem("isChecked", isChecked.toString());

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
    } catch (error) {
      setIsLoading(false);
      console.error("Error in processing request", error)
      navigate('/XVerification/VerifyResult/error')
    }
  }

  // Handler to properly update and log checkbox changes
  const handleCheckboxChange = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    console.log(`IS CHECKED STATE changing to: ${newValue}`);
  };

  return (
    <VerificationLayout
      title="X"
      subtitle="Certify your identity using your X account"
      icon={<FaXTwitter />}
      iconBgColor="#000"
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-3 py-6">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-white">{loadingMessage}</span>
        </div>
      ) : (
        <>
          <button
            onClick={handleSignIn}
            className="flex items-center justify-center gap-2 w-full px-5 py-3 text-white font-semibold border border-white rounded transition-all hover:shadow-[3px_3px_0_white] hover:-translate-y-0.5 mb-4 bg-black"
          >
            Sign in with X
          </button>

          <div className="flex items-center gap-2 text-white text-sm">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="w-4 h-4 accent-[#00ff9f]"
            />
            <label>Publicly reveal attributes of issued certificates</label>
          </div>
        </>
      )}
    </VerificationLayout>
  )
}

export default XVerification