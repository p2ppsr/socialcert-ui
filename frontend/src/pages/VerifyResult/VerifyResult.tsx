import Page from '../../components/Page'
import { Link } from 'react-router-dom'
export default function VerifyResult(_props: {certType?:string}){return <Page><h1>Check your wallet for the result</h1><p>A result URL cannot confirm that a certificate was issued or published. Return to your verification flow or inspect your wallet certificates.</p><Link className="button" to="/">Choose a verification method</Link></Page>}
