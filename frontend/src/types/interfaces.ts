interface PhoneNumberData {
  phoneNumber: string;
  funcAction: string;
}

interface PhoneVerificationResponse {
  textSentStatus: boolean;
  textSentPhonenumber: string;
}

interface VerificationData {
  phoneNumber: string;
  verificationCode: string;
  funcAction: string;
}

interface VerificationResponse {
  verificationStatus?: boolean;
  verifiedPhonenumber?: string;  // Optional, as the backend may not return it on failures
}

interface SigniaData {
  verifiedPhonenumber: string;
}