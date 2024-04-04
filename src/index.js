import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import BabbagePrompt from '@babbage/react-prompt'

ReactDOM.render(
  <BabbagePrompt
    customPrompt
    appName='SocialCert'
    author='Project Babbage'
    authorUrl='https://projectbabbage.com'
    description='Babbage Certified Identity'
    appIcon='/images/socialCertIcon.png'
    appImages={[
      '/images/startPage.png'
    ]}
    supportedMetaNet='mainnet'
  >
    <App />
  </BabbagePrompt>,
  document.getElementById('root')
)
