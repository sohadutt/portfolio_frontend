import { useState } from "react"
import { resetPassword } from "@/helper/functions"
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
      toast.success("Security credentials updated successfully.")
      onSuccess() // Shifts the view back to login
    } catch (error) {
      toast.error(error.message || "Invalid verification code or request expired.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2.5">
        <Label htmlFor="reset-otp" className="text-sm font-medium tracking-wide text-foreground/90">
          6-Digit Verification Code
        </Label>
        <Input 
          id="reset-otp" 
          name="otp" 
          type="text" 
          placeholder="000000" 
          required 
          maxLength={6}
          value={formData.otp}
          onChange={handleChange}
          className="h-12 rounded-xl border-border/40 bg-card/40 text-center text-xl font-light tracking-[0.5em] backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:border-primary focus-visible:bg-card/60 focus-visible:ring-1 focus-visible:ring-primary/40 shadow-none"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="new-password" className="text-sm font-medium tracking-wide text-foreground/90">
          New Security Password
        </Label>
        <Input 
          id="new-password" 
          name="new_password" 
          type="password" 
          placeholder="••••••••" 
          required 
          minLength={8}
          value={formData.new_password}
          onChange={handleChange}
          className="h-12 rounded-xl border-border/40 bg-card/40 font-light backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:border-primary focus-visible:bg-card/60 focus-visible:ring-1 focus-visible:ring-primary/40 shadow-none"
        />
        <p className="px-1 text-[11px] font-light leading-relaxed text-muted-foreground">
          Minimum 8 characters required. Ensure your new password is distinct from previous versions.
        </p>
      </div>

      <Button 
        type="submit" 
        size="lg"
        className="mt-2 h-12 w-full rounded-full font-medium transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_20px_0_color-mix(in_oklch,var(--primary)_40%,transparent)] shadow-none" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Updating...
          </>
        ) : (
          <>
            Confirm Update
            <CheckCircle2 className="ml-2 size-5" />
          </>
        )}
      </Button>
    </form>
  )
}