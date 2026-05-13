import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react"
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

// Custom SVG that behaves exactly like a Lucide icon
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

  const triggerGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        await loginWithGoogle(tokenResponse.access_token);
        toast.success("Account verified via Google Cloud.");
        navigate(redirectTo, { replace: true });
      } catch (error) {
         console.error("Google Signup Error:", error);
         toast.error("Cloud verification failed. Please retry.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Verification sequence aborted.");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await registerUser(formData)
      setOtpValue("")
      setOtpOpen(true)
      toast.success("Identity profile created. Verification required.");
    } catch (err) {
      if (err.status === 400) {
        setOtpValue("")
        setOtpOpen(true)
        toast.info("Pending verification. Check your secure inbox.");
      } else {
        toast.error(err.message || "Initialization failed.");
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otpValue.length !== 6) return
    setOtpLoading(true)

    try {
      await verifyOTP(formData.email, otpValue)
      setOtpOpen(false)
      toast.success("Authentication sequence complete.");
      navigate(redirectTo, { replace: true })
    } catch (err) {
      toast.error(err.message || "Invalid credentials buffer.");
    } finally {
      setOtpLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setResendLoading(true)
    try {
      await requestOTP(formData.email)
      toast.success("New verification buffer transmitted.");
    } catch (err) {
      toast.error(err.message || "Transmission failed.");
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-7">
        
        {/* --- CINEMATIC FORM --- */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-sm font-medium tracking-wide text-foreground/90">
              Email Address
            </Label>
            <Input
              id="signup-email"
              name="email"
              type="email"
              placeholder="hello@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="h-12 rounded-xl border-border/40 bg-card/40 font-light backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:border-primary focus-visible:bg-card/60 focus-visible:ring-1 focus-visible:ring-primary/40 shadow-none"
              disabled={loading || googleLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-sm font-medium tracking-wide text-foreground/90">
              Secure Password
            </Label>
            <Input
              id="signup-password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="h-12 rounded-xl border-border/40 bg-card/40 font-light backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:border-primary focus-visible:bg-card/60 focus-visible:ring-1 focus-visible:ring-primary/40 shadow-none"
              disabled={loading || googleLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="mt-6 h-12 w-full rounded-full font-medium transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_20px_0_color-mix(in_oklch,var(--primary)_40%,transparent)] shadow-none" 
            disabled={loading || googleLoading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 size-5" />
              </>
            )}
          </Button>

          <p className="mt-4 text-center text-[11px] font-light leading-relaxed text-muted-foreground">
            By initializing account creation, you consent to our{" "}
            <a href="/terms" className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">
              Terms of Protocol
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">
              Privacy Framework
            </a>
            .
          </p>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/40" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-medium">
            <span className="bg-background px-3 text-muted-foreground">
              Secondary Auth
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-12 w-full rounded-full border border-border/50 bg-card/30 font-medium backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:bg-primary/10 hover:text-primary shadow-none"
          onClick={() => triggerGoogleSignup()}
          disabled={loading || googleLoading}
        >
          {googleLoading ? (
            <Loader2 className="mr-2 size-5 animate-spin" />
          ) : (
            <GoogleIcon className="mr-2 size-5" />
          )}
          Google Sign-up
        </Button>

      </div>

      {/* --- CINEMATIC OTP DIALOG --- */}
      <Dialog open={otpOpen} onOpenChange={(open) => !otpLoading && setOtpOpen(open)}>
        <DialogContent className="sm:max-w-md border-border/30 bg-background/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-8">
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary mb-2">
              <ShieldCheck className="size-7" />
            </div>
            <DialogTitle className="text-center text-2xl font-medium tracking-tight">Verify Protocol</DialogTitle>
            <DialogDescription className="text-center font-light leading-relaxed">
              Enter the 6-digit buffer sent to <span className="text-foreground font-medium">{formData.email}</span> to synchronize your account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleVerifyOtp} className="mt-4 space-y-8">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={setOtpValue}
                containerClassName="justify-center"
              >
                <InputOTPGroup className="gap-2 sm:gap-3">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <InputOTPSlot 
                      key={idx} 
                      index={idx} 
                      className="size-11 sm:size-12 rounded-xl border-border/40 bg-card/30 text-xl font-light backdrop-blur-md focus:border-primary focus:ring-1 focus:ring-primary/40" 
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-full border-border/50 bg-card/30 font-medium transition-all duration-300 hover:bg-card/50 sm:w-auto"
                disabled={otpLoading || resendLoading}
                onClick={handleResendOtp}
              >
                {resendLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Resend Buffer"
                )}
              </Button>
              <Button 
                type="submit" 
                className="h-11 w-full rounded-full font-medium transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] shadow-none sm:w-auto px-8" 
                disabled={otpLoading}
              >
                {otpLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Verify Access"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}