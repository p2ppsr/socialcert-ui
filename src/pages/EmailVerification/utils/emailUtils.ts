import { Authrite } from "authrite-js"
import { getBackendUrl } from "../../../utils/getBackendUrl"

const authrite = new Authrite()

export const sendVerificationEmail = async (email: string) => {
  try {
    const data = { email, funcAction: "sendEmail" }
    const response = await authrite.request(getBackendUrl("email"), {
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
