import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"

// 1. Import the custom hook
import { useGoogleLogin } from '@react-oauth/google'

import { requestOTP, registerUser, verifyOTP, loginWithGoogle } from "@/helper/functions"
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

// Custom SVG that behaves exactly like a Lucide icon (inherits theme text color)
const GoogleIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

export default function SignupForm({ redirectTo = "/dashboard" }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [otpOpen, setOtpOpen] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // --- CUSTOM SHADCN GOOGLE SIGN-UP ---
  const triggerGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        // useGoogleLogin returns an access_token
        await loginWithGoogle(tokenResponse.access_token);
        toast.success("Account created and verified with Google!");
        navigate(redirectTo, { replace: true });
      } catch (error) {
         console.error("Google Signup Error:", error);
         toast.error("Failed to sign up with Google. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Google Sign-Up popup closed or failed.");
    }
  });

  // --- STANDARD EMAIL/PASSWORD REGISTRATION ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await registerUser(formData)
      setOtpValue("")
      setOtpOpen(true)
      toast.success("Account created. Enter the OTP sent to your email.")
    } catch (err) {
      if (err.status === 400) {
        setOtpValue("")
        setOtpOpen(true)
        toast.info("Account requires verification. Please check your email for the code.")
      } else {
        toast.error(err.message || "Failed to create account.")
      }
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
      navigate(redirectTo, { replace: true })
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
      <div className="space-y-6">
        
        {/* --- STANDARD FORM --- */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
              className="rounded-xl h-11 bg-muted/20"
              disabled={loading || googleLoading}
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
              className="rounded-xl h-11 bg-muted/20"
              disabled={loading || googleLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="mt-6 w-full rounded-full font-medium shadow-none h-11" 
            disabled={loading || googleLoading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 size-4" />
              </>
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

        {/* --- DIVIDER --- */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or register with
            </span>
          </div>
        </div>

        {/* --- SHADCN NATIVE GOOGLE BUTTON --- */}
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl h-11 font-medium shadow-none"
          onClick={() => triggerGoogleSignup()}
          disabled={loading || googleLoading}
        >
          {googleLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <GoogleIcon className="mr-2 size-4" />
          )}
          Google
        </Button>

      </div>

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
                className="w-full rounded-full sm:w-auto h-11"
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
              <Button type="submit" className="w-full rounded-full font-medium shadow-none sm:w-auto h-11" disabled={otpLoading}>
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