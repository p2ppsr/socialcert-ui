export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove any non-digit characters from the phone number
  const cleanNumber = phoneNumber.replace(/\D/g, "")

  // Identify the country code (assuming 1 to 4 digits for the country code)
  let countryCode = ""
  if (cleanNumber.startsWith("1") || cleanNumber.length <= 10) {
    // North America and small countries
    countryCode = cleanNumber.substring(0, 1)
  } else if (cleanNumber.length > 10) {
    const possibleCodes = [1, 2, 3, 4].map((len) =>
      cleanNumber.substring(0, len)
    )
    // This array should be populated with actual country code data to find the longest matching country code
    countryCode = possibleCodes.find((code) => cleanNumber.substring(0, 1))!
  }

  // Remaining number after country code
  const nationalNumber = cleanNumber.substring(countryCode.length)

  // Attempt to format the remaining number based on length (common patterns)
  let formattedNationalNumber: string
  switch (nationalNumber.length) {
    case 10: // Common for many countries including US, Canada
      formattedNationalNumber = `(${nationalNumber.substring(
        0,
        3
      )}) ${nationalNumber.substring(3, 6)}-${nationalNumber.substring(6)}`
      break
    case 9: // Common in some European countries
      formattedNationalNumber = `(${nationalNumber.substring(
        0,
        3
      )}) ${nationalNumber.substring(3, 6)} ${nationalNumber.substring(6)}`
      break
    case 8: // Smaller countries
      formattedNationalNumber = `${nationalNumber.substring(
        0,
        4
      )}-${nationalNumber.substring(4)}`
      break
    default:
      formattedNationalNumber = nationalNumber // No formatting if an unusual length
  }

  // Combine country code with formatted national number
  return `+${countryCode} ${formattedNationalNumber}`
}
