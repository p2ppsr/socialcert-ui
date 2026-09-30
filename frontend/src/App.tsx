import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { wallet } from './utils/certification'
import Register from './pages/Register'
import CertificationPage from './pages/CertificationPage'
import Help from './pages/Help'
import Unavailable from './pages/Unavailable'
import VerifyResult from './pages/VerifyResult/VerifyResult'
import Page from './components/Page'
import './App.scss'
export function WalletStatus(){
  const [status,setStatus]=useState('unchecked');const [dismissed,setDismissed]=useState(false)
  const check=async()=>{setStatus('checking');setDismissed(false);try{const result=await Promise.race([wallet.isAuthenticated(),new Promise<never>((_,reject)=>setTimeout(()=>reject(new Error('Wallet unavailable')),5000))]);setStatus(result.authenticated?'ready':'missing')}catch{setStatus('missing')}}
  useEffect(()=>{void check()},[])
  if(dismissed)return <div className="wallet-banner"><button onClick={check} data-testid="wallet-retry">Retry wallet check</button></div>
  return <aside className="wallet-banner" aria-label="Wallet connection"><span role="status" data-testid="wallet-status">{status==='ready'?'Wallet connected':status==='checking'?'Checking wallet connection…':'Connect or unlock a compatible BSV wallet before verification. You can browse how this works first.'}</span>{status!=='ready'&&<><Link to="/help">Wallet help</Link><button onClick={check} disabled={status==='checking'} data-testid="wallet-retry">Retry wallet check</button><button onClick={()=>setDismissed(true)}>Dismiss</button></>}</aside>
}
export default function App(){return <BrowserRouter><a href="#main" className="skip-link">Skip to content</a><WalletStatus/><Routes><Route path="/" element={<Register/>}/><Route path="/EmailVerification" element={<CertificationPage key="email" family="email"/>}/><Route path="/XVerification" element={<CertificationPage key="x" family="x"/>}/><Route path="/DiscordVerification" element={<CertificationPage key="discord" family="discord"/>}/><Route path="/PhoneVerification/*" element={<Unavailable/>}/><Route path="/help" element={<Help/>}/><Route path="/:family/VerifyResult/:status" element={<VerifyResult/>}/><Route path="/:family/VerifyResults/:status" element={<VerifyResult/>}/><Route path="*" element={<Page><h1>Page not found</h1><Link className="button" to="/">Return to Social Cert</Link></Page>}/></Routes></BrowserRouter>}
