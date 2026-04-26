import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { verifyOTP, requestOTP } from "@/helper/functions" // Adjust import path if your api functions are located elsewhere
import { toast } from "sonner"
import { Loader2, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function VerifyForm({ email, redirectTo = "/dashboard" }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [otp, setOtp] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit code.")
      return
    }

    setLoading(true)
    try {
      await verifyOTP(email, otp)
      toast.success("Email verified successfully!")
      navigate(redirectTo, { replace: true })
    } catch (error) {
      toast.error(error.message || "Invalid or expired verification code.")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    try {
      await requestOTP(email)
      toast.success("A new verification code has been sent.")
    } catch (error) {
      toast.error(error.message || "Failed to resend code. Please try again later.")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="verify-otp">6-Digit Verification Code</Label>
        <Input 
          id="verify-otp" 
          name="otp" 
          type="text" 
          placeholder="123456" 
          required 
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow numbers
          className="rounded-xl bg-muted/20 h-11 text-center tracking-widest text-lg"
        />
      </div>

      <Button 
        type="submit" 
        className="mt-4 w-full rounded-full font-medium shadow-none h-11" 
        disabled={loading || resendLoading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            Verify Account
            <CheckCircle2 className="ml-2 size-4" />
          </>
        )}
      </Button>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading || loading}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          {resendLoading ? "Sending..." : "Didn't receive a code? Resend"}
        </button>
      </div>
    </form>
  )
}