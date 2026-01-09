import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaDiscord } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { IoIosMail } from 'react-icons/io'
import socialCertLogo from '../../assets/images/socialCert.svg'
import socialCertBackground from '../../assets/images/socialCertBackground.png'

const Hero: React.FC = () => {
  const navigate = useNavigate()

  const certificationOptions = [
    {
      id: 'discord',
      name: 'Discord',
      icon: <FaDiscord size={20} />,
      bgColor: 'rgb(51, 73, 189)',
      path: '/discordVerification',
      description: 'Link your Discord username',
    },
    {
      id: 'x',
      name: 'X / Twitter',
      icon: <FaXTwitter size={20} />,
      bgColor: '#000',
      path: '/XVerification',
      description: 'Link your X handle',
    },
    {
      id: 'email',
      name: 'Email',
      icon: <IoIosMail size={20} />,
      bgColor: 'rgb(97, 97, 97)',
      path: '/EmailVerification',
      description: 'Link your email address',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ fontFamily: 'Comfortaa, system-ui, sans-serif' }}>
      {/* Background Image */}
      <img
        src={socialCertBackground}
        alt=""
        className="fixed inset-0 w-full h-full object-cover -z-10"
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-3xl mx-auto">
        {/* Logo */}
        <img
          src={socialCertLogo}
          alt="SocialCert"
          className="w-[500px] max-w-[80vw] brightness-[100] mb-8"
        />

        {/* What is SocialCert - Explanation Box */}
        <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-5 mb-8 max-w-xl text-left">
          <h2 className="text-white text-lg font-semibold mb-3">What is SocialCert?</h2>
          <p className="text-white/80 text-sm leading-relaxed">
            SocialCert creates a <span className="text-white font-medium">verified link</span> between your Metanet identity key and your social accounts
            (like X, Discord, or email). This lets other Metanet users find and communicate with you using the
            social handles they already know — while keeping you in control of your identity.
          </p>
        </div>

        {/* How It Works - 3 Steps */}
        <div className="mb-8 text-center">
          <h3 className="text-white font-semibold mb-4">How it works</h3>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex flex-col items-center max-w-[140px]">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white font-bold mb-2">1</div>
              <p className="text-white font-medium">Choose a Platform</p>
              <p className="text-white/60 text-xs">Select which account to link</p>
            </div>
            <div className="flex flex-col items-center max-w-[140px]">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white font-bold mb-2">2</div>
              <p className="text-white font-medium">Verify Ownership</p>
              <p className="text-white/60 text-xs">Sign in to prove you own it</p>
            </div>
            <div className="flex flex-col items-center max-w-[140px]">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white font-bold mb-2">3</div>
              <p className="text-white font-medium">Get Certified</p>
              <p className="text-white/60 text-xs">Receive a discoverable certificate</p>
            </div>
          </div>
        </div>

        {/* Certification Buttons */}
        <div className="mb-6">
          <h3 className="text-white font-semibold text-center mb-4">Choose your certification</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {certificationOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => navigate(option.path)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-white border border-white rounded transition-all hover:shadow-[3px_3px_0_white] hover:-translate-y-0.5"
                style={{ backgroundColor: option.bgColor, minWidth: '150px' }}
              >
                {option.icon}
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 text-white/50 text-xs mt-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Cryptographically Secured</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>You Control Visibility</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Instant Verification</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-white/40 text-xs">
        <p>Copyright © 2026 Peer-to-peer Privacy Systems Research, LLC</p>
      </footer>
    </div>
  )
}

export default Hero
