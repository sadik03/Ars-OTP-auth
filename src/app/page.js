"use client"

import { useState } from "react"
import "./AuthForm.css"

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(true)
  const [step, setStep] = useState(1) // 1: Initial form, 2: OTP verification
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    acceptTerms: false,
  })
  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const sendOTP = async (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage("Please fill all fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match")
      return
    }

    if (!formData.acceptTerms) {
      setMessage("Please accept the terms of privacy policy")
      return
    }

    try {
      setMessage("Sending OTP...")
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep(2)
        setMessage("OTP sent to your email")
      } else {
        setMessage(data.error || "Failed to send OTP")
      }
    } catch (error) {
      setMessage("Error sending OTP. Please try again.")
    }
  }

  const verifyOTP = async (e) => {
    e.preventDefault()

    if (!formData.otp) {
      setMessage("Please enter OTP")
      return
    }

    try {
      setMessage("Verifying...")
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          otp: formData.otp,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Account created successfully!")
        // Reset form and redirect to login
        setTimeout(() => {
          setIsSignup(false)
          setStep(1)
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            otp: "",
            acceptTerms: false,
          })
          setMessage("")
        }, 2000)
      } else {
        setMessage(data.error || "Failed to verify OTP")
      }
    } catch (error) {
      setMessage("Error verifying OTP. Please try again.")
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setMessage("Please fill all fields")
      return
    }

    try {
      setMessage("Logging in...")
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Login successful!")
        // Handle successful login (e.g., redirect to dashboard)
      } else {
        setMessage(data.error || "Invalid credentials")
      }
    } catch (error) {
      setMessage("Error logging in. Please try again.")
    }
  }

  const toggleForm = () => {
    setIsSignup(!isSignup)
    setStep(1)
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
      acceptTerms: false,
    })
    setMessage("")
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        {isSignup ? (
          step === 1 ? (
            <>
              <h2>Sign Up</h2>
              <form onSubmit={sendOTP}>
                <div className="form-group">
                  <div className="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <div className="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <div className="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <div className="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />
                  <label htmlFor="acceptTerms">I accept terms of privacy policy</label>
                </div>
                <button type="submit" className="submit-button">
                  Create Account
                </button>
              </form>
              <p className="toggle-form">
                Already have an account? <span onClick={toggleForm}>Sign In</span>
              </p>
            </>
          ) : (
            <>
              <h2>Verify OTP</h2>
              <form onSubmit={verifyOTP}>
                <div className="form-group">
                  <div className="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP sent to your email"
                    value={formData.otp}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="submit-button">
                  Verify & Create Account
                </button>
              </form>
              <p className="resend-otp">
                Didn't receive OTP? <span onClick={() => sendOTP({ preventDefault: () => {} })}>Resend</span>
              </p>
            </>
          )
        ) : (
          <>
            <h2>Sign In</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <div className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <div className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="submit-button">
                Sign In
              </button>
            </form>
            <p className="toggle-form">
              Don't have an account? <span onClick={toggleForm}>Sign Up</span>
            </p>
          </>
        )}

        {message && (
          <p className={`message ${message.includes("successful") || message.includes("sent") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default AuthForm

