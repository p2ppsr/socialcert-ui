import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.scss'
import socialCertBackgroundImage from './assets/images/socialCertBackground.png'
import DiscordVerification from './pages/discordVerification'
import EmailVerification from './pages/emailVerification'
import Register from './pages/Register'
import XVerification from './pages/XVerification'
import EnterPhoneCode from './pages/phoneVerification/EnterPhoneCode/EnterPhoneCode'
import VerifyResult from './pages/phoneVerification/VerifyResult/VerifyResult'
import PhoneVerification from './pages/phoneVerification/phoneVerification'

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

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Router>
          <div>
            <img src={socialCertBackgroundImage} id='background-image' />
            <Routes>
              <Route path='/' element={<Register />} />
              <Route path='/DiscordVerification' element={<DiscordVerification />} />
              <Route path='/PhoneVerification' element={<PhoneVerification />} />
              <Route path='/PhoneVerification/EnterPhoneCode' element={<EnterPhoneCode />} />
              <Route path='/PhoneVerification/VerifyResult/:status' element={<VerifyResult />} />
              <Route path='/XVerification' element={<XVerification />} />
              <Route path='/EmailVerification' element={<EmailVerification />} />
            </Routes>
          </div>
        </Router>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App
