import { useNavigate, useParams } from "react-router-dom"
import socialCertLogo from "../../assets/images/socialCert.svg"
import socialCertBackground from "../../assets/images/socialCertBackground.png"
import successIcon from "../../assets/images/successIcon.webp"
import errorIcon from "../../assets/images/errorIcon.webp"

interface VerifyResultProps {
  certType: string
}

const VerifyResult = ({ certType }: VerifyResultProps) => {
  const { status } = useParams<{ status: string }>()
  const navigate = useNavigate()

  const getCertNameText = () => {
    switch (certType) {
      case "phone": return "phone number"
      case "email": return "email address"
      case "X": return "X account"
      case "discord": return "Discord account"
      default: return "account"
    }
  }

  const getGoBackPath = () => {
    switch (certType) {
      case "phone": return "/PhoneVerification"
      case "email": return "/EmailVerification"
      case "X": return "/XVerification"
      case "discord": return "/discordVerification"
      default: return "/"
    }
  }

  const isSuccess = status === "success"

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ fontFamily: 'Comfortaa, system-ui, sans-serif' }}>
      {/* Background Image */}
      <img
        src={socialCertBackground}
        alt=""
        className="fixed inset-0 w-full h-full object-cover -z-10"
      />

      <main className="flex flex-col items-center justify-center px-4 py-12 text-center">
        {/* Logo */}
        <img
          src={socialCertLogo}
          alt="SocialCert"
          className="w-[400px] max-w-[80vw] brightness-[100] mb-6"
        />

        {/* Result Icon */}
        <img
          src={isSuccess ? successIcon : errorIcon}
          alt={isSuccess ? "Success" : "Error"}
          className="w-24 h-24 mb-4"
        />

        {/* Title */}
        <h1 className="text-2xl text-white font-bold mb-2">
          {isSuccess ? 'Verification Success!' : 'Failed to Verify.'}
        </h1>

        {/* Message */}
        <p className="text-white mb-6">
          {isSuccess
            ? `Your ${getCertNameText()} certificate has been issued.`
            : `Your ${getCertNameText()} has failed to verify. Please go back and try again.`
          }
        </p>

        {/* Actions */}
        {isSuccess ? (
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 text-white border border-white rounded bg-transparent hover:shadow-[3px_3px_0_white] transition-all"
          >
            Return to Landing Page
          </button>
        ) : (
          <button
            onClick={() => navigate(getGoBackPath())}
            className="px-6 py-2 text-white border border-white rounded bg-transparent hover:shadow-[3px_3px_0_white] transition-all"
          >
            Go back
          </button>
        )}
      </main>
    </div>
  )
}

export default VerifyResult
