import { useState } from "react"
import { loginUser } from "@/helper/functions"
import { toast } from "sonner"
import { Loader2, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await loginUser(formData)
      toast.success("Welcome back!")
      window.location.href = "/dashboard"
    } catch (err) {
      toast.error(err.message || "Failed to login. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
        </div>
        <Input 
          id="login-password" 
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
  )
}