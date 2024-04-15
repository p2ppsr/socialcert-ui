import React, { useState } from "react"
import useStyles from "./register-style"
import Verify from "../components/Verify"
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  LinearProgress,
} from "@mui/material"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"
import { useNavigate } from "react-router-dom"
import socialCertLogo from "../assets/images/socialCert.svg"
import { FaPhone, FaDiscord } from "react-icons/fa"

import socialCertBackgroundImage from "../assets/images/socialCertBackground.png"

const Register = () => {
  const navigate = useNavigate()
  const classes = useStyles()
  const [success, setSuccess] = useState(false)
  const [openVerify, setOpenVerify] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState("")
  const [inquiryId, setInquiryId] = useState("")
  const [loading, setLoading] = useState(false)
  const [progressStatus, setProgressStatus] = useState("")

  const handleDiscordClick = async () => {
    const hostname = window.location.hostname

    if (hostname.includes("staging")) {
      return (window.location.href =
        "https://discord.com/oauth2/authorize?client_id=1202716017055375421&response_type=code&redirect_uri=https%3A%2F%2Fstaging.socialcert.net%2Fauthredirect&scope=identify")
    } else if (hostname.includes("localhost")) {
      return (window.location.href =
        "https://discord.com/api/oauth2/authorize?client_id=1202716017055375421&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8088%2FAuthRedirect&scope=identify")
    } else {
      return (window.location.href =
        "https://discord.com/oauth2/authorize?client_id=1202716017055375421&response_type=code&redirect_uri=https%3A%2F%2Fsocialcert.net%2Fauthredirect&scope=identify")
    }
  }

  const handlePhoneClick = async () => {
    console.log("Inside handlePhoneClick")
    navigate("/PhoneRedirect")
  }

  return (
    <div className="container">
      <div className="sub-container">
        <div className="sub-container-2">
          <h2 style={{ margin: 0 }}>Welcome to</h2>
          <img
            src={socialCertLogo}
            width={300}
            id="main-logo"
            className="button"
          />
        </div>
      </div>
      <img src={socialCertBackgroundImage} className="background-image"/>
      <p style={{ marginBottom: "5rem" }}>
        Gain access to the MetaNet using your own certified identity{" "}
      </p>

      <p style={{ marginBottom: "3rem" }}>
        Choose your desired identity certification
      </p>
      <div className="flex button-group">
        <button className="green-button">
          <FaPhone />
          Certify Phone Number
        </button>
        <button className="blue-button">
          <FaDiscord />
          Certify Discord Handle
        </button>
      </div>
    </div>
  )
}

export default Register
