export const getBackendUrl = () => {
  const hostname = window.location.hostname

  if (hostname.includes("staging")) {
    return "https://staging-backend.socialcert.net/sendVerificationText"
  } else if (hostname.includes("localhost")) {
    return "https://staging-backend.socialcert.net/sendVerificationText"
  } else {
    return "https://backend.socialcert.net/sendVerificationText"
  }
}