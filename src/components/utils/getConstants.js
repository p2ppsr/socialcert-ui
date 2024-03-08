const getConstants = () => {
  let certifierUrl, certifierPublicKey, confederacyUrl
  const certificateType = '2TgqRC35B1zehGmB21xveZNc7i5iqHc0uxMb+1NMPW4=' // correct

  if ( (window.location.host.startsWith('staging'))) {
    certifierUrl = 'https://staging.socialcert.net/'
    certifierPublicKey = '02cf6cdf466951d8dfc9e7c9367511d0007ed6fba35ed42d425cc412fd6cfd4a17' // correct
    confederacyUrl = 'https://staging-confederacy.babbage.systems'
  }
  
  else if(window.location.host.startsWith('localhost')){
    certifierUrl = 'http://localhost:3002'
    certifierPublicKey = '02cf6cdf466951d8dfc9e7c9367511d0007ed6fba35ed42d425cc412fd6cfd4a17' // correct
    confederacyUrl = 'https://staging-confederacy.babbage.systems'
  }else {
    certifierUrl = 'https://socialcert.net/'
    certifierPublicKey = '03285263f06139b66fb27f51cf8a92e9dd007c4c4b83876ad6c3e7028db450a4c2' // correct
    confederacyUrl = 'https://confederacy.babbage.systems'
  }

  return {
    certifierUrl,
    certifierPublicKey,
    certificateType,
    confederacyUrl,
  }
}
export default getConstants
