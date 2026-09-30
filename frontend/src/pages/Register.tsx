import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { families, loadMetadata, Metadata, requireFamily } from '../utils/certification'
import Page from '../components/Page'
export default function Register() {
  const [metadata,setMetadata] = useState<Metadata>()
  const [error,setError] = useState(false)
  const check = () => { setError(false); loadMetadata().then(setMetadata).catch(() => {setMetadata(undefined);setError(true)}) }
  useEffect(check,[])
  return <Page><section className="hero"><p className="eyebrow">Your accounts. Your wallet.</p><h1>Prove an account is yours.</h1><p>Verify your email, X or Discord account and save a signed certificate in your BSV wallet. Compatible apps can use it to recognise your account.</p><p>Certificates stay private unless you explicitly choose to publish attributes. You need a compatible wallet and access to the account you verify.</p></section><section aria-labelledby="choose"><h2 id="choose">Choose an account to verify</h2><p className="notice" role="status">{metadata ? 'The service reports these supported methods. Provider availability is checked during verification.' : error ? 'The service could not be checked. No certification requests have been sent.' : 'Checking available methods…'}</p>{error && <button onClick={check}>Retry service check</button>}<div className="family-grid">{(Object.keys(families) as (keyof typeof families)[]).map(family => { let enabled=false; if(metadata) try {requireFamily(metadata,family);enabled=true} catch {} return <article key={family}><h3>{families[family].name}</h3><p>{family==='email' ? 'Receive a verification code in your inbox.' : 'Sign in with your account provider.'}</p>{enabled ? <Link className="button" data-testid={`family-${family}`} to={family==='email'?'/EmailVerification':family==='x'?'/XVerification':'/DiscordVerification'}>Verify {families[family].name}</Link> : <span>Unavailable until service check passes</span>}</article>})}</div><p data-testid="phone-unavailable">Telephone certification is currently unavailable.</p></section></Page>
}
