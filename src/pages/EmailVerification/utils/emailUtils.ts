import { Authrite } from "authrite-js"
import { getBackendUrl } from "../../../utils/getBackendUrl"
import {WalletClient, AuthFetch} from "@bsv/sdk"

const authrite = new Authrite()
const clientWallet = new WalletClient('json-api', 'localhost')

export const sendVerificationEmail = async (email: string) => {
  try {
    const data = { email, funcAction: "sendEmail" }
    const response = await new AuthFetch(clientWallet).fetch(getBackendUrl("email"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()

    return responseData
  } catch (e) {
    throw e
  }
}

export const acquireEmailCertificate = async(certType: string, verifyEmail: string) => {
  await clientWallet.acquireCertificate({
  certifier: '02cab461076409998157f05bb90f07886380186fd3d88b99c549f21de4d2511b83',
  certifierUrl: 'http://localhost:8080/',
  type: certType,
  acquisitionProtocol: 'issuance',
  fields: {
    email: verifyEmail
  }
})
}
