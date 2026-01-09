import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoIosMail } from "react-icons/io"
import VerificationLayout from "../../components/Layout/VerificationLayout"
import Button from "../../components/ui/Button"
import VerifyCodeInput from "../../components/VerifyCodeInput/VerifyCodeInput"
import { sendVerificationEmail, acquireEmailCertificate } from "./utils/emailUtils"
import { toast } from "react-toastify"
import { WalletClient, AuthFetch, IdentityClient } from "@bsv/sdk"

const EmailVerification = () => {
  const navigate = useNavigate()

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
  const [isChecked, setIsChecked] = useState(true)

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
    e.preventDefault()

    const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!validEmailRegex.test(email)) {
      setValid(false)
      toast.error("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    const data = { email, funcAction: "sendEmail" }
    try {
      const responseData = await sendVerificationEmail(email)
      setEmailSentStatus(responseData.emailSentStatus)
      setSentEmail(responseData.sentEmail)
      if (responseData?.emailSentStatus) {
        toast.success(`Verification email sent to ${responseData.sentEmail || email}`)
        setHasSubmitted(true)
      } else {
        toast.error("Request succeeded, but the server did not confirm sending an email. Please try again.")
      }
    } catch (error) {
      toast.error('Unable to send verification email. Please try again.')
      setIsSubmitting(false)
      return
    }
    setIsSubmitting(false)
  }

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    // Guard/early return for locked or no email sent status
    if (!emailSentStatus || locked) {
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
      const clientWallet = new WalletClient("auto")
      let AF = await new AuthFetch(clientWallet)
      const response = await AF.fetch('https://backend.socialcert.net/handleEmailVerification', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      if (responseData.verificationStatus) {
        try {
          const newCertificate = await acquireEmailCertificate(responseData.certType, data.verifyEmail)
          if (isChecked) {
            const publicationResult = await new IdentityClient(clientWallet).publiclyRevealAttributes(
              newCertificate,
              ['email'],
            )
          }
        } catch (certError) {
          toast.warn('Code verified, but certificate issuance/publication failed. You can retry later.')
        }
        toast.success("Code verified")
        navigate("/EmailVerification/VerifyResult/success")
      } else {
        if (verificationAttempts === 1) {
          setLocked(true)
          toast.error("Too many attempts. Locked for 10 minutes.")
        }
        const nextAttempts = verificationAttempts - 1
        setVerificationAttempts(nextAttempts)
        if (nextAttempts >= 0) {
          toast.error(`Invalid code. Attempts left: ${nextAttempts}`)
        }
      }

      setSuccessStatus(true)
      if (!successStatus) {
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.')
      setSuccessStatus(false)
      navigate("/EmailVerification/VerifyResult/error")
    }
  }

  return (
    <VerificationLayout
      title="Email"
      subtitle="Certify your identity using your email address"
      icon={<IoIosMail />}
      iconBgColor="rgb(97, 97, 97)"
    >
      {!hasSubmitted ? (
        <>
          <p className="text-white text-center mb-4">We'll send you an email to verify.</p>

          <form onSubmit={handleEmailSubmit} className="flex flex-wrap justify-center gap-3 mb-4">
            <input
              type="email"
              name="emailField"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 bg-white/10 border-none rounded text-white placeholder-white/50"
              placeholder="janedoe@email.com"
              autoComplete="email"
              inputMode="email"
              enterKeyHint="send"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="px-4 py-2 bg-[rgb(49,147,83)] text-white border border-white rounded transition-all hover:shadow-[3px_3px_0_white] disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : '→ Send code'}
            </button>
          </form>

          {!valid && (
            <p className="text-red-400 text-sm text-center mb-4">A valid email is required</p>
          )}

          <div className="flex items-center gap-2 text-white text-sm">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              className="w-4 h-4 accent-[#00ff9f]"
            />
            <label>Publicly reveal attributes of issued certificates</label>
          </div>
        </>
      ) : (
        <>
          <p className="text-white text-center mb-4">
            Please enter the 6 digit code sent to <strong>{email}</strong>
          </p>

          <form onSubmit={handleVerificationSubmit}>
            <VerifyCodeInput
              onChange={setVerificationCode}
              handleSubmit={handleVerificationSubmit}
            />
          </form>

          {verificationSubmitted && (
            <div className="flex items-center justify-center gap-3 py-4">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-white">Checking verification code...</span>
            </div>
          )}

          {locked && (
            <p className="text-white text-center mt-4">You must wait 10 minutes before trying again.</p>
          )}

          {!locked && verificationAttempts < 5 && (
            <p className="text-white text-center mt-4">Remaining attempts until lock out: {verificationAttempts}</p>
          )}

          <p className="text-white text-center mt-6 text-sm">
            Haven't received an email in 1-2 mins?<br />
            Make sure your email is correct above, then{' '}
            <a
              className="text-[rgb(114,159,255)] underline cursor-pointer"
              onClick={async () => {
                try {
                  await sendVerificationEmail(sentEmail)
                  toast.success("A new code has been sent to your email.")
                } catch (e) {
                  toast.error(`Error resending code: ${e}`)
                }
              }}
            >
              request a new code
            </a>
          </p>
        </>
      )}
    </VerificationLayout>
  )
}

export default EmailVerification
