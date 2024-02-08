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


  const handleVerifyClick = async () => {
    // res.send("discord.com/authorizaion_url")
 
    navigate('/Auth')
   //Auth()
    setLoading(true)
    // send token from discord to backend 
    //setOpenVerify(true)
    console.log(verifyStatus)
    console.log(inquiryId)
  }

  return (
    <div className={classes.background}>
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
          <Grid item className={classes.title}>
            <img src='images/discordLogo.png' className={classes.logo} />
          </Grid>
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
                      <Grid item container direction='column' align='center'>
                        <Grid
                          item container sx={{
                            justifyContent: 'center'
                          }}
                        >
                          <Grid item>
                            {/* <p>Temporarily Disabled</p> */}
                          <Button variant='contained' size='large' color='secondary' onClick={handleVerifyClick} startIcon={<VerifiedUserIcon />}>
                              Verify Identity
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
