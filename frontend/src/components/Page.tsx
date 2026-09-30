import { Link } from 'react-router-dom'
import socialCertLogo from '../assets/images/socialCert.svg'
export default function Page({children}: {children: React.ReactNode}) {
  return <><header className="site-header"><Link to="/" aria-label="Social Cert home"><img src={socialCertLogo} alt="Social Cert" /></Link><Link to="/help" data-testid="help">How it works</Link></header><main id="main" data-testid="socialcert-main">{children}</main><footer>Social Cert attests control of an account. It does not verify your legal identity. <Link to="/help">Privacy and help</Link></footer></>
}
