import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { requestOTP, registerUser, verifyOTP } from "@/helper/functions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"

export default function SignupForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [otpOpen, setOtpOpen] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await registerUser(formData)
      setOtpValue("")
      setOtpOpen(true)
      toast.success("Account created. Enter the OTP sent to your email.")
    } catch (err) {
      toast.error(err.message || "Failed to create account.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()

    if (otpValue.length !== 6) {
      toast.error("Enter the 6-digit OTP to continue.")
      return
    }

    setOtpLoading(true)

    try {
      await verifyOTP(formData.email, otpValue)
      setOtpOpen(false)
      toast.success("Account verified successfully.")
      navigate("/dashboard", { replace: true })
    } catch (err) {
      toast.error(err.message || "Failed to verify OTP.")
    } finally {
      setOtpLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setResendLoading(true)

    try {
      await requestOTP(formData.email)
      toast.success("A fresh OTP has been sent.")
    } catch (err) {
      toast.error(err.message || "Could not resend OTP.")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder="hello@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Create Password</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="rounded-xl"
          />
        </div>
        <Button type="submit" className="mt-2 w-full rounded-full font-medium shadow-none" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          By clicking create account, you agree to our{" "}
          <a href="/terms" className="underline underline-offset-4 hover:text-foreground">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline underline-offset-4 hover:text-foreground">
            Privacy Policy
          </a>
          .
        </p>
      </form>

      <Dialog open={otpOpen} onOpenChange={(open) => !otpLoading && setOtpOpen(open)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Verify your account</DialogTitle>
            <DialogDescription>
              Enter the 6-digit OTP sent to {formData.email} to finish setup and continue to the dashboard.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={setOtpValue}
                containerClassName="justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full sm:w-auto"
                disabled={otpLoading || resendLoading}
                onClick={handleResendOtp}
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend OTP"
                )}
              </Button>
              <Button type="submit" className="w-full rounded-full font-medium shadow-none sm:w-auto" disabled={otpLoading}>
                {otpLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
