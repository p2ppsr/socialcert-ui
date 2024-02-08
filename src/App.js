import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Register from './pages'
import Auth from './pages/Auth';
import AuthRedirect from './pages/AuthRedirect';

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
            <Routes>
              <Route exact path='/' element={<Register />} />
               <Route exact path='/Auth' element={<Auth/>}/>
               <Route path="/AuthRedirect" element={<AuthRedirect />} />
            </Routes>
          </div>
        </Router>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App
