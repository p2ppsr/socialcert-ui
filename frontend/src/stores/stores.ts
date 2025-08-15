import { create } from "zustand"
export const usePhoneStore = create((set) => ({
  textSentPhonenumber: "",
  setTextSentPhonenumber: (newState: string) =>
    set(() => ({ textSentPhonenumber: newState })),

  textSentStatus: false,
  setTextSentStatus: (newState: boolean) =>
    set(() => ({ textSentStatus: newState })),
}))
