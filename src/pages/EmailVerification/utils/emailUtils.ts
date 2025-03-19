import { Authrite } from "authrite-js"
import { getBackendUrl, getBaseUrl } from "../../../utils/getBackendUrl"
import { WalletClient, AuthFetch } from "@bsv/sdk"

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

export const acquireEmailCertificate = async (certType: string, verifyEmail: string) => {
  await clientWallet.acquireCertificate({
    certifier: '02cf6cdf466951d8dfc9e7c9367511d0007ed6fba35ed42d425cc412fd6cfd4a17',
    certifierUrl: await getBaseUrl(),
    type: 'exOl3KM0dIJ04EW5pZgbZmPag6MdJXd3/a1enmUU/BA=',
    acquisitionProtocol: 'issuance',
    fields: {
      email: verifyEmail
    }
  })
}
