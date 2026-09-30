import { AuthFetch, Certificate, IdentityClient, WalletClient, AcquireCertificateResult } from '@bsv/sdk'
import { getBaseUrl, getBackendUrl } from './getBackendUrl'
export class FlowError extends Error {}
export type Family = 'email' | 'x' | 'discord'
export const families = {
  email: { name: 'Email', type: 'exOl3KM0dIJ04EW5pZgbZmPag6MdJXd3/a1enmUU/BA=', fields: ['email'] },
  x: { name: 'X', type: 'vdDWvftf1H+5+ZprUw123kjHlywH+v20aPQTuXgMpNc=', fields: ['userName', 'profilePhoto'] },
  discord: { name: 'Discord', type: '2TgqRC35B1zehGmB21xveZNc7i5iqHc0uxMb+1NMPW4=', fields: ['userName', 'profilePhoto'] }
} as const
export interface Metadata { version: string; issuer: { publicKey: string; network: 'main' | 'test' }; families: {type: string; name: string; fields: string[]; enabled: boolean}[]; verification: {maxAgeSeconds: number} }
export const wallet = new WalletClient('auto')
export const sameFields = (a: string[], b: string[]) => a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i])
export function validateMetadata(value: unknown): Metadata {
  const data = value as Metadata
  if (!data || typeof data.version !== 'string' || !/^(02|03)[0-9a-f]{64}$/i.test(data.issuer?.publicKey ?? '') || !['main', 'test'].includes(data.issuer?.network) || !Array.isArray(data.families) || !Number.isFinite(data.verification?.maxAgeSeconds) || data.verification.maxAgeSeconds <= 0) throw new FlowError('The certification service has not provided a valid issuer descriptor. Retry service check.')
  for (const item of data.families) {
    if (typeof item.type !== 'string' || typeof item.name !== 'string' || typeof item.enabled !== 'boolean' || !Array.isArray(item.fields) || item.fields.some(f => typeof f !== 'string')) throw new FlowError('The service capability descriptor is invalid.')
  }
  return data
}
export function requireFamily(data: Metadata, family: Family) {
  const expected = families[family]
  const matches = data.families.filter(item => item.type === expected.type)
  if (matches.length !== 1 || !matches[0].enabled || !sameFields(matches[0].fields, [...expected.fields])) throw new FlowError(`${expected.name} certification is currently unavailable. Try another method or check again later.`)
  return expected
}
export async function loadMetadata(): Promise<Metadata> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(getBaseUrl() + '/metadata', {cache: 'no-store', signal: controller.signal})
    if (!response.ok) throw new FlowError('The certification service is unavailable. Retry service check.')
    return validateMetadata(await response.json())
  } catch { throw new FlowError('The certification service could not be checked. Retry service check.') }
  finally { clearTimeout(timeout) }
}
export async function request(family: Family, data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const response = await new AuthFetch(wallet).fetch(getBackendUrl(family), {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)})
  const result = await response.json()
  if (!response.ok || result?.status === 'error') {
    const messages: Record<number,string> = {401:'Connect or unlock your wallet, then start verification again.',403:'This method is unavailable or your authorization expired. Start verification again.',409:'The account verification expired or changed. Start verification again.',429:'The service sending or attempt limit was reached. Wait before trying again.',503:'A provider or service dependency is temporarily unavailable. Try again later.'}
    throw new FlowError(messages[response.status] ?? 'The service could not complete this step. Start verification again or contact operator support.')
  }
  if (!result || typeof result !== 'object') throw new FlowError('The service returned an unexpected response.')
  return result
}
export interface FlowDeps {
  metadata: () => Promise<Metadata>
  identity: () => Promise<string>
  network: () => Promise<'mainnet' | 'testnet'>
  acquire: (issuer: string, type: string, fields: Record<string,string>) => Promise<AcquireCertificateResult>
  verify: (certificate: AcquireCertificateResult) => Promise<boolean>
  stored: (certificate: AcquireCertificateResult) => Promise<boolean>
  publish: (certificate: AcquireCertificateResult, fields: string[]) => Promise<{status: string}>
}
export const liveDeps: FlowDeps = {
  metadata: loadMetadata,
  identity: async () => (await wallet.getPublicKey({identityKey: true})).publicKey,
  network: async () => (await wallet.getNetwork()).network,
  acquire: (issuer, type, fields) => wallet.acquireCertificate({certifier: issuer, certifierUrl: getBaseUrl(), type, acquisitionProtocol: 'issuance', fields}),
  verify: certificate => Certificate.fromObject(certificate).verify(),
  stored: async certificate => {
    for(let offset=0;offset<10000;offset+=100){
      const result=await wallet.listCertificates({certifiers:[certificate.certifier],types:[certificate.type],limit:100,offset})
      if(result.certificates.some(c=>c.serialNumber===certificate.serialNumber && c.subject===certificate.subject && c.signature===certificate.signature))return true
      if(offset+result.certificates.length>=result.totalCertificates || result.certificates.length===0)return false
    }
    return false
  },
  publish: (certificate, fields) => new IdentityClient(wallet).publiclyRevealAttributes(certificate, fields)
}
export type Stage = 'idle' | 'verifying' | 'issuing' | 'issued' | 'publishing' | 'complete' | 'partial' | 'error'
/** Holds the acquired receipt before checking it. Recovery must never acquire a second certificate. */
export class CertificateAttempt {
  certificate?: AcquireCertificateResult
  checked = false
  attempted = false
  busy = false
  published = false
  publicationAttempted = false
  constructor(readonly family: Family, readonly deps: FlowDeps = liveDeps) {}
  async finish(fields: Record<string,string>, reveal: boolean, stage: (value: Stage) => void) {
    if (this.busy) return
    this.busy = true
    try {
      const metadata = await this.deps.metadata()
      const expected = requireFamily(metadata, this.family)
      if (!sameFields(Object.keys(fields), [...expected.fields]) || Object.values(fields).some(v => typeof v !== 'string' || !v)) throw new FlowError('The provider did not return the required account attributes. Start again.')
      const subject = await this.deps.identity()
      if (await this.deps.network() !== (metadata.issuer.network === 'main' ? 'mainnet' : 'testnet')) throw new FlowError('Your wallet network does not match this certification service. Switch to the indicated network before continuing.')
      if (!this.certificate) {
        if (this.attempted) throw new FlowError('Issuance could not be confirmed. Check your wallet before starting again; this page will not issue another certificate automatically.')
        this.attempted = true
        stage('issuing')
        this.certificate = await this.deps.acquire(metadata.issuer.publicKey, expected.type, fields)
      }
      const c = this.certificate
      if (c.certifier !== metadata.issuer.publicKey || c.type !== expected.type || c.subject !== subject || !sameFields(Object.keys(c.fields), [...expected.fields]) || !c.signature || !(await this.deps.verify(c)) || !(await this.deps.stored(c))) throw new FlowError('The wallet receipt could not be validated. Check your wallet; no additional certificate will be issued by retrying the receipt check.')
      this.checked = true
      stage('issued')
      if (reveal && !this.published) {
        if (await this.deps.identity() !== subject) throw new FlowError('Your wallet identity changed. Reconnect the original wallet before publication.')
        stage('publishing')
        this.publicationAttempted = true
        const result = await this.deps.publish(c, [...expected.fields])
        if (result?.status !== 'success') throw new FlowError('Your certificate is saved in your wallet, but public publication was not confirmed. Public copies may already exist. Check publication status before choosing to retry; retrying may incur another transaction fee.')
        this.published = true
      }
      stage('complete')
    } catch (error) {
      stage(this.checked ? 'partial' : 'error')
      throw error
    } finally { this.busy = false }
  }
}
export const safeError = (error: unknown) => error instanceof FlowError ? error.message : 'This step could not be completed. Check your wallet and service connection, then try again.'
