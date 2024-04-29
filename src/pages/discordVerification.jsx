import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import getConstants from '../utils/getConstants'
import { Signia } from 'babbage-signia'

import useStyles from './register-style'

const DiscordVerification = () => {
  const [progressStatus, setProgressStatus] = useState('')
  const [successStatus, setSuccessStatus] = useState(false)
  const constants = getConstants()
  const navigate = useNavigate()
  const classes = useStyles()
  const signia = new Signia()
  signia.config.confederacyHost = constants.confederacyUrl

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code');
    (async () => {
      await signia.publiclyRevealAttributes({}, constants.certifierUrl, constants.certifierPublicKey, constants.certificateTypes.discord,
        true, { accessCode: code, verificationType: 'Discord' }, async (message) => {
          setProgressStatus(message)
        })
      setSuccessStatus(true)
    })()
  }, [])

  if (!successStatus) {
    return (
      <div className={classes.background}>
        <div>Status: </div>
        <p>{progressStatus}</p>
        <p>Once your certificate has been successfully issued you will be redirected to the landing page</p>

      </div>
    )
  } else {
    navigate('/')
    return null
  }
}

export default DiscordVerification
