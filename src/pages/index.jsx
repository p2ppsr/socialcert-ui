import React, { useState } from 'react'
import useStyles from './register-style'
import Verify from '../components/Verify'
import {
  Container, Typography, Grid, Paper, Button, LinearProgress
} from '@mui/material'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { useNavigate  } from 'react-router-dom';



const Register = () => {
  const navigate  = useNavigate();
  const classes = useStyles()
  const [success, setSuccess] = useState(false)
  const [openVerify, setOpenVerify] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState('')
  const [inquiryId, setInquiryId] = useState('')
  const [loading, setLoading] = useState(false)
  const [progressStatus, setProgressStatus] = useState('')


  const handleDiscordClick = async () => {
    const hostname = window.location.hostname;

    if(hostname.includes("staging")){
        return window.location.href = "https://discord.com/oauth2/authorize?client_id=1202716017055375421&response_type=code&redirect_uri=https%3A%2F%2Fstaging.socialcert.net%2Fauthredirect&scope=identify"
    }

    else if(hostname.includes("localhost")){
        return window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1202716017055375421&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8088%2FAuthRedirect&scope=identify"
    }

    else{
       return window.location.href = "https://discord.com/oauth2/authorize?client_id=1202716017055375421&response_type=code&redirect_uri=https%3A%2F%2Fsocialcert.net%2Fauthredirect&scope=identify"
    }
  }

  const handlePhoneClick = async() =>{
    console.log("Inside handlePhoneClick")
    navigate('/PhoneRedirect')

  }

  return (
    <div className={classes.background}>
      <header>   
        <Grid item container justify="flex-end" className={classes.title}>
            <img src='images/socialCertBanner.png' className={classes.logo}  />
        </Grid>
      </header>
      <Container
        sx={{
          display: 'grid',
          gridTemplateColumns: '0.3fr auto 0.3fr'
        }}
      >
        <Grid
          container direction='column' sx={{
            display: 'grid',
            gridColumn: '2',
            textAlign: 'center'
          }}
        >
          <Verify
            openVerify={openVerify}
            setOpenVerify={setOpenVerify}
            setVerifyStatus={setVerifyStatus}
            setLoading={setLoading}
            setInquiryId={setInquiryId}
            setSuccess={setSuccess}
            setProgressStatus={setProgressStatus}
          />
       
          {/* <Grid item className={classes.title}>
            <Typography variant='h1'>
              Who Are You?
            </Typography>
          </Grid> */}
          <ToastContainer />
          {loading
            ? <div>
              <Typography>{progressStatus}</Typography>
              <LinearProgress color='secondary' />
              </div>
            : (
              <Grid item container className={classes.form}>
                {success
                  ? (
                    <Paper
                      elevation={0} sx={{
                        display: 'grid',
                        width: '-webkit-fill-available',
                        alignItems: 'center',
                        height: '26em'
                      }}
                    >
                      <Grid item justifyContent='center'>
                        <Typography variant='h7'>
                          Successfully registered! 🎉
                        </Typography>
                      </Grid>
                    </Paper>
                    )
                  : (
                    <Paper
                      elevation={0} sx={{
                        display: 'grid',
                        width: '-webkit-fill-available',
                        alignItems: 'center',
                        height: '26em',
                        backgroundColor: 'transparent'
                      }}
                    >
                      <Grid item container direction='column' align='center' padding='5px'>
                        <Grid
                          item container sx={{
                            justifyContent: 'center'
                          }}
                        >
                          <Grid item>
                            {/* <p>Temporarily Disabled</p> */}
                            
                            {/*Temoorarily Disabled 
                             <Button variant='contained' size='large' color='secondary' onClick={handlePhoneClick}
                            style={{
                              color: 'white',
                              backgroundColor: 	'red', 
                              borderRadius: '12px'}}
                            
                            > 
                              
                              Certify Phone Number
                               </Button> */}
                          <Button variant='contained' size='large' color='secondary' onClick={handleDiscordClick} 
                          startIcon={<img src="images/discordLogo.png" style={{ width: "1.2em", height: ".95em" }}/> }   
                          style={{
                          color: 'white',
                          backgroundColor: 	"#7289da", 
                          borderRadius: '12px'}} // or '50%' for a circle
                          //style={{ color: 'white' }}
                          >
                          
                              Certify Discord Account
                            </Button> 
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                    )}
              </Grid>
              )}
        </Grid>
      </Container>
    </div>
  )
}

export default Register
