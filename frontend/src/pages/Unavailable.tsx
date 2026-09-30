import Page from '../components/Page'
import { Link } from 'react-router-dom'
export default function Unavailable(){return <Page><h1>Telephone certification is unavailable</h1><p data-testid="phone-unavailable">No verification text or certificate request has been sent. Choose email, X or Discord instead.</p><Link className="button" to="/">Choose another method</Link></Page>}
