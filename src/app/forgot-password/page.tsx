'use client'
import { ForgotPasswordProvider } from "@/contexts/ForgotPasswordContext"
import PasswordResetFlow from "@/components/forgot-password/ForgotPasswordFlow"

export default function ForgotPasswordPage() {
  return (
    <ForgotPasswordProvider>
      <PasswordResetFlow />
    </ForgotPasswordProvider>
  )
}
