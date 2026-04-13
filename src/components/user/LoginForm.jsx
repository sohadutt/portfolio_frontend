import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "@/helper/functions"
import { toast } from "sonner"
import { Loader2, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm({ redirectTo = "/dashboard" }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await loginUser(formData)
      toast.success("Welcome back!")
      navigate(redirectTo, { replace: true })
    } catch (err) {
      toast.error(err.message || "Failed to login. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
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
          className="rounded-xl bg-muted/20"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          {/* Added the missing "Forgot password" link! */}
          <Link 
            to="/forgot-password" 
            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <Input 
          id="login-password" 
          name="password" 
          type="password" 
          required 
          value={formData.password}
          onChange={handleChange}
          className="rounded-xl bg-muted/20"
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
