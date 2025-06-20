'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'react-hot-toast'
import axios from 'axios'

export default function OTPVerification() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [email, setEmail] = useState('')
  const [countdown, setCountdown] = useState(90)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Get email from session storage
  useEffect(() => {
    const storedEmail = localStorage.getItem('pendingEmail')
    if (!storedEmail) {
      router.push('/signup')
      return
    }
    setEmail(storedEmail)
  }, [router])

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
      const response = await axios('http://localhost:4000/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ email, otp: fullOtp })
      })

      if (response.status !== 200) throw new Error(response.data?.message || 'Verification failed')

      localStorage.removeItem('pendingEmail')
      toast.success('Email verified successfully!')
      router.push('/login')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await axios('http://localhost:4000/v1/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ email })
      })
      setCountdown(90)
      toast.success('New OTP sent!')
    } catch (error) {
      toast.error('Failed to resend OTP')
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

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
        <Toaster/>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Verify Your Email</h1>
        <p className="text-gray-600 mt-2">
          Enter the 6-digit code sent to <span className="font-semibold">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(e.target.value, i)}
              className="w-12 h-12 text-center text-xl border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus={i === 0}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={otp.join('').length !== 6 || isLoading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors"
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <div className="text-center">
        {countdown > 0 ? (
          <p className="text-gray-500">
            Resend code in <span className="font-medium">{countdown}</span> seconds
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  )
}