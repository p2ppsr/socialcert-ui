import React from 'react'
import getConstants from '../../utils/getConstants'
import './ipersona.css'
import { Dialog } from '@mui/material'
import Persona from 'persona'
import { Signia } from 'babbage-signia'
import { toast } from 'react-toastify'

// T

const Verify = ({ openVerify, setOpenVerify, setLoading, setVerifyStatus, setInquiryId, setSuccess, setProgressStatus }) => {
  const constants = getConstants()
  const signia = new Signia()
  signia.config.confederacyHost = constants.confederacyUrl

  const handleVerifyCancel = () => {
    setOpenVerify(false)
    setLoading(false)
  }

  return (

    <Dialog open={openVerify} onClose={handleVerifyCancel} PaperProps={{ sx: { minHeight: '85vh' } }}>
      <div className='persona_container'>
        <Persona.Inquiry
          templateId={constants.personaInquiryTemplateID}
          environmentId={constants.personaInquiryEnvId}
          onLoad={() => {
            setInquiryId('')
            setVerifyStatus('')
          }}
          onComplete={async ({ inquiryId, status, fields }) => {
            setOpenVerify(false)
            try {
              // The profile photo is undefined until the backend publishes it to NanoStore
              await signia.publiclyRevealAttributes({
                firstName: fields['name-first'].value,
                lastName: fields['name-last'].value,
                profilePhoto: undefined
              }, constants.certifierUrl, constants.certifierPublicKey, constants.certificateType,
              true, { verificationId: inquiryId }, async (message) => {
                setProgressStatus(message)
              })

              setInquiryId(inquiryId)
              setVerifyStatus(status)
              setLoading(false)
              setSuccess(true)
            } catch (e) {
              console.error(e)
              toast.error('Something went wrong!')
              setOpenVerify(false)
              setLoading(false)
            }
          }}
        />
      </div>
    </Dialog>
  )
}

export default Verify
