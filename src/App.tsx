import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.scss'
import socialCertBackgroundImage from './assets/images/socialCertBackground.png'
import DiscordVerification from './pages/DiscordVerification'
import EmailVerification from './pages/EmailVerification'
import EnterPhoneCode from "./pages/PhoneVerification/EnterPhoneCode/EnterPhoneCode"
import PhoneVerification from './pages/PhoneVerification/PhoneVerification'
import Register from './pages/Register'
import XVerification from './pages/XVerification'

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
