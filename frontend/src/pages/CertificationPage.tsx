import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Page from '../components/Page'
import { CertificateAttempt, FlowError, families, Family, loadMetadata, Metadata, request, requireFamily, safeError, Stage, wallet } from '../utils/certification'
const paths = {email:'/EmailVerification',x:'/XVerification',discord:'/DiscordVerification'}
const consentKey = (family: Family) => `socialcert-consent-${family}`
export default function CertificationPage({family}: {family: Family}) {
  const [metadata,setMetadata] = useState<Metadata>()
  const [error,setError] = useState('')
  const [stage,setStage] = useState<Stage>('idle')
  const [busy,setBusy] = useState(false)
  const [email,setEmail] = useState('')
  const [sentEmail,setSentEmail] = useState('')
  const [code,setCode] = useState('')
  const [consent,setConsent] = useState(false)
  const [fields,setFields] = useState<Record<string,string>>()
  const [sentAt,setSentAt] = useState(0)
  const [now,setNow] = useState(Date.now())
  const attempt = useRef(new CertificateAttempt(family))
  const pending = useRef(false)
  const callbackStarted = useRef(false)
  const [callback] = useState(() => Object.fromEntries(new URLSearchParams(window.location.search)))
  const title = families[family].name
  const checkService = async () => {setError('');try {const data=await loadMetadata();requireFamily(data,family);setMetadata(data)}catch(e){setMetadata(undefined);setError(safeError(e))}}
  const run = async (operation: () => Promise<void>) => {
    if(pending.current) return
    pending.current=true;setBusy(true);setError('')
    try {await operation()}catch(e){setError(safeError(e));if(!attempt.current.checked)setStage('error')}
    finally {pending.current=false;setBusy(false)}
  }
  const finish = async (values: Record<string,string>, reveal: boolean) => {setFields(values);await attempt.current.finish(values,reveal,setStage)}
  useEffect(()=>{void checkService();const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer)},[family])
  useEffect(()=>{
    if(family==='email' || callbackStarted.current) return
    callbackStarted.current=true
    if(!Object.keys(callback).length)return
    // Keep provider material in this attempt's memory only; never in browser history/storage.
    window.history.replaceState(null,'',paths[family])
    if(callback.error || callback.denied || !(family==='x' ? callback.oauth_token && callback.oauth_verifier : callback.code)) {setError('Provider sign-in was cancelled or incomplete. Sign in again when you are ready.');setStage('error');sessionStorage.removeItem(consentKey(family));return}
    void run(async()=>{
      setStage('verifying')
      const raw=sessionStorage.getItem(consentKey(family));sessionStorage.removeItem(consentKey(family))
      let saved: {subject:string;reveal:boolean;created:number;state?:string;requestToken?:string}|undefined
      try {saved=raw?JSON.parse(raw):undefined}catch{/* malformed consent is not authorization */}
      if(window.location.hostname==='www.socialcert.net'){window.location.replace('https://socialcert.net'+paths[family]);return}
    const subject=(await wallet.getPublicKey({identityKey:true})).publicKey
      if(!saved || typeof saved.subject!=='string' || typeof saved.reveal!=='boolean' || typeof saved.created!=='number' || !Number.isFinite(saved.created) || saved.subject!==subject || Date.now()-saved.created>900000 || Date.now()<saved.created) throw new FlowError('The sign-in attempt expired or your wallet changed. Start sign-in again; no certificate has been requested.')
      if(family==='discord' ? !saved.state || callback.state!==saved.state : !saved.requestToken || callback.oauth_token!==saved.requestToken)throw new FlowError('This provider callback does not match the sign-in attempt. Start sign-in again.')
      setConsent(saved.reveal===true)
      const result=await request(family,family==='x'?{oauthToken:callback.oauth_token,oauthVerifier:callback.oauth_verifier,funcAction:'getUserInfo'}:{accessCode:callback.code,funcAction:'getDiscordData'})
      if(typeof result.userName!=='string' || !result.userName || typeof result.profilePhoto!=='string' || !result.profilePhoto)throw new FlowError('The provider did not return the expected account information. Start sign-in again.')
      await finish({userName:result.userName,profilePhoto:result.profilePhoto},saved.reveal===true)
    })
  },[family,callback])
  const send = () => run(async()=>{
    if(!metadata)throw new FlowError('Retry the service check before sending a code.')
    const address=email.trim()
    const result=await request('email',{email:address,funcAction:'sendEmail'})
    if(result.emailSentStatus!==true || typeof result.sentEmail!=='string' || !result.sentEmail)throw new FlowError('The service did not confirm delivery. Check the address and try again.')
    setSentEmail(result.sentEmail);setEmail(result.sentEmail);setSentAt(Date.now());setCode('');setStage('idle')
  })
  const verify = () => run(async()=>{
    setStage('verifying')
    const result=await request('email',{verifyEmail:sentEmail,verificationCode:code,funcAction:'verifyCode'})
    if(result.verificationStatus!==true) {setStage('idle');throw new FlowError('That code was not accepted. Check the code or request a new one; the service controls expiry and attempt limits.')}
    await finish({email:sentEmail},consent)
  })
  const signIn = () => run(async()=>{
    if(!metadata)throw new FlowError('Retry the service check before signing in.')
    if(window.location.hostname==='www.socialcert.net'){window.location.replace('https://socialcert.net'+paths[family]);return}
    const subject=(await wallet.getPublicKey({identityKey:true})).publicKey
    const state=crypto.randomUUID()
    const authorization={subject,reveal:consent,created:Date.now(),state,requestToken:''}
    if(family==='x'){
      const result=await request('x',{funcAction:'makeRequest',hostURL:window.location.hostname})
      if(typeof result.requestToken!=='string' || !result.requestToken)throw new FlowError('The provider could not start sign-in. Please try again later.')
      authorization.requestToken=result.requestToken
      sessionStorage.setItem(consentKey(family),JSON.stringify(authorization))
      window.location.assign(`https://api.twitter.com/oauth/authenticate?oauth_token=${encodeURIComponent(result.requestToken)}`)
    }else{
      const origin=window.location.hostname==='www.socialcert.net'?'https://socialcert.net':window.location.origin
      const params=new URLSearchParams({client_id:'1202716017055375421',response_type:'code',redirect_uri:origin+'/discordVerification',scope:'identify',state})
      sessionStorage.setItem(consentKey(family),JSON.stringify(authorization))
      window.location.assign('https://discord.com/oauth2/authorize?'+params)
    }
  })
  const c=attempt.current
  const retryReceipt = c.certificate && !c.checked
  const cooldown=Math.max(0,30-Math.floor((now-sentAt)/1000))
  return <Page><section className="flow-card"><p className="eyebrow">Account verification</p><h1>Verify your {title} account</h1><p>{family==='email'?'We will send a code to your inbox.':'Sign in with your provider to confirm account control.'} Your certificate is stored in your wallet.</p><p className="status" data-testid="flow-status" data-stage={stage} role="status">{busy ? stage==='issuing'?'Approve certificate issuance in your wallet…':stage==='publishing'?'Approve optional public publication in your wallet…':'Working — check your wallet for any permission request…':stage==='complete'?'Certificate issuance confirmed.':stage==='partial'?'Certificate saved; publication not confirmed.':''}</p>{metadata&&<><p>Service network: {metadata.issuer.network==='main'?'mainnet':'testnet'}</p><p>After verification, issuance is allowed for {Math.ceil(metadata.verification.maxAgeSeconds/60)} minutes using the same wallet and account. Verify again if that window expires. This is an issuance window, not a certificate expiry or a guarantee of ongoing account control.</p></>}{error&&<p className="error" role="alert">{error}</p>}{!metadata&&<button onClick={checkService} disabled={busy}>Retry service check</button>}
  {!c.attempted && !busy && <label className="consent"><input type="checkbox" data-testid="publication-consent" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Also publish my {family==='email'?'email address':'username and profile photo'} for public identity discovery. These attributes will be linked to my wallet identity. Public copies can persist; removal is not guaranteed. Publication may require transaction fees. <Link to="/help">Learn more</Link></span></label>}
  {!c.attempted && family==='email' && <>{!sentEmail?<form onSubmit={e=>{e.preventDefault();void send()}}><label className="form-group">Email address<input type="email" data-testid="email-address" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" inputMode="email" required disabled={busy}/></label><button data-testid="send-code" disabled={busy||!metadata}>Send code</button></form>:<><form onSubmit={e=>{e.preventDefault();void verify()}}><p>Enter the six-digit code sent to {sentEmail}.</p><label className="form-group">Verification code<input data-testid="verification-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e=>setCode(e.target.value.replace(/[^0-9]/g,''))} required disabled={busy}/></label><button data-testid="verify-code" disabled={busy||code.length!==6}>Verify code</button></form><div className="actions"><button data-testid="resend-code" disabled={busy||cooldown>0} onClick={()=>void send()}>{cooldown>0?`Resend in ${cooldown}s`:'Resend code'}</button><button data-testid="change-address" disabled={busy} onClick={()=>{setSentEmail('');setCode('');setError('');setStage('idle')}}>Change email address</button></div><p>Check your spam folder if the email has not arrived. The service may apply additional sending limits.</p></>}</>}
  {!c.attempted && family!=='email' && <button data-testid="oauth-start" disabled={busy||!metadata} onClick={()=>void signIn()}>Sign in with {title}</button>}
  {c.checked&&<div className="receipt" data-testid="certificate-receipt"><h2>Certificate saved in your wallet</h2><p>The issuer signature and wallet inventory were checked. Use your wallet in a compatible app to share certificate attributes when you choose.</p><p data-testid="publication-status">{c.published?'The publication service accepted your public attributes. Discovery in other apps still needs an independent lookup.':c.publicationAttempted?'Publication is unconfirmed. Public copies may already exist; stopping retries does not remove them.':'This attempt has not requested public publication. Your certificate remains in your wallet.'}</p></div>}
  {(stage==='partial'||retryReceipt)&&fields&&<div className="actions"><button data-testid={c.checked?'retry-publication':'retry-issuance'} disabled={busy} onClick={()=>void run(()=>finish(fields,consent))}>{c.checked?'Retry publication':'Check saved wallet receipt'}</button>{c.checked&&<button disabled={busy} onClick={()=>{setConsent(false);void run(()=>finish(fields,false))}}>Stop retrying publication</button>}</div>}
  {c.attempted&&!c.certificate&&<p>Issuance outcome is unknown. Check your wallet before starting again. This attempt will not automatically request a second certificate.</p>}
  <div className="actions"><Link to="/" data-testid="start-over">Return to methods</Link><Link to="/help">Privacy and help</Link></div></section></Page>
}
