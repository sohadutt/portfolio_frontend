import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { verifyOTP, requestOTP } from "@/helper/functions"
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
      toast.error("Please enter the complete 6-digit buffer.")
      return
    }

    setLoading(true)
    try {
      await verifyOTP(email, otp)
      toast.success("Identity verified. Access granted.")
      navigate(redirectTo, { replace: true })
    } catch (error) {
      toast.error(error.message || "Invalid or expired verification buffer.")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    try {
      await requestOTP(email)
      toast.success("A new verification buffer has been transmitted.")
    } catch (error) {
      toast.error(error.message || "Transmission failed. Please retry later.")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2.5">
        <Label htmlFor="verify-otp" className="text-sm font-medium tracking-wide text-foreground/90">
          6-Digit Verification Code
        </Label>
        <Input 
          id="verify-otp" 
          name="otp" 
          type="text" 
          placeholder="000000" 
          required 
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          className="h-12 rounded-xl border-border/40 bg-card/40 text-center text-xl font-light tracking-[0.5em] backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:border-primary focus-visible:bg-card/60 focus-visible:ring-1 focus-visible:ring-primary/40 shadow-none"
        />
        <p className="px-1 text-[11px] font-light leading-relaxed text-muted-foreground">
          Enter the unique sequence sent to your registered address to synchronize your account.
        </p>
      </div>

      <Button 
        type="submit" 
        size="lg"
        className="mt-2 h-12 w-full rounded-full font-medium transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_20px_0_color-mix(in_oklch,var(--primary)_40%,transparent)] shadow-none" 
        disabled={loading || resendLoading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            Verify Account
            <CheckCircle2 className="ml-2 size-5" />
          </>
        )}
      </Button>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading || loading}
          className="text-xs font-light tracking-wide text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
        >
          {resendLoading ? "Transmitting fresh buffer..." : "Didn't receive a sequence? Resend"}
        </button>
      </div>
    </form>
  )
}