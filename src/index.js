import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import BabbagePrompt from '@babbage/react-prompt'

ReactDOM.render(
  <BabbagePrompt
    customPrompt
    appName='DiscordCert'
    author='Project Babbage'
    authorUrl='https://projectbabbage.com'
    description='Babbage Certified Identity'
    appIcon='/images/identiCertIcon.png'
    appImages={[
      '/images/startPage.png'
    ]}
    supportedMetaNet='testnet'
  >
    <App />
  </BabbagePrompt>,
  document.getElementById('root')
)
