export const getBaseUrl = (hostname = window.location.hostname): string => {
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]') return 'http://localhost:8080'
  if (hostname === 'staging.socialcert.net') return 'https://staging-backend.socialcert.net'
  if (hostname === 'socialcert.net' || hostname === 'www.socialcert.net') return 'https://backend.socialcert.net'
  throw new Error('This host is not configured for Social Cert. Open socialcert.net or a supported local environment.')
}
export const getBackendUrl = (family: string): string => {
  const paths: Record<string, string> = { email: '/handleEmailVerification', X: '/handleXVerification', x: '/handleXVerification', discord: '/handleDiscordVerification' }
  if (!paths[family]) throw new Error('This certificate family is unavailable.')
  return getBaseUrl() + paths[family]
}
