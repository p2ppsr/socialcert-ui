import React from 'react'
import { useNavigate } from 'react-router-dom'
import socialCertLogo from '../../assets/images/socialCert.svg'
import socialCertBackground from '../../assets/images/socialCertBackground.png'

interface VerificationLayoutProps {
  title: string
  subtitle?: string
  icon: React.ReactNode
  iconBgColor: string
  children: React.ReactNode
  showBack?: boolean
}

const VerificationLayout: React.FC<VerificationLayoutProps> = ({
  title,
  subtitle,
  icon,
  iconBgColor,
  children,
  showBack = true
}) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ fontFamily: 'Comfortaa, system-ui, sans-serif' }}>
      {/* Background Image */}
      <img
        src={socialCertBackground}
        alt=""
        className="fixed inset-0 w-full h-full object-cover -z-10"
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 w-full">
        {/* Logo */}
        <img
          src={socialCertLogo}
          alt="SocialCert"
          className="w-[400px] max-w-[80vw] brightness-[100] mb-4"
        />

        {/* Subtitle */}
        <p className="text-white text-lg font-semibold mb-6">
          {subtitle || `Certify your identity using ${title.toLowerCase()}`}
        </p>

        {/* Content Card */}
        <div className="w-full max-w-md">
          {children}
        </div>

        {/* Back Button */}
        {showBack && (
          <button
            onClick={() => navigate('/')}
            className="mt-8 px-4 py-2 text-white/70 hover:text-white border border-white/30 hover:border-white rounded transition-all text-sm"
          >
            ← Go back
          </button>
        )}
      </main>
    </div>
  )
}

export default VerificationLayout
