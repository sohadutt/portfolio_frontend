import { useState } from "react"
import { resetPassword } from "@/helper/functions" // Adjust import to where your api functions are
import { toast } from "sonner"
import { Loader2, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordForm({ email, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ otp: "", new_password: "" })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await resetPassword({ 
        email, 
        otp: formData.otp, 
        new_password: formData.new_password 
      })
      toast.success("Password reset successfully! You can now log in.")
      onSuccess() // Shifts the view back to login
    } catch (error) {
      toast.error(error.message || "Invalid OTP or request failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="reset-otp">6-Digit Reset Code</Label>
        <Input 
          id="reset-otp" 
          name="otp" 
          type="text" 
          placeholder="123456" 
          required 
          maxLength={6}
          value={formData.otp}
          onChange={handleChange}
          className="rounded-xl bg-muted/20 h-11 text-center tracking-widest text-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input 
          id="new-password" 
          name="new_password" 
          type="password" 
          placeholder="Enter new password" 
          required 
          minLength={8}
          value={formData.new_password}
          onChange={handleChange}
          className="rounded-xl bg-muted/20 h-11"
        />
      </div>

      <Button 
        type="submit" 
        className="mt-4 w-full rounded-full font-medium shadow-none h-11" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Resetting...
          </>
        ) : (
          <>
            Confirm New Password
            <CheckCircle2 className="ml-2 size-4" />
          </>
        )}
      </Button>
    </form>
  )
}