import { useNavigate } from "react-router-dom"

interface GoBackButtonProps {
  navigatePath: string
  style?: Object
  label: string
}

// Requires the full path of the page desired to return to: eg: '/' or '/PhoneVerification'
const NavigateButton = ({ navigatePath, style, label }: GoBackButtonProps) => {
  const navigate = useNavigate()
  return (
    <div style={style}>
      <button
        className="back-button"
        onClick={() => {
          navigate(navigatePath)
        }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.26 9.33977L3.56 5.73977L6.26 2.13977H5.30857L2.60857 5.73977L5.30857 9.33977H6.26ZM9.5 9.33977L6.8 5.73977L9.5 2.13977H8.54857L5.84857 5.73977L8.54857 9.33977H9.5Z"
            fill="white"
          />
        </svg>
        {label}
      </button>
    </div>
  )
}

export default NavigateButton
