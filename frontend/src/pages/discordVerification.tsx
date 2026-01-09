import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import getConstants from '../utils/getConstants'
import { WalletClient, AuthFetch, IdentityClient } from "@bsv/sdk"
import { useAsyncEffect } from "use-async-effect"
import { getBackendUrl, getBaseUrl } from "../utils/getBackendUrl"
import { FaDiscord } from "react-icons/fa"
import VerificationLayout from "../components/Layout/VerificationLayout"
import Button from "../components/ui/Button"

const clientWallet = new WalletClient('json-api', 'localhost')

const DiscordVerification = () => {
  const constants = getConstants()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Processing...");


  const [isChecked, setIsChecked] = useState<boolean>(() => {
    const savedValue = localStorage.getItem("isChecked");
    return savedValue === null ? true : savedValue === "true";
  });

  useEffect(() => {
    localStorage.setItem("isChecked", isChecked.toString());
    console.log(`Saved to localStorage: ${isChecked}`);
  }, [isChecked]);

  useAsyncEffect(async () => {
    const params = new URLSearchParams(window.location.search)
    const accessCode = params.get('code');
    try {
      if (accessCode) {
        setLoadingMessage("Creating your certificate, please check the metanet client...")
        setIsLoading(true)
        const data = { accessCode, funcAction: "getDiscordData" }

        const response = await new AuthFetch(clientWallet).fetch(getBackendUrl("discord"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        const userData = await response.json()
        console.log(`user data ${userData}`);
        console.log(userData.userName);
        console.log(userData.profilePhoto);

        const newCertificate = await clientWallet.acquireCertificate({
          certifier: '02cf6cdf466951d8dfc9e7c9367511d0007ed6fba35ed42d425cc412fd6cfd4a17',
          certifierUrl: getBaseUrl(),
          type: '2TgqRC35B1zehGmB21xveZNc7i5iqHc0uxMb+1NMPW4=',
          acquisitionProtocol: 'issuance',
          fields: {
            userName: userData.userName,
            profilePhoto: userData.profilePhoto,
          }
        })

        const shouldRevealPublicly = localStorage.getItem("isChecked") === "true";

        if (shouldRevealPublicly) {
          console.log('INSIDE IF STATEMENT')
          const publicationResult = await new IdentityClient(new WalletClient()).publiclyRevealAttributes(
            newCertificate,
            ['userName', 'profilePhoto'],
          )
        }

        navigate('/DiscordVerification/VerifyResults/success')

      }
    } catch (error) {
      console.error("Error in processing request", error)
      navigate('/DiscordVerification/VerifyResults/error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSignIn = async () => {
    const hostname = window.location.hostname

    if (hostname.includes("staging")) {
      return (window.location.href =
        "https://discord.com/oauth2/authorize?client_id=1202716017055375421&response_type=code&redirect_uri=https%3A%2F%2Fstaging.socialcert.net%2FdiscordVerification&scope=identify")
    } else if (hostname.includes("localhost")) {
      return (window.location.href =
        "https://discord.com/oauth2/authorize?client_id=1202716017055375421&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8088%2FdiscordVerification&scope=identify")
    } else {
      return (window.location.href =
        "https://discord.com/oauth2/authorize?client_id=1202716017055375421&response_type=code&redirect_uri=https%3A%2F%2Fsocialcert.net%2FdiscordVerification&scope=identify")
    }
  }

  const handleCheckboxChange = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    console.log(`IS CHECKED STATE changing to: ${newValue}`);
  };

  return (
    <VerificationLayout
      title="Discord"
      subtitle="Certify your identity using your Discord account"
      icon={<FaDiscord />}
      iconBgColor="rgb(51, 73, 189)"
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
            className="flex items-center justify-center gap-2 w-full px-5 py-3 text-white font-semibold border border-white rounded transition-all hover:shadow-[3px_3px_0_white] hover:-translate-y-0.5 mb-4"
            style={{ backgroundColor: 'rgb(51, 73, 189)' }}
          >
            Sign in with <FaDiscord size={20} />
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

export default DiscordVerification
