import { request } from '../../../utils/certification'
export const sendVerificationEmail = (email: string) => request('email',{email,funcAction:'sendEmail'})
