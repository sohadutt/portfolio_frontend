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
      toast.success("If an account exists, a reset code has been sent.")
      onOtpSent(email) // Shift the view to the reset password form
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email Address</Label>
        <Input 
          id="reset-email" 
          name="email" 
          type="email" 
          placeholder="hello@example.com" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            Sending code...
          </>
        ) : (
          <>
            Send Reset Code
            <ArrowRight className="ml-2 size-4" />
          </>
        )}
      </Button>
    </form>
  )
}