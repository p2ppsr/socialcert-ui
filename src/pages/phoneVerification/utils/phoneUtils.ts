import { Authrite } from "authrite-js"
import { getBackendUrl } from "../../../utils/getBackendUrl"

const authrite = new Authrite()

export const sendVerificationText = async (phoneNumber: string) => {
  try {
    const data = { phoneNumber, funcAction: "sendText" }
    const response = await authrite.request(getBackendUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
  
    return responseData
  } catch(e) {
    throw e
  }
}
