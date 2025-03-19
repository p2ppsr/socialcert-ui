
// Helper function to determine the base URL based on the hostname
export const getBaseUrl = (): string => {
  const hostname = window.location.hostname
  if (hostname.includes("staging")) {
    return "https://staging-backend.socialcert.net"
  } else if (hostname.includes("localhost")) {
    return "http://localhost:8080"
  } else {
    return "https://backend.socialcert.net"
  }
}

export const getBackendUrl = (certType: string) => {

  // Mapping of certificate types to their respective paths
  const paths: Record<string, string> = {
    phone: "/sendVerificationText",
    email: "/handleEmailVerification",
    X: "/handleXVerification",
  }

  const baseUrl = getBaseUrl()
  const path = paths[certType]

  // Construct the full URL
  return `${baseUrl}${path}`
}
