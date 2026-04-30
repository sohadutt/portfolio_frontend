import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser, loginWithGoogle } from "@/helper/functions"
import { toast } from "sonner"
import { Loader2, ArrowRight } from "lucide-react"

// 1. Import the custom hook instead of the component
import { useGoogleLogin } from '@react-oauth/google'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export default function LoginForm({ redirectTo = "/dashboard", onRequireVerification, onForgotPassword }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // --- STANDARD EMAIL/PASSWORD LOGIN ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await loginUser(formData)
      toast.success("Welcome back!")
      navigate(redirectTo, { replace: true })
    } catch (error) {
      if (error.status === 403 || (error.message && (error.message.toLowerCase().includes("verify") || error.message.toLowerCase().includes("inactive")))) {
        toast.warning("Please verify your email to continue.")
        if (onRequireVerification) {
          onRequireVerification(formData.email)
        }
      } else if (error.status === 401 || error.status === 400) {
        toast.error("Incorrect email or password.")
      } else {
        toast.error(error.message || "Failed to log in. Please check your credentials.")
      }
    } finally {
      setLoading(false)
    }
  }

  // --- CUSTOM SHADCN GOOGLE SIGN-IN ---
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        // useGoogleLogin returns an access_token instead of an ID token
        await loginWithGoogle(tokenResponse.access_token);
        toast.success("Logged in with Google!");
        navigate(redirectTo, { replace: true });
      } catch (error) {
         console.error("Google Login Error:", error);
         toast.error("Failed to log in with Google. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Google Sign-In popup closed or failed.");
    }
  });

  return (
    <div className="space-y-6">
      
      {/* --- STANDARD FORM --- */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input 
            id="login-email" 
            name="email" 
            type="email" 
            placeholder="hello@example.com" 
            required 
            value={formData.email}
            onChange={handleChange}
            className="rounded-xl bg-muted/20 h-11"
            disabled={loading || googleLoading}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            <button 
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              disabled={loading || googleLoading}
            >
              Forgot password?
            </button>
          </div>
          <Input 
            id="login-password" 
            name="password" 
            type="password" 
            required 
            value={formData.password}
            onChange={handleChange}
            className="rounded-xl bg-muted/20 h-11"
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
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </form>

      {/* --- DIVIDER --- */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or sign in with
          </span>
        </div>
      </div>

      {/* --- SHADCN NATIVE GOOGLE BUTTON --- */}
      <Button
        type="button"
        variant="outline"
        className="w-full rounded-xl h-11 font-medium shadow-none"
        onClick={() => triggerGoogleLogin()}
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
  )
}