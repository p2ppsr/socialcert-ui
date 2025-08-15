import React, { useState } from "react"
import "./VerifyCodeInput.scss"

interface VerifyCodeInputProps {
  onChange: (value: string) => void
  handleSubmit: any
}

const VerifyCodeInput: React.FC<VerifyCodeInputProps> = ({
  onChange,
  handleSubmit
}) => {
  const inputLength = 6
  const [inputValue, setInputValue] = useState("")
  return (
    <div className="flex-wrap" style={{ marginBottom: ".5rem" }}>
      <div className="code-input-container">
        <div style={{ transform: "translateY(.25rem)" }}>
          <input
            type="text"
            maxLength={inputLength}
            minLength={inputLength}
            placeholder="xxxxxx"
            onChange={(e) => {
              onChange(e.target.value) // Generic change function to be used by parent component
              setInputValue(e.target.value)
            }}
            required
          />
          <div className="code-input-underline" />
        </div>
      </div>
      <button
        className="verify-button"
        style={{ alignSelf: "center" }}
        onClick={async (e) => {
          await handleSubmit(e)
        }}
        disabled={inputValue.length < inputLength}
      >
        Verify
      </button>
    </div>
  )
}

export default VerifyCodeInput
