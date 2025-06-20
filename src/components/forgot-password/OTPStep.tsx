'use client'
import { useState, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useForgotPassword } from '@/contexts/ForgotPasswordContext'
import Link from 'next/link'

const OTPStep = () => {
  const { data, setStep, setToken } = useForgotPassword()
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(90)
  const [isLoading, setIsLoading] = useState(false)

  // Countdown timer
  useEffect(() => {
    const timer = countdown > 0 && setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => { if (timer) clearTimeout(timer) }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullOtp = otp.join('')
    if (fullOtp.length !== 6) return

    setIsLoading(true)
    
    try {
        alert(data.email)
      const response = await fetch('http://localhost:4000/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: data.email, 
          otp: fullOtp 
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'OTP verification failed')
      }

      const responseData = await response.json()
      
      // Save the reset token from the response
      setToken(responseData.resetToken || responseData.token)
      toast.success('OTP verified successfully!')
      setStep('reset')
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'OTP verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      const response = await fetch('http://localhost:4000/v1/user/resend-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to resend OTP')
      }

      setCountdown(90)
      toast.success('New OTP sent to your email!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to resend OTP')
    }
  }

  const handleOtpChange = (value: string, index: number) => {    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement
      nextInput?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement
      prevInput?.focus()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <Toaster position="top-center" />
        
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to <span className="font-semibold">{data.email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                autoFocus={i === 0}
              />
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={otp.join('').length !== 6 || isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(otp.join('').length !== 6 || isLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>

        <div className="text-center space-y-4">
          {countdown > 0 ? (
            <p className="text-sm text-gray-500">
              Resend code in <span className="font-medium text-gray-900">{countdown}</span> seconds
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Resend OTP
            </button>
          )}
          
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={() => setStep('email')}
              className="text-sm font-medium text-gray-600 hover:text-gray-500"
            >
              ← Back to Email
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OTPStep