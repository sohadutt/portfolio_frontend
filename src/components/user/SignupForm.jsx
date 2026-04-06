import { useState } from "react"
import { registerUser } from "@/helper/functions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await registerUser(formData)
      toast.success("Account created! Please check your email for the OTP.")
      // Optional: Add routing to OTP page here
    } catch (err) {
      toast.error(err.message || "Failed to create account.")
    } finally {
      setLoading(false)
    }
  }

  return (
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
        />
      </div>
      <Button type="submit" className="w-full font-semibold mt-2" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground mt-4">
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
  )
}