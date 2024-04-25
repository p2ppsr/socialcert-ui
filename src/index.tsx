import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import BabbagePrompt from '@babbage/react-prompt'

ReactDOM.render(
  <BabbagePrompt
    // customPrompt
    appName='SocialCert'
    author='Project Babbage'
    authorUrl='https://projectbabbage.com'
    description='Babbage Certified Identity'
    appIcon={{
      mainnet: '/images/socialCertIcon.png',
      testnet: '/images/socialCertIcon.png'
    }}
    appImages={[
      {
        mainnet: '/images/socialCertIcon.png',
        testnet: '/images/socialCertIcon.png'
      }
    ]}
    supportedMetaNet='mainnet'
  >
    <App />
  </BabbagePrompt>,
  document.getElementById('root')
)
