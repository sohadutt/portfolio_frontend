import { useState, createElement } from 'react'
import { useParams } from 'react-router-dom'
import { submitContactForm, resolveIcon } from '@/helper/functions' // Use resolveIcon from functions
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
  const personalInfo = data.personalInfo || {}
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
      <div className="rounded-[2rem] border border-border/60 bg-background/95 p-8 shadow-sm">
        <SectionHeader
          eyebrow={contactCopy.eyebrow || "Contact"}
          title={contactCopy.title || "Let's build reliable, product-focused systems."}
          description={contactCopy.description || "Reach out for backend automation, Django and API work, or frontend implementation with React and Tailwind CSS."}
        />
        <div className="mt-8 space-y-3">
          {contactMethods.map(({ label, value, href, icon, icon_name }, index) => {
            // Dynamically resolve the icon string from the backend
            const IconComponent = resolveIcon(icon || icon_name || "Mail")
            const isActive = activeMethod === index

            return (
              <a
                key={label || index}
                href={href || '#contact'}
                className={`group flex items-center justify-between rounded-[1.4rem] border px-5 py-4 transition-all duration-300 ${
                  isActive
                    ? 'border-primary/30 bg-primary/6'
                    : `border-border/60 bg-background ${isScrolling ? '' : 'hover:border-primary/20 hover:bg-muted/40'}`
                }`}
                onMouseEnter={() => !isScrolling && setActiveMethod(index)}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex size-10 items-center justify-center rounded-2xl transition-transform duration-300 ${
                    isActive ? "bg-primary/20 text-primary scale-110" : "bg-muted text-primary group-hover:scale-110"
                  }`}>
                    {createElement(IconComponent, { className: "size-4" })}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-1.5 text-sm font-medium leading-none text-foreground">
                      {value}
                    </p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>

      <div className={`rounded-[2rem] border border-border/60 bg-background/95 p-8 shadow-sm transition-colors duration-300 ${isScrolling ? '' : 'hover:border-primary/20 hover:bg-muted/30'}`}>
        <form onSubmit={handleSubmit} className="flex h-full flex-col justify-between">
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="rounded-2xl border-border bg-background px-4 py-5 text-sm transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
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
                className="rounded-2xl border-border bg-background px-4 py-5 text-sm transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
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
                className="rounded-2xl border-border bg-background px-4 py-5 text-sm transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && <FieldError>{errors.phone}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.priority}>
              <FieldLabel htmlFor="priority">Urgency</FieldLabel>
              <Select value={formData.priority} onValueChange={handleSelectChange}>
                <SelectTrigger id="priority" className="h-[42px] rounded-2xl border-border bg-background px-4 py-5 text-sm transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10">
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
                className="resize-none rounded-[1.5rem] border-border bg-background px-4 py-3 text-sm transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
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
              />
              <FieldContent>
                <FieldLabel 
                  htmlFor="for_work" 
                  className="cursor-pointer text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This inquiry is regarding a paid project, role, or collaboration.
                </FieldLabel>
              </FieldContent>
            </Field>
          </FieldGroup>

          <Button 
            type="submit" 
            disabled={loading}
            className="mt-8 w-full rounded-full px-6 font-medium shadow-none sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
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