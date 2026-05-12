import { useState } from "react"
import { forgotPassword } from "@/helper/functions"
import { toast } from "sonner"
import { Loader2, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordForm({ onOtpSent }) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      await forgotPassword(email)
      toast.success("Recovery protocol initiated. Check your inbox.")
      onOtpSent(email) // Shift the view to the reset password form
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2.5">
        <Label htmlFor="reset-email" className="text-sm font-medium tracking-wide text-foreground/90">
          Email Address
        </Label>
        <Input 
          id="reset-email" 
          name="email" 
          type="email" 
          placeholder="hello@example.com" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 rounded-xl border-border/40 bg-card/40 font-light backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:border-primary focus-visible:bg-card/60 focus-visible:ring-1 focus-visible:ring-primary/40 shadow-none"
          disabled={loading}
        />
        <p className="px-1 text-[11px] font-light leading-relaxed text-muted-foreground">
          We will send a unique 6-digit verification code to this address if it is indexed in our system.
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
            Transmitting...
          </>
        ) : (
          <>
            Send Reset Code
            <ArrowRight className="ml-2 size-5" />
          </>
        )}
      </Button>
    </form>
  )
}