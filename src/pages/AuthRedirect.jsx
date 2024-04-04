import React, { useEffect, useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import getConstants from '../components/utils/getConstants';
import { Dialog } from '@mui/material'
import { Signia } from 'babbage-signia'
import { toast } from 'react-toastify'
import { Redirect } from 'react-router-dom';
import useStyles from './register-style'






const AuthRedirect = () =>{
  console.log("Inside AuthRedirect")
  const [progressStatus, setProgressStatus] = useState("")
  const [successStatus, setSuccessStatus] = useState(false)
  const constants = getConstants()
  const navigate  = useNavigate();
  const classes = useStyles()
  const signia = new Signia()
  signia.config.confederacyHost = constants.confederacyUrl

    useEffect(() =>{
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        (async ()=>{
          await signia.publiclyRevealAttributes({}, constants.certifierUrl, constants.certifierPublicKey, constants.certificateTypes.discord,
            true, {accessCode: code, verificationType: "Discord"}, async (message)=>{
              setProgressStatus(message)
            })
            setSuccessStatus(true)
        })()
    }, []);

    if(!successStatus){
      return(
        <div className={classes.background}>     
        <div>Status: </div>
        <p>{progressStatus}</p>
        <p>Once your certificate has been succesfully issued you will be redirected to the landing page</p>
      
        </div>  
      );
    }

    else{
      navigate('/')
    return null;

   //return (
    // <div>
    // <p>Successfully created certificate for discord information</p>
    // </div>
  //);
} 
}

export default AuthRedirect
