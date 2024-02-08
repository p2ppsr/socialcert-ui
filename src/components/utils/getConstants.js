const getConstants = () => {
  let certifierUrl, certifierPublicKey, confederacyUrl, personaInquiryTemplateID, personaInquiryEnvId
  const certificateType = 'z40BOInXkI8m7f/wBrv4MJ09bZfzZbTj2fJqCtONqCY='

  if (window.location.host.startsWith('localhost') || (window.location.host.startsWith('staging'))) {
    certifierUrl = 'https://staging-identicert-backend.babbage.systems'
    certifierPublicKey = '036dc48522aba1705afbb43df3c04dbd1da373b6154341a875bceaa2a3e7f21528'
    confederacyUrl = 'https://staging-confederacy.babbage.systems'
    personaInquiryTemplateID = 'itmpl_UAr6mTrGB2xUGDWwAMr1Kjy8'
    personaInquiryEnvId = 'env_Anm1qGVdq3t3cwgWgwmp7ro6'
  } else {
    certifierUrl = 'https://identicert-backend.babbage.systems'
    certifierPublicKey = '0295bf1c7842d14babf60daf2c733956c331f9dcb2c79e41f85fd1dda6a3fa4549'
    confederacyUrl = 'https://confederacy.babbage.systems'
    personaInquiryTemplateID = 'itmpl_UAr6mTrGB2xUGDWwAMr1Kjy8'
    personaInquiryEnvId = 'env_XTt9RSHyrcAV4NGpzuC8YWyk'
  }

  return {
    certifierUrl,
    certifierPublicKey,
    certificateType,
    confederacyUrl,
    personaInquiryTemplateID,
    personaInquiryEnvId
  }
}
export default getConstants
