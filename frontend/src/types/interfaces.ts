export interface PhoneNumberData {
  phoneNumber: string;
  funcAction: string;
}

export interface PhoneVerificationResponse {
  textSentStatus: boolean;
  textSentPhonenumber: string;
}

export interface VerificationData {
  phoneNumber: string;
  verificationCode: string;
  funcAction: string;
}

export interface VerificationResponse {
  verificationStatus?: boolean;
  verifiedPhonenumber?: string;  // Optional, as the backend may not return it on failures
}

export interface SigniaData {
  verifiedPhonenumber: string;
}