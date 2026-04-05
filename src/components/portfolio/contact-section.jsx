import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { contactMethods, personalInfo } from '@/helper/portfolio'
import { submitContactForm } from '@/helper/functions'
import { toast } from 'sonner'

// UI Components
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/portfolio/section-header'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
  FieldContent,
} from '@/components/ui/field'
import { Loader2 } from 'lucide-react'

export function ContactSection({ isScrolling }) {
  const { token } = useParams() 
  const [activeMethod, setActiveMethod] = useState(null)
  const resolvedMethod = activeMethod
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    priority: "0", // Default to Priority.LOW (0) as per Django model
    message: "",
    for_work: false, // Default to false as per Django model
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, priority: value }))
    if (errors.priority) setErrors((prev) => ({ ...prev, priority: null }))
  }

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({ ...prev, for_work: checked }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Ensure priority is sent as an integer
      const payload = {
        ...formData,
        priority: parseInt(formData.priority, 10)
      }

      await submitContactForm(payload, token)
      toast.success("Message sent successfully!")
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        priority: "0", 
        message: "",
        for_work: false,
      })
    } catch (err) {
      if (typeof err === 'object' && err !== null) {
        setErrors(err)
        toast.error("Please fix the errors in the form.")
      } else {
        toast.error(err.message || err || "Failed to send message.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      {/* Left Column: Contact Methods */}
      <div className="rounded-[2rem] border border-border/60 bg-primary p-8 text-primary-foreground shadow-[0_30px_80px_-40px_rgba(225,98,54,0.9)]">
        <SectionHeader
          eyebrow="Contact"
          title="Open to roles and collaborations where backend reliability meets strong product thinking."
          description="Reach out for backend automation, Django and API work, or frontend implementation with React and Tailwind CSS."
        />
        <div className="mt-8 space-y-3">
          {contactMethods.map(({ label, value, href, icon }) => {
            const Icon = icon
            const isActive = resolvedMethod === label

            return (
              <a
                key={label}
                href={href}
                className={`flex items-center justify-between rounded-[1.4rem] border px-5 py-4 transition-all duration-300 ${
                  isActive
                    ? 'border-primary-foreground/35 bg-primary-foreground/18 shadow-[0_18px_55px_-35px_rgba(255,255,255,0.55)]'
                    : `border-primary-foreground/15 bg-primary-foreground/8 ${isScrolling ? '' : 'hover:-translate-y-0.5 hover:bg-primary-foreground/12'}`
                }`}
                onMouseEnter={() => !isScrolling && setActiveMethod(label)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-primary-foreground/12">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">{label}</p>
                    <p className="text-sm">{value}</p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>

      {/* Right Column: Contact Form */}
      <div className={`rounded-[2rem] border border-border/60 bg-card/75 p-8 backdrop-blur transition-colors duration-300 ${isScrolling ? '' : 'hover:border-primary/35 hover:bg-primary/5'}`}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="rounded-2xl border-border bg-background px-4 py-5 text-sm transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder={personalInfo.name || "Your name"}
                required
              />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-2xl border-border bg-background px-4 py-5 text-sm transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder={personalInfo.email || "hello@example.com"}
                required
              />
              {errors.email && <FieldError>{errors.email}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="phone">Phone (Optional)</FieldLabel>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="rounded-2xl border-border bg-background px-4 py-5 text-sm transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && <FieldError>{errors.phone}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.priority}>
              <FieldLabel htmlFor="priority">Urgency</FieldLabel>
              <Select value={formData.priority} onValueChange={handleSelectChange}>
                <SelectTrigger id="priority" className="rounded-2xl border-border bg-background px-4 py-5 text-sm transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 h-[42px]">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Low</SelectItem>
                  <SelectItem value="1">Medium</SelectItem>
                  <SelectItem value="2">High</SelectItem>
                  <SelectItem value="3">Urgent</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <FieldError>{errors.priority}</FieldError>}
            </Field>

            <Field className="sm:col-span-2" data-invalid={!!errors.message}>
              <FieldLabel htmlFor="message">Message</FieldLabel>
              <Textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="rounded-[1.5rem] border-border bg-background px-4 py-3 text-sm transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Share the details of your project or inquiry."
                required
              />
              {errors.message && <FieldError>{errors.message}</FieldError>}
            </Field>

            <Field orientation="horizontal" className="sm:col-span-2 mt-2">
              <Checkbox 
                id="for_work" 
                checked={formData.for_work} 
                onCheckedChange={handleCheckboxChange} 
              />
              <FieldContent>
                <FieldLabel htmlFor="for_work" className="font-normal cursor-pointer">
                  This inquiry is regarding a paid project, role, or collaboration.
                </FieldLabel>
              </FieldContent>
            </Field>

          </FieldGroup>

          {/* Footer / Submit Area */}
          <div className={`mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-border/60 bg-background/70 px-4 py-4 transition-colors duration-300 ${isScrolling ? '' : 'hover:border-primary/35 hover:bg-primary/6'}`}>
            <label className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="relative inline-flex h-7 w-12 items-center rounded-full bg-muted p-1">
                <span className="size-5 rounded-full bg-primary transition-transform duration-300" />
              </span>
              Available for backend and frontend work
            </label>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="rounded-full px-8 font-semibold shadow-lg transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}