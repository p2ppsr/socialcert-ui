import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Register from './pages'
import AuthRedirect from './pages/AuthRedirect';
import PhoneRedirect from './pages/PhoneRedirect';
import './App.scss'

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
    h1: {
      color:'blue'
    },
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
            <Routes>
              <Route exact path='/' element={<Register />} />
               <Route path="/AuthRedirect" element={<AuthRedirect />} />
               <Route path="/PhoneRedirect" element={<PhoneRedirect />} />
            </Routes>
          </div>
        </Router>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App
