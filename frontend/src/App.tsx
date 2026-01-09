import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Hero from "./components/Landing/Hero"
import DiscordVerification from "./pages/discordVerification"
import EmailVerification from "./pages/EmailVerification/EmailVerification"
import XVerification from "./pages/XVerification/XVerification"
import EnterPhoneCode from './pages/phoneVerification/EnterPhoneCode/EnterPhoneCode'
import VerifyResult from "./pages/VerifyResult/VerifyResult"
import PhoneVerification from "./pages/phoneVerification/phoneVerification"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { checkForMetaNetClient, NoMncModal } from 'metanet-react-prompt'
import useAsyncEffect from 'use-async-effect'
import React, { useState } from 'react'



const App = () => {
  const [isMncMissing, setIsMncMissing] = useState<boolean>(false)

  useAsyncEffect(async () => {
    const intervalId = setInterval(async () => {
      const hasMNC = await checkForMetaNetClient()
      if (hasMNC === 0) {
        setIsMncMissing(true) // Open modal if MNC is not found
      } else {
        clearInterval(intervalId)
        setIsMncMissing(false) // Ensure modal is closed if MNC is found
      }
    }, 250)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <Router>
      <NoMncModal appName={'SocialCert'} open={isMncMissing} onClose={() => setIsMncMissing(false)} />
      <ToastContainer
        position="top-center"
        containerId="alertToast"
        autoClose={5000}
        theme="dark"
      />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/discordVerification" element={<DiscordVerification />} />
        <Route path="/DiscordVerification/VerifyResults/:status" element={<VerifyResult certType="discord" />} />
        <Route path="/PhoneVerification" element={<PhoneVerification />} />
        <Route path="/PhoneVerification/EnterPhoneCode" element={<EnterPhoneCode />} />
        <Route path="/PhoneVerification/VerifyResult/:status" element={<VerifyResult certType={"phone"} />} />
        <Route path="/EmailVerification" element={<EmailVerification />} />
        <Route path="/EmailVerification/VerifyResult/:status" element={<VerifyResult certType={"email"} />} />
        <Route path="/XVerification" element={<XVerification />} />
        <Route path="/XVerification/VerifyResult/:status" element={<VerifyResult certType={"X"} />} />
      </Routes>
    </Router>
  )
}

export default App
