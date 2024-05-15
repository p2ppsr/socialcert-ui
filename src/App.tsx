import React, { useState } from 'react'
import { Container } from '@mui/material'
import useAsyncEffect from 'use-async-effect'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.scss'
import socialCertBackgroundImage from './assets/images/socialCertBackground.png'
import DiscordVerification from './pages/discordVerification'
import EmailVerification from './pages/EmailVerification/EmailVerification'
import Register from './pages/Register'
import XVerification from './pages/XVerification/XVerification'
import EnterPhoneCode from './pages/phoneVerification/EnterPhoneCode/EnterPhoneCode'
import VerifyResult from './pages/VerifyResult/VerifyResult'
import PhoneVerification from './pages/phoneVerification/phoneVerification'
import { ToastContainer } from 'react-toastify'
import NoMncModal from './components/NoMncModal/NoMncModal'
import checkForMetaNetClient from './utils/checkForMetaNetClient'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1E1E1E'
    },
    secondary: {
      main: '#FFFFFF'
    }
  },
  typography: {
    button: {
      textTransform: 'none'
    }
  }
})

const App: React.FC = () => {
const [isMncMissing, setIsMncMissing] = useState(false)
const [showModal, setShowModal] = useState(false);

  useAsyncEffect(async () => {
    const intervalId = setInterval(async () => {
      const hasMNC = await checkForMetaNetClient()
      if (hasMNC === 0) {
        setIsMncMissing(true)
      } else {
        setIsMncMissing(false)
      }
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])


  return (
  <Container maxWidth='sm' className='theme'>
    {isMncMissing && (
        <NoMncModal open={true} onClose={() => setShowModal(false)} />
      )}
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Router>
          <div>
            <ToastContainer
              position='top-center'
              containerId='alertToast'
              autoClose={5000}
            />
            <img src={socialCertBackgroundImage} id='background-image' />
            <Routes>
              <Route path='/' element={<Register />} />
              <Route
                path='/DiscordVerification'
                element={<DiscordVerification />}
              />
              <Route
                path='/PhoneVerification'
                element={<PhoneVerification />}
              />
              <Route
                path='/PhoneVerification/EnterPhoneCode'
                element={<EnterPhoneCode />}
              />
              <Route
                path='/PhoneVerification/VerifyResult/:status'
                element={<VerifyResult certType='phone' />}
              />
              <Route
                path='/EmailVerification'
                element={<EmailVerification />}
              />
              <Route
                path='/EmailVerification/VerifyResult/:status'
                element={<VerifyResult certType='email' />}
              />
              <Route path='/XVerification' element={<XVerification />} />
              <Route path='/XVerification/VerifyResult/:status' element={<VerifyResult certType='X' />} />
            </Routes>
          </div>
        </Router>
      </CssBaseline>
    </ThemeProvider>
</Container>
  )
}

export default App
