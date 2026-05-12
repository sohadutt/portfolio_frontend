import { useState, createElement } from 'react'
import { useParams } from 'react-router-dom'
import { submitContactForm, resolveIcon } from '@/helper/functions'
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
  FieldContent,
} from '@/components/ui/field'
import { Loader2 } from 'lucide-react'

export function ContactSection({ data = {}, isScrolling }) {
  const { token } = useParams() 
  const [activeMethod, setActiveMethod] = useState(null)
  
  // Safely extract data from the API payload
  const sectionCopy = data.sectionCopy || data.section_copy || {}
  const contactCopy = sectionCopy.contact || {}
  
  const rawMethods = data.contactMethods || data.contact_methods || []
  const contactMethods = Array.isArray(rawMethods) ? rawMethods : []
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    priority: "0", 
    message: "",
    for_work: false, 
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
      if (err?.details && typeof err.details === 'object') {
        setErrors(err.details)
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
      {/* Left Panel: Contact Methods */}
      <div className="cinematic-panel-strong relative overflow-hidden rounded-[2.5rem] p-8 shadow-xl shadow-background/50">
        {/* Subtle Ambient Glow */}
        <div className="absolute -left-20 top-10 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <SectionHeader
            eyebrow={contactCopy.eyebrow || "Contact"}
            title={contactCopy.title || "Let's build reliable, product-focused systems."}
            description={contactCopy.description || "Reach out for backend automation, Django and API work, or frontend implementation with React and Tailwind CSS."}
          />
          <div className="mt-10 space-y-4">
            {contactMethods.map(({ label, value, href, icon, icon_name }, index) => {
              const IconComponent = resolveIcon(icon || icon_name || "Mail")
              const isActive = activeMethod === index

              return (
                <a
                  key={label || index}
                  href={href || '#contact'}
                  className={`group flex items-center justify-between rounded-2xl border px-6 py-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive
                      ? 'border-primary/40 bg-primary/10 shadow-[0_0_20px_0_color-mix(in_oklch,var(--primary)_15%,transparent)]'
                      : `border-border/30 bg-card/20 backdrop-blur-sm ${isScrolling ? '' : 'hover:border-primary/30 hover:bg-card/40'}`
                  }`}
                  onMouseEnter={() => !isScrolling && setActiveMethod(index)}
                  onMouseLeave={() => !isScrolling && setActiveMethod(null)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex size-12 items-center justify-center rounded-2xl border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive 
                        ? "bg-primary text-primary-foreground border-primary scale-110 shadow-[0_0_15px_rgba(var(--primary),0.3)]" 
                        : "bg-card/40 text-primary border-border/40 group-hover:scale-110"
                    }`}>
                      {createElement(IconComponent, { className: "size-5" })}
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        {label}
                      </p>
                      <p className="mt-1.5 text-base font-medium tracking-tight text-foreground">
                        {value}
                      </p>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className={`cinematic-panel relative rounded-[2.5rem] p-8 shadow-xl transition-all duration-500 ${isScrolling ? '' : 'hover:border-primary/30 hover:shadow-[0_0_40px_0_color-mix(in_oklch,var(--primary)_5%,transparent)]'}`}>
        <form onSubmit={handleSubmit} className="relative z-10 flex h-full flex-col justify-between">
          <FieldGroup className="grid gap-6 sm:grid-cols-2">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name" className="text-sm font-medium tracking-wide">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="h-12 rounded-xl border-border/40 bg-card/30 px-4 text-base backdrop-blur-sm transition-all duration-500 focus-visible:border-primary focus-visible:bg-card/50 focus-visible:ring-1 focus-visible:ring-primary/40 shadow-none"
                placeholder={"Your name"}
                required
              />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email" className="text-sm font-medium tracking-wide">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="h-12 rounded-xl border-border/40 bg-card/30 px-4 text-base backdrop-blur-sm transition-all duration-500 focus-visible:border-primary focus-visible:bg-card/50 focus-visible:ring-1 focus-visible:ring-primary/40 shadow-none"
                placeholder={"hello@example.com"}
                required
              />
              {errors.email && <FieldError>{errors.email}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="phone" className="text-sm font-medium tracking-wide">Phone (Optional)</FieldLabel>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="h-12 rounded-xl border-border/40 bg-card/30 px-4 text-base backdrop-blur-sm transition-all duration-500 focus-visible:border-primary focus-visible:bg-card/50 focus-visible:ring-1 focus-visible:ring-primary/40 shadow-none"
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && <FieldError>{errors.phone}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.priority}>
              <FieldLabel htmlFor="priority" className="text-sm font-medium tracking-wide">Urgency</FieldLabel>
              <Select value={formData.priority} onValueChange={handleSelectChange}>
                <SelectTrigger id="priority" className="h-12 rounded-xl border-border/40 bg-card/30 px-4 text-base backdrop-blur-sm transition-all duration-500 focus:border-primary focus:bg-card/50 focus:ring-1 focus:ring-primary/40 shadow-none">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="border-border/40 bg-background/95 backdrop-blur-md">
                  <SelectItem value="0">Low</SelectItem>
                  <SelectItem value="1">Medium</SelectItem>
                  <SelectItem value="2">High</SelectItem>
                  <SelectItem value="3">Urgent</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <FieldError>{errors.priority}</FieldError>}
            </Field>

            <Field className="sm:col-span-2" data-invalid={!!errors.message}>
              <FieldLabel htmlFor="message" className="text-sm font-medium tracking-wide">Message</FieldLabel>
              <Textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="resize-none rounded-2xl border-border/40 bg-card/30 px-4 py-4 text-base backdrop-blur-sm transition-all duration-500 focus-visible:border-primary focus-visible:bg-card/50 focus-visible:ring-1 focus-visible:ring-primary/40 shadow-none"
                placeholder="Share the details of your project or inquiry."
                required
              />
              {errors.message && <FieldError>{errors.message}</FieldError>}
            </Field>

            <Field orientation="horizontal" className="mt-2 sm:col-span-2">
              <Checkbox 
                id="for_work" 
                checked={formData.for_work} 
                onCheckedChange={handleCheckboxChange} 
                className="border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <FieldContent>
                <FieldLabel 
                  htmlFor="for_work" 
                  className="cursor-pointer text-sm font-light leading-relaxed text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This inquiry is regarding a paid project, role, or collaboration.
                </FieldLabel>
              </FieldContent>
            </Field>
          </FieldGroup>

          <Button 
            type="submit" 
            size="lg"
            disabled={loading}
            className="mt-10 h-14 w-full rounded-full px-8 text-base font-medium shadow-none transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_20px_0_color-mix(in_oklch,var(--primary)_40%,transparent)] sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </div>
    </section>
  )
}