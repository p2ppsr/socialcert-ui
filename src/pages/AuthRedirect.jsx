import React, { useEffect, useState } from 'react';
import getConstants from '../components/utils/getConstants';
import { Dialog } from '@mui/material'
import { Signia } from 'babbage-signia'
import { toast } from 'react-toastify'




const AuthRedirect = () =>{
  const [progressStatus, setProgressStatus] = useState("")
  const constants = getConstants()
  const signia = new Signia()
  signia.config.confederacyHost = constants.confederacyUrl

    useEffect(() =>{
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        (async ()=>{
          await signia.publiclyRevealAttributes({}, constants.certifierUrl, constants.certifierPublicKey, constants.certificateType,
            true, {accessCode: code}, async (message)=>{
              setProgressStatus(message)
            })
        })()
        
        

    }, []);

   return (
    <div>
    <div>Processing...</div>
    <p>{progressStatus}</p>
    </div>
  );
}

export default AuthRedirect
