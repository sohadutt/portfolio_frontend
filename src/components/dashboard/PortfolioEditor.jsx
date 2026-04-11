import { createElement, useCallback, useEffect, useState } from "react"
import {
  FileText,
  Globe,
  LayoutTemplate,
  Link2,
  Loader2,
  Plus,
  Save,
  Settings2,
  Sparkles,
  Trash2,
  User,
  Eye
} from "lucide-react"
import { toast } from "sonner"

import { createNewPortfolio, fetchDashboardPortfolios, fetchPortfolio, fetchPortfolioAuthenticated, updatePortfolio, resolveIcon } from "@/helper/functions"
import { initialFormState, templates } from "@/helper/dummy-portfolio" 
import { LucideIconPicker } from "@/components/dashboard/LucideIconPicker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

function joinList(list = []) {
  return Array.isArray(list) ? list.join(", ") : ""
}

function parseList(value = "") {
  return value.split(",").map((item) => item.trim()).filter(Boolean)
}

function ensureArray(value) {
  return Array.isArray(value) ? value : []
}

const extractList = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (Array.isArray(field.results)) return field.results;
  return [];
}

function EditorSection({ title, description, action, preview, children }) {
  return (
    <Card className="overflow-hidden border-border/60 bg-background shadow-sm mb-6 last:mb-0 rounded-[2rem]">
      <CardHeader className="border-b border-border/50 pb-6 bg-muted/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Editing Section</span>
            </div>
            <CardTitle className="text-2xl tracking-tight">{title}</CardTitle>
            {description ? <CardDescription className="text-base">{description}</CardDescription> : null}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {preview && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-4 py-2.5">
              <Eye className="size-4 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Preview</p>
            </div>
            <div className="p-6 sm:p-8">
              {preview}
            </div>
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  )
}

function ItemFrame({ title, subtitle, iconName, onRemove, children }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 mb-4 last:mb-0 transition-colors hover:border-primary/30">
      <div className="mb-4 flex items-start justify-between gap-4 border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {createElement(resolveIcon(iconName), { className: "size-4" })}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary/70 mb-0.5">Live Item Preview</p>
            <p className="text-sm font-medium text-foreground">{title || "Untitled"}</p>
            {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
          </div>
        </div>
        <Button type="button" variant="ghost" size="icon-sm" className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onRemove}>
          <Trash2 className="size-4" />
        </Button>
      </div>
      {children}
    </div>
  )
}

function IconField({ label, value, onChange }) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-sm">
          {createElement(resolveIcon(value), { className: "size-4 text-primary" })}
          <span className="text-muted-foreground">{value || "No icon selected"}</span>
        </div>
        <LucideIconPicker value={value} onChange={onChange} />
      </div>
    </Field>
  )
}

export default function PortfolioEditor({ portfolioIndex = 1 }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isNewPortfolio, setIsNewPortfolio] = useState(false)
  const [formData, setFormData] = useState(() => initialFormState(portfolioIndex))

  const loadPortfolioData = useCallback(async () => {
    try {
      setLoading(true)
      const portfolioListResponse = await fetchDashboardPortfolios()
      const existingPortfolio = (portfolioListResponse?.portfolios || []).find(
        (item) => Number(item.order_index) === Number(portfolioIndex)
      )

      if (!existingPortfolio) {
        setIsNewPortfolio(true)
        setFormData(initialFormState(portfolioIndex))
        return
      }

      setIsNewPortfolio(false)
      
      const fetchFn = fetchPortfolioAuthenticated || fetchPortfolio;
      const response = await (fetchPortfolioAuthenticated ? fetchFn(portfolioIndex) : fetchFn(null, portfolioIndex))
      
      const apiData = response?.data || response

      if (apiData) {
        setFormData((current) => ({
          ...current,
          isEnabled: apiData.isEnabled ?? apiData.is_enabled ?? current.isEnabled,
          orderIndex: apiData.orderIndex ?? apiData.order_index ?? apiData.new_order_index ?? current.orderIndex,
          
          personalInfo: { ...current.personalInfo, ...(apiData.personalInfo || {}) },
          heroContent: { ...current.heroContent, ...(apiData.heroContent || {}) },
          aboutContent: { ...current.aboutContent, ...(apiData.aboutContent || {}) },
          
          heroActions: { ...current.heroActions, ...(apiData.heroActions || apiData.hero_actions || {}) },
          heroFocus: { 
            ...current.heroFocus, 
            ...(apiData.heroFocus || apiData.hero_focus || {}),
            areas: extractList((apiData.heroFocus || apiData.hero_focus)?.areas).map(item => ({ 
              ...item, icon: item.icon || item.iconName || item.icon_name || "Sparkles" 
            }))
          },
          sectionCopy: {
            projects: { ...current.sectionCopy.projects, ...((apiData.sectionCopy || apiData.section_copy)?.projects || {}) },
            experience: { ...current.sectionCopy.experience, ...((apiData.sectionCopy || apiData.section_copy)?.experience || {}) },
            components: { ...current.sectionCopy.components, ...((apiData.sectionCopy || apiData.section_copy)?.components || {}) },
            contact: { ...current.sectionCopy.contact, ...((apiData.sectionCopy || apiData.section_copy)?.contact || {}) },
          },
          pageCopy: { ...current.pageCopy, ...(apiData.pageCopy || apiData.page_copy || {}) },

          heroBadges: extractList(apiData.heroBadges || apiData.hero_badges),
          heroHighlights: extractList(apiData.heroHighlights || apiData.hero_highlights).map(item => ({ 
            ...item, icon: item.icon || item.iconName || item.icon_name || "FileText" 
          })),
          heroMetrics: extractList(apiData.heroMetrics || apiData.hero_metrics).map(item => ({ 
            ...item, icon: item.icon || item.iconName || item.icon_name || "Sparkles" 
          })),
          skillGroups: extractList(apiData.skillGroups || apiData.skill_groups).map(item => ({ 
            ...item, icon: item.icon || item.iconName || item.icon_name || "Sparkles" 
          })),
          projects: extractList(apiData.projects).map(item => ({ 
            ...item, icon: item.icon || item.iconName || item.icon_name || "Globe" 
          })),
          experience: extractList(apiData.experience).map((item) => ({
            ...item,
            highlights: ensureArray(item.highlights),
            relatedComponents: ensureArray(item.relatedComponents || item.related_components),
            icon: item.icon || item.iconName || item.icon_name || "User"
          })),
          showcaseCategories: extractList(apiData.showcaseCategories || apiData.showcase_categories).map((item) => ({
            ...item,
            icon: item.icon || item.iconName || item.icon_name || "Component",
          })),
          featuredModules: extractList(apiData.featuredModules || apiData.featured_modules).map((item) => ({
            ...item,
            icon: item.icon || item.iconName || item.icon_name || "Blocks",
          })),
          contactMethods: extractList(apiData.contactMethods || apiData.contact_methods).map((item) => ({
            ...item,
            icon: item.icon || item.iconName || item.icon_name || "Mail",
          })),
          navigationLinks: extractList(apiData.navigationLinks || apiData.navigation_links).map(item => ({ 
            ...item, icon: item.icon || item.iconName || item.icon_name || "Link2" 
          })),
          footerLinks: extractList(apiData.footerLinks || apiData.footer_links).map(item => ({ 
            ...item, icon: item.icon || item.iconName || item.icon_name || "Globe" 
          })),
          statusPills: extractList(apiData.statusPills || apiData.status_pills).map((item) => ({
            ...item,
            icon: item.icon || item.iconName || item.icon_name || "Component",
          })),
        }))
      }
    } catch (error) {
      console.error("Portfolio Loading Error:", error)
      toast.error(error.message || "Failed to load portfolio data.")
    } finally {
      setLoading(false)
    }
  }, [portfolioIndex])

  useEffect(() => {
    loadPortfolioData()
  }, [loadPortfolioData])

  const handleNestedChange = (section, field, value) => {
    setFormData((current) => ({ ...current, [section]: { ...current[section], [field]: value } }))
  }

  const handleActionChange = (type, field, value) => {
    setFormData((current) => ({
      ...current,
      heroActions: { ...current.heroActions, [type]: { ...current.heroActions[type], [field]: value } }
    }))
  }

  const handleSectionCopyChange = (section, field, value) => {
    setFormData((current) => ({
      ...current,
      sectionCopy: { ...current.sectionCopy, [section]: { ...current.sectionCopy[section], [field]: value } }
    }))
  }

  const handleFocusAreaChange = (index, field, value) => {
    setFormData((current) => {
      const nextAreas = [...(current.heroFocus.areas || [])]
      nextAreas[index] = { ...nextAreas[index], [field]: value }
      return { ...current, heroFocus: { ...current.heroFocus, areas: nextAreas } }
    })
  }

  const addFocusArea = () => {
    setFormData((current) => ({
      ...current,
      heroFocus: { ...current.heroFocus, areas: [...(current.heroFocus.areas || []), { ...templates.heroFocusAreas }] }
    }))
  }

  const removeFocusArea = (index) => {
    setFormData((current) => ({
      ...current,
      heroFocus: { ...current.heroFocus, areas: current.heroFocus.areas.filter((_, i) => i !== index) }
    }))
  }

  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData((current) => {
      const nextItems = [...current[arrayName]]
      nextItems[index] = { ...nextItems[index], [field]: value }
      return { ...current, [arrayName]: nextItems }
    })
  }

  const handleArrayListChange = (arrayName, index, field, value) => {
    handleArrayChange(arrayName, index, field, parseList(value))
  }

  const addItem = (arrayName) => {
    setFormData((current) => ({
      ...current,
      [arrayName]: [...current[arrayName], { ...templates[arrayName] }],
    }))
  }

  const removeItem = (arrayName, index) => {
    setFormData((current) => ({
      ...current,
      [arrayName]: current[arrayName].filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const payload = {
        is_enabled: formData.isEnabled,
        new_order_index: formData.orderIndex,
        personalInfo: formData.personalInfo,
        heroContent: formData.heroContent,
        heroActions: formData.heroActions,
        heroFocus: formData.heroFocus,
        heroBadges: formData.heroBadges,
        heroHighlights: formData.heroHighlights,
        aboutContent: formData.aboutContent,
        sectionCopy: formData.sectionCopy,
        pageCopy: formData.pageCopy,
        navigationLinks: formData.navigationLinks,
        heroMetrics: formData.heroMetrics,
        skillGroups: formData.skillGroups,
        projects: formData.projects,
        showcaseCategories: formData.showcaseCategories,
        featuredModules: formData.featuredModules,
        contactMethods: formData.contactMethods,
        footerLinks: formData.footerLinks,
        statusPills: formData.statusPills,
        
        // AUTOMATIC MAPPING: Generates relatedComponents under the hood based on the relation tag
        experience: formData.experience.map(exp => {
          const matchingItems = formData.showcaseCategories
            .filter(cat => cat.relation === exp.relation)
            .flatMap(cat => Array.isArray(cat.items) ? cat.items : []);
            
          // Grab up to 4 unique components mapped to this relation
          const autoComponents = Array.from(new Set(matchingItems)).slice(0, 4);

          return {
            ...exp,
            relatedComponents: autoComponents,
            related_components: autoComponents // Sends snake_case as well just to be totally safe for Django
          }
        }),
      }

      if (isNewPortfolio) {
        const createdPortfolio = await createNewPortfolio(payload, portfolioIndex)
        setFormData((current) => ({
          ...current, ...createdPortfolio,
          orderIndex: createdPortfolio?.orderIndex ?? current.orderIndex,
          isEnabled: createdPortfolio?.isEnabled ?? current.isEnabled,
        }))
        setIsNewPortfolio(false)
        toast.success("Portfolio created successfully")
      } else {
        const updatedPortfolio = await updatePortfolio(payload, portfolioIndex)
        setFormData((current) => ({
          ...current, ...updatedPortfolio,
          orderIndex: updatedPortfolio?.orderIndex ?? current.orderIndex,
          isEnabled: updatedPortfolio?.isEnabled ?? current.isEnabled,
        }))
        toast.success("Portfolio updated successfully")
      }
    } catch (error) {
      toast.error(error.message || (isNewPortfolio ? "Failed to create portfolio" : "Failed to update portfolio"))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-3xl border border-border/60 bg-background shadow-sm">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading portfolio editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 pb-24">
      <Card className="rounded-3xl border-border/60 bg-background shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full">Portfolio #{portfolioIndex}</Badge>
                <Badge variant={formData.isEnabled ? "default" : "secondary"} className="rounded-full">
                  {formData.isEnabled ? "Live" : "Hidden"}
                </Badge>
                {isNewPortfolio ? <Badge variant="secondary" className="rounded-full">New</Badge> : null}
              </div>
              <CardTitle className="text-3xl tracking-tight">Edit portfolio</CardTitle>
              <CardDescription>
                Refine the public portfolio content with a quieter, cleaner editing workspace.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                <Switch checked={formData.isEnabled} onCheckedChange={(checked) => setFormData((current) => ({ ...current, isEnabled: checked }))} />
                <div>
                  <p className="text-sm font-medium">Public access</p>
                  <p className="text-xs text-muted-foreground">Control whether this portfolio is visible.</p>
                </div>
              </div>
              <Button onClick={handleSubmit} disabled={saving} className="rounded-full px-5 shadow-none">
                {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="identity" className="flex w-full flex-col gap-6">
        <div className="sticky top-[5.5rem] z-20 w-full mb-2">
          <div className="w-full overflow-x-auto rounded-3xl border border-border/60 bg-background p-2 shadow-sm">
            <TabsList
              variant="line"
              className="flex w-full gap-2 rounded-none border-0 bg-transparent p-0 shadow-none"
            >
              <TabsTrigger value="identity" className="flex-1 flex justify-center items-center rounded-2xl px-4 py-2.5">
                <User className="mr-2 size-4" /> Identity
              </TabsTrigger>
              <TabsTrigger value="content" className="flex-1 flex justify-center items-center rounded-2xl px-4 py-2.5">
                <LayoutTemplate className="mr-2 size-4" /> Content
              </TabsTrigger>
              <TabsTrigger value="sections" className="flex-1 flex justify-center items-center rounded-2xl px-4 py-2.5">
                <FileText className="mr-2 size-4" /> Sections
              </TabsTrigger>
              <TabsTrigger value="links" className="flex-1 flex justify-center items-center rounded-2xl px-4 py-2.5">
                <Link2 className="mr-2 size-4" /> Links
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 flex justify-center items-center rounded-2xl px-4 py-2.5">
                <Settings2 className="mr-2 size-4" /> Settings
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* --- IDENTITY TAB --- */}
        <TabsContent value="identity" className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm md:p-7">
          <EditorSection 
            title="Personal information" 
            description="Primary identity and profile metadata displayed throughout the portfolio."
            preview={
              <div className="flex flex-col items-center text-center space-y-3">
                <h2 className="text-3xl font-bold tracking-tight">{formData.personalInfo.name || "Your Name"}</h2>
                <div className="space-y-1">
                  <p className="text-lg font-medium text-primary">{formData.personalInfo.title || "Professional Title"}</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">{formData.personalInfo.subtitle || "Your subtitle describing your main skills..."}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium pt-2">
                  <span>{formData.personalInfo.location || "City, Country"}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>{formData.personalInfo.email || "hello@example.com"}</span>
                </div>
              </div>
            }
          >
            <FieldGroup className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <Field><FieldLabel>Full name</FieldLabel><Input value={formData.personalInfo.name} onChange={(e) => handleNestedChange("personalInfo", "name", e.target.value)} placeholder="e.g. Jane Doe" /></Field>
              <Field><FieldLabel>Short name</FieldLabel><Input value={formData.personalInfo.shortName} onChange={(e) => handleNestedChange("personalInfo", "shortName", e.target.value)} placeholder="e.g. jdoe" /></Field>
              <Field><FieldLabel>Professional title</FieldLabel><Input value={formData.personalInfo.title} onChange={(e) => handleNestedChange("personalInfo", "title", e.target.value)} placeholder="e.g. Full-stack Developer" /></Field>
              <Field><FieldLabel>Core Competency</FieldLabel><Input value={formData.personalInfo.subtitle} onChange={(e) => handleNestedChange("personalInfo", "subtitle", e.target.value)} placeholder="e.g. React, Python, PostgreSQL" /></Field>
              <Field><FieldLabel>Location</FieldLabel><Input value={formData.personalInfo.location} onChange={(e) => handleNestedChange("personalInfo", "location", e.target.value)} placeholder="e.g. New York, USA" /></Field>
              <Field><FieldLabel>Public email</FieldLabel><Input type="email" value={formData.personalInfo.email} onChange={(e) => handleNestedChange("personalInfo", "email", e.target.value)} placeholder="e.g. hello@example.com" /></Field>
              <Field><FieldLabel>GitHub/Portfolio URL</FieldLabel><Input value={formData.personalInfo.github} onChange={(e) => handleNestedChange("personalInfo", "github", e.target.value)} placeholder="e.g. https://github.com/username" /></Field>
              <Field><FieldLabel>LinkedIn URL</FieldLabel><Input value={formData.personalInfo.linkedin} onChange={(e) => handleNestedChange("personalInfo", "linkedin", e.target.value)} placeholder="e.g. https://linkedin.com/in/username" /></Field>
            </FieldGroup>
          </EditorSection>
        </TabsContent>

        {/* --- CONTENT TAB --- */}
        <TabsContent value="content" className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm md:p-7">
          <EditorSection 
            title="Hero content" 
            description="Top-of-page messaging and headline copy."
            preview={
              <div className="space-y-4 max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">
                  {formData.heroContent.eyebrow || "Eyebrow Text"}
                </p>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl leading-[1.1]">
                  {formData.heroContent.title || "Your main hero headline goes here..."}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {formData.heroContent.description || "A descriptive paragraph explaining what you do and your core focus areas."}
                </p>
              </div>
            }
          >
            <FieldGroup>
              <Field><FieldLabel>Name</FieldLabel><Input value={formData.heroContent.eyebrow} onChange={(e) => handleNestedChange("heroContent", "eyebrow", e.target.value)} placeholder="e.g. Hello, I'm Jane" /></Field>
              <Field><FieldLabel>Title</FieldLabel><Textarea rows={3} value={formData.heroContent.title} onChange={(e) => handleNestedChange("heroContent", "title", e.target.value)} placeholder="e.g. I build scalable backend systems..." /></Field>
              <Field><FieldLabel>Description</FieldLabel><Textarea rows={5} value={formData.heroContent.description} onChange={(e) => handleNestedChange("heroContent", "description", e.target.value)} placeholder="e.g. I specialize in Python, Django, and React..." /></Field>
            </FieldGroup>
          </EditorSection>

          <EditorSection title="Hero actions" description="Call to action buttons rendered in the hero area.">
            <FieldGroup className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 space-y-4">
                <h4 className="text-sm font-semibold">Primary Action</h4>
                <Field><FieldLabel>Label</FieldLabel><Input value={formData.heroActions?.primary?.label} onChange={(e) => handleActionChange("primary", "label", e.target.value)} placeholder="e.g. View projects" /></Field>
                <Field><FieldLabel>Href</FieldLabel><Input value={formData.heroActions?.primary?.href} onChange={(e) => handleActionChange("primary", "href", e.target.value)} placeholder="e.g. #projects" /></Field>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 space-y-4">
                <h4 className="text-sm font-semibold">Secondary Action</h4>
                <Field><FieldLabel>Label</FieldLabel><Input value={formData.heroActions?.secondary?.label} onChange={(e) => handleActionChange("secondary", "label", e.target.value)} placeholder="e.g. GitHub" /></Field>
                <Field><FieldLabel>Href</FieldLabel><Input value={formData.heroActions?.secondary?.href} onChange={(e) => handleActionChange("secondary", "href", e.target.value)} placeholder="e.g. https://github.com" /></Field>
              </div>
            </FieldGroup>
          </EditorSection>

          <EditorSection
            title="Hero metrics"
            description="Small high-impact stats shown near the hero area."
            action={<Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => addItem("heroMetrics")}><Plus className="mr-2 size-4" />Add metric</Button>}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {formData.heroMetrics.map((metric, index) => (
                <ItemFrame key={`metric-${index}`} title={metric.label} subtitle={metric.value} iconName={metric.icon || "Sparkles"} onRemove={() => removeItem("heroMetrics", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Value</FieldLabel><Input value={metric.value} onChange={(e) => handleArrayChange("heroMetrics", index, "value", e.target.value)} placeholder="e.g. 5+" /></Field>
                    <Field><FieldLabel>Label</FieldLabel><Input value={metric.label} onChange={(e) => handleArrayChange("heroMetrics", index, "label", e.target.value)} placeholder="e.g. Years of experience" /></Field>
                    <div className="md:col-span-2">
                      <IconField label="Icon" value={metric.icon} onChange={(nextIcon) => handleArrayChange("heroMetrics", index, "icon", nextIcon)} />
                    </div>
                  </FieldGroup>
                </ItemFrame>
              ))}
            </div>
          </EditorSection>

          <EditorSection
            title="Hero focus"
            description="Focus area chart and metrics displayed in the hero section."
            action={<Button type="button" variant="outline" size="sm" className="rounded-full" onClick={addFocusArea}><Plus className="mr-2 size-4" />Add focus area</Button>}
          >
            <FieldGroup className="mb-6 grid gap-4 md:grid-cols-2">
              <Field><FieldLabel>Eyebrow</FieldLabel><Input value={formData.heroFocus?.eyebrow} onChange={(e) => handleNestedChange("heroFocus", "eyebrow", e.target.value)} placeholder="e.g. Current focus" /></Field>
              <Field><FieldLabel>Title</FieldLabel><Input value={formData.heroFocus?.title} onChange={(e) => handleNestedChange("heroFocus", "title", e.target.value)} placeholder="e.g. Backend architecture" /></Field>
            </FieldGroup>
            
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {(formData.heroFocus?.areas || []).map((area, index) => (
                <ItemFrame key={`focus-${index}`} title={area.label} subtitle={`${area.value || 0}%`} iconName={area.icon || "Sparkles"} onRemove={() => removeFocusArea(index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Label</FieldLabel><Input value={area.label} onChange={(e) => handleFocusAreaChange(index, "label", e.target.value)} /></Field>
                    <Field><FieldLabel>Value (%)</FieldLabel><Input type="number" value={area.value} onChange={(e) => handleFocusAreaChange(index, "value", Number(e.target.value))} /></Field>
                    <div className="md:col-span-2">
                      <IconField label="Icon" value={area.icon} onChange={(nextIcon) => handleFocusAreaChange(index, "icon", nextIcon)} />
                    </div>
                  </FieldGroup>
                </ItemFrame>
              ))}
            </div>
          </EditorSection>

          <EditorSection
            title="Hero badges & Highlights"
            description="Tags and detail cards shown under the hero."
          >
            <div className="space-y-8">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium">Badges</h4>
                  <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => addItem("heroBadges")}><Plus className="mr-2 size-4" />Add badge</Button>
                </div>
                <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {formData.heroBadges.map((badge, index) => (
                    <div key={`badge-${index}`} className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 p-2 pl-3">
                      <Input value={badge.label} placeholder="Label" className="h-8 border-0 bg-transparent px-0 focus-visible:ring-0" onChange={(e) => handleArrayChange("heroBadges", index, "label", e.target.value)} />
                      <Button variant="ghost" size="icon-sm" className="shrink-0 text-muted-foreground" onClick={() => removeItem("heroBadges", index)}><Trash2 className="size-3" /></Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium">Highlights</h4>
                  <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => addItem("heroHighlights")}><Plus className="mr-2 size-4" />Add highlight</Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {formData.heroHighlights.map((highlight, index) => (
                    <ItemFrame key={`highlight-${index}`} title={highlight.title} subtitle="Hero detail card" iconName={highlight.icon || "FileText"} onRemove={() => removeItem("heroHighlights", index)}>
                      <FieldGroup>
                        <Field><FieldLabel>Title</FieldLabel><Input value={highlight.title} onChange={(e) => handleArrayChange("heroHighlights", index, "title", e.target.value)} /></Field>
                        <Field><FieldLabel>Description</FieldLabel><Textarea rows={3} value={highlight.description} onChange={(e) => handleArrayChange("heroHighlights", index, "description", e.target.value)} /></Field>
                        <IconField label="Icon" value={highlight.icon} onChange={(nextIcon) => handleArrayChange("heroHighlights", index, "icon", nextIcon)} />
                      </FieldGroup>
                    </ItemFrame>
                  ))}
                </div>
              </div>
            </div>
          </EditorSection>

          <EditorSection
            title="Status pills"
            description="Compact pills shown in the hero section."
            action={<Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => addItem("statusPills")}><Plus className="mr-2 size-4" />Add pill</Button>}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {formData.statusPills.map((item, index) => (
                <ItemFrame key={`pill-${index}`} title={item.label} subtitle={item.icon || "Icon"} iconName={item.icon || "Component"} onRemove={() => removeItem("statusPills", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Label</FieldLabel><Input value={item.label} onChange={(e) => handleArrayChange("statusPills", index, "label", e.target.value)} /></Field>
                    <IconField label="Icon" value={item.icon} onChange={(nextIcon) => handleArrayChange("statusPills", index, "icon", nextIcon)} />
                  </FieldGroup>
                </ItemFrame>
              ))}
            </div>
          </EditorSection>

          <EditorSection 
            title="About section" 
            description="Longer narrative content about you and your work."
            preview={
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">{formData.aboutContent.title || "Section Title"}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {formData.aboutContent.description || "Write a detailed narrative about your background, experience, and what you do."}
                </p>
              </div>
            }
          >
            <FieldGroup>
              <Field><FieldLabel>Section title</FieldLabel><Input value={formData.aboutContent.title} onChange={(e) => handleNestedChange("aboutContent", "title", e.target.value)} placeholder="e.g. About Me" /></Field>
              <Field><FieldLabel>Description</FieldLabel><Textarea rows={7} value={formData.aboutContent.description} onChange={(e) => handleNestedChange("aboutContent", "description", e.target.value)} placeholder="e.g. Here is my story..." /></Field>
            </FieldGroup>
          </EditorSection>

          <EditorSection title="Section copy" description="Overarching headers and descriptions for major page sections.">
            <div className="grid gap-6 md:grid-cols-2">
              {['projects', 'experience', 'components', 'contact'].map((sec) => (
                <div key={sec} className="rounded-3xl border border-border/60 bg-muted/10 p-6 space-y-6">
                  {/* Internal Mini-Preview for Section Copy */}
                  <div className="border-b border-border/50 pb-5 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary/80">{formData.sectionCopy?.[sec]?.eyebrow || "Eyebrow"}</p>
                    <h3 className="text-2xl font-bold tracking-tight">{formData.sectionCopy?.[sec]?.title || "Section Title"}</h3>
                    <p className="text-sm text-muted-foreground">{formData.sectionCopy?.[sec]?.description || "Section description preview..."}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <Field><FieldLabel>Eyebrow</FieldLabel><Input value={formData.sectionCopy?.[sec]?.eyebrow} onChange={(e) => handleSectionCopyChange(sec, "eyebrow", e.target.value)} placeholder="e.g. Selected Work" /></Field>
                    <Field><FieldLabel>Title</FieldLabel><Input value={formData.sectionCopy?.[sec]?.title} onChange={(e) => handleSectionCopyChange(sec, "title", e.target.value)} placeholder="e.g. My Projects" /></Field>
                    <Field><FieldLabel>Description</FieldLabel><Textarea rows={3} value={formData.sectionCopy?.[sec]?.description} onChange={(e) => handleSectionCopyChange(sec, "description", e.target.value)} placeholder="e.g. A collection of..." /></Field>
                  </div>
                </div>
              ))}
            </div>
          </EditorSection>

          <EditorSection 
            title="Page copy" 
            description="System text and loading states."
            preview={
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                <Loader2 className="size-8 animate-spin text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">{formData.pageCopy?.loadingTitle || "Loading..."}</h3>
                  <p className="text-sm text-muted-foreground">{formData.pageCopy?.loadingDescription || "Please wait while we set things up."}</p>
                </div>
              </div>
            }
          >
            <FieldGroup className="grid gap-4 md:grid-cols-2">
              <Field><FieldLabel>Loading Title</FieldLabel><Input value={formData.pageCopy?.loadingTitle} onChange={(e) => handleNestedChange("pageCopy", "loadingTitle", e.target.value)} placeholder="e.g. Loading..." /></Field>
              <Field><FieldLabel>Loading Description</FieldLabel><Input value={formData.pageCopy?.loadingDescription} onChange={(e) => handleNestedChange("pageCopy", "loadingDescription", e.target.value)} placeholder="e.g. Please wait." /></Field>
            </FieldGroup>
          </EditorSection>
        </TabsContent>

        {/* --- SECTIONS TAB --- */}
        <TabsContent value="sections" className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm md:p-7">
          <EditorSection
            title="Skill groups"
            description="Stack and capabilities used in the about section."
            action={<Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => addItem("skillGroups")}><Plus className="mr-2 size-4" />Add group</Button>}
          >
            <div>
              {formData.skillGroups.map((group, index) => (
                <ItemFrame key={`skill-${index}`} title={group.title} subtitle="Grouped skills with description" iconName={group.icon || "Sparkles"} onRemove={() => removeItem("skillGroups", index)}>
                  <FieldGroup>
                    <Field><FieldLabel>Title</FieldLabel><Input value={group.title} onChange={(e) => handleArrayChange("skillGroups", index, "title", e.target.value)} placeholder="e.g. Frontend Development" /></Field>
                    <Field><FieldLabel>Description</FieldLabel><Textarea rows={3} value={group.description} onChange={(e) => handleArrayChange("skillGroups", index, "description", e.target.value)} placeholder="e.g. Building responsive UI..." /></Field>
                    <Field><FieldLabel>Items</FieldLabel><Input value={joinList(group.items)} onChange={(e) => handleArrayListChange("skillGroups", index, "items", e.target.value)} placeholder="React, Next.js, Tailwind" /></Field>
                    <IconField label="Icon" value={group.icon} onChange={(nextIcon) => handleArrayChange("skillGroups", index, "icon", nextIcon)} />
                  </FieldGroup>
                </ItemFrame>
              ))}
            </div>
          </EditorSection>

          <EditorSection
            title="Projects"
            description="Portfolio cards for featured work."
            action={<Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => addItem("projects")}><Plus className="mr-2 size-4" />Add project</Button>}
          >
            <div>
              {formData.projects.map((project, index) => (
                <ItemFrame key={`project-${index}`} title={project.title} subtitle={project.eyebrow} iconName={project.icon || "Globe"} onRemove={() => removeItem("projects", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Title</FieldLabel><Input value={project.title} onChange={(e) => handleArrayChange("projects", index, "title", e.target.value)} placeholder="e.g. E-commerce Platform" /></Field>
                    <Field><FieldLabel>Eyebrow</FieldLabel><Input value={project.eyebrow} onChange={(e) => handleArrayChange("projects", index, "eyebrow", e.target.value)} placeholder="e.g. Web App" /></Field>
                    <Field className="md:col-span-2"><FieldLabel>Description</FieldLabel><Textarea rows={4} value={project.description} onChange={(e) => handleArrayChange("projects", index, "description", e.target.value)} placeholder="e.g. A full-stack marketplace..." /></Field>
                    <Field><FieldLabel>Stack</FieldLabel><Input value={joinList(project.stack)} onChange={(e) => handleArrayListChange("projects", index, "stack", e.target.value)} placeholder="React, Node.js, MongoDB" /></Field>
                    <Field><FieldLabel>Stat</FieldLabel><Input value={project.stat} onChange={(e) => handleArrayChange("projects", index, "stat", e.target.value)} placeholder="e.g. 10k+ active users" /></Field>
                    <div className="md:col-span-2">
                      <IconField label="Icon" value={project.icon} onChange={(nextIcon) => handleArrayChange("projects", index, "icon", nextIcon)} />
                    </div>
                  </FieldGroup>
                </ItemFrame>
              ))}
            </div>
          </EditorSection>

          <EditorSection
            title="Experience"
            description="Career timeline and role details."
            action={<Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => addItem("experience")}><Plus className="mr-2 size-4" />Add experience</Button>}
          >
            <div>
              {formData.experience.map((item, index) => (
                <ItemFrame key={`experience-${index}`} title={item.title} subtitle={item.company} iconName={item.icon || "User"} onRemove={() => removeItem("experience", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Period</FieldLabel><Input value={item.period} onChange={(e) => handleArrayChange("experience", index, "period", e.target.value)} placeholder="e.g. 2022 - Present" /></Field>
                    <Field><FieldLabel>Relation</FieldLabel><Input value={item.relation} onChange={(e) => handleArrayChange("experience", index, "relation", e.target.value)} placeholder="e.g. frontend" /></Field>
                    <Field><FieldLabel>Title</FieldLabel><Input value={item.title} onChange={(e) => handleArrayChange("experience", index, "title", e.target.value)} placeholder="e.g. Senior Developer" /></Field>
                    <Field><FieldLabel>Company</FieldLabel><Input value={item.company} onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)} placeholder="e.g. Tech Corp" /></Field>
                    <Field className="md:col-span-2"><FieldLabel>Summary</FieldLabel><Textarea rows={4} value={item.summary} onChange={(e) => handleArrayChange("experience", index, "summary", e.target.value)} placeholder="e.g. Led the frontend team..." /></Field>
                    <Field className="md:col-span-2"><FieldLabel>Highlights</FieldLabel><Input value={joinList(item.highlights)} onChange={(e) => handleArrayListChange("experience", index, "highlights", e.target.value)} placeholder="Built X, Improved Y" /></Field>
                    <div className="md:col-span-2">
                      <IconField label="Icon" value={item.icon} onChange={(nextIcon) => handleArrayChange("experience", index, "icon", nextIcon)} />
                    </div>
                  </FieldGroup>
                </ItemFrame>
              ))}
            </div>
          </EditorSection>

          <EditorSection
            title="Showcase categories"
            description="UI system showcase content with relation mapping and icons."
            action={<Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => addItem("showcaseCategories")}><Plus className="mr-2 size-4" />Add category</Button>}
          >
            <div>
              {formData.showcaseCategories.map((item, index) => (
                <ItemFrame key={`showcase-${index}`} title={item.title} subtitle={item.relation} iconName={item.icon || "Component"} onRemove={() => removeItem("showcaseCategories", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Title</FieldLabel><Input value={item.title} onChange={(e) => handleArrayChange("showcaseCategories", index, "title", e.target.value)} placeholder="e.g. Core Components" /></Field>
                    <Field><FieldLabel>Relation</FieldLabel><Input value={item.relation} onChange={(e) => handleArrayChange("showcaseCategories", index, "relation", e.target.value)} placeholder="e.g. frontend" /></Field>
                    <Field className="md:col-span-2"><FieldLabel>Preview</FieldLabel><Textarea rows={3} value={item.preview} onChange={(e) => handleArrayChange("showcaseCategories", index, "preview", e.target.value)} placeholder="e.g. A collection of reusable UI elements..." /></Field>
                    <Field><FieldLabel>Items</FieldLabel><Input value={joinList(item.items)} onChange={(e) => handleArrayListChange("showcaseCategories", index, "items", e.target.value)} placeholder="Button, Input, Avatar" /></Field>
                    <IconField label="Icon" value={item.icon} onChange={(nextIcon) => handleArrayChange("showcaseCategories", index, "icon", nextIcon)} />
                  </FieldGroup>
                </ItemFrame>
              ))}
            </div>
          </EditorSection>

          <EditorSection
            title="Featured modules"
            description="Highlighted modules that pair with experience and showcase sections."
            action={<Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => addItem("featuredModules")}><Plus className="mr-2 size-4" />Add module</Button>}
          >
            <div>
              {formData.featuredModules.map((item, index) => (
                <ItemFrame key={`module-${index}`} title={item.title} subtitle={item.relation} iconName={item.icon || "Blocks"} onRemove={() => removeItem("featuredModules", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Title</FieldLabel><Input value={item.title} onChange={(e) => handleArrayChange("featuredModules", index, "title", e.target.value)} placeholder="e.g. Authentication System" /></Field>
                    <Field><FieldLabel>Relation</FieldLabel><Input value={item.relation} onChange={(e) => handleArrayChange("featuredModules", index, "relation", e.target.value)} placeholder="e.g. backend" /></Field>
                    <Field className="md:col-span-2"><FieldLabel>Body</FieldLabel><Textarea rows={3} value={item.body} onChange={(e) => handleArrayChange("featuredModules", index, "body", e.target.value)} placeholder="e.g. Built a secure JWT-based auth flow..." /></Field>
                    <Field className="md:col-span-2"><FieldLabel>Details</FieldLabel><Textarea rows={3} value={item.details} onChange={(e) => handleArrayChange("featuredModules", index, "details", e.target.value)} placeholder="e.g. Includes OTP verification and refresh tokens." /></Field>
                    <IconField label="Icon" value={item.icon} onChange={(nextIcon) => handleArrayChange("featuredModules", index, "icon", nextIcon)} />
                  </FieldGroup>
                </ItemFrame>
              ))}
            </div>
          </EditorSection>
        </TabsContent>

        {/* --- LINKS TAB --- */}
        <TabsContent value="links" className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm md:p-7">
          <EditorSection
            title="Navigation links"
            description="Header navigation items for the public portfolio."
            action={<Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => addItem("navigationLinks")}><Plus className="mr-2 size-4" />Add link</Button>}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {formData.navigationLinks.map((link, index) => (
                <ItemFrame key={`nav-${index}`} title={link.label} subtitle={link.href} iconName={link.icon || "Link2"} onRemove={() => removeItem("navigationLinks", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Label</FieldLabel><Input value={link.label} onChange={(e) => handleArrayChange("navigationLinks", index, "label", e.target.value)} placeholder="e.g. Home" /></Field>
                    <Field><FieldLabel>Href</FieldLabel><Input value={link.href} onChange={(e) => handleArrayChange("navigationLinks", index, "href", e.target.value)} placeholder="e.g. #hero" /></Field>
                    <div className="md:col-span-2">
                      <IconField label="Icon" value={link.icon} onChange={(nextIcon) => handleArrayChange("navigationLinks", index, "icon", nextIcon)} />
                    </div>
                  </FieldGroup>
                </ItemFrame>
              ))}
            </div>
          </EditorSection>

          <EditorSection
            title="Contact methods"
            description="Public contact cards shown in the contact section."
            action={<Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => addItem("contactMethods")}><Plus className="mr-2 size-4" />Add method</Button>}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {formData.contactMethods.map((item, index) => (
                <ItemFrame key={`contact-${index}`} title={item.label} subtitle={item.value || item.href} iconName={item.icon || "Mail"} onRemove={() => removeItem("contactMethods", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Label</FieldLabel><Input value={item.label} onChange={(e) => handleArrayChange("contactMethods", index, "label", e.target.value)} placeholder="e.g. Email" /></Field>
                    <Field><FieldLabel>Value</FieldLabel><Input value={item.value} onChange={(e) => handleArrayChange("contactMethods", index, "value", e.target.value)} placeholder="e.g. hello@example.com" /></Field>
                    <Field className="md:col-span-2"><FieldLabel>Href</FieldLabel><Input value={item.href} onChange={(e) => handleArrayChange("contactMethods", index, "href", e.target.value)} placeholder="e.g. mailto:hello@example.com" /></Field>
                    <IconField label="Icon" value={item.icon} onChange={(nextIcon) => handleArrayChange("contactMethods", index, "icon", nextIcon)} />
                  </FieldGroup>
                </ItemFrame>
              ))}
            </div>
          </EditorSection>

          <EditorSection
            title="Footer links"
            description="Links displayed in the footer."
            action={<Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => addItem("footerLinks")}><Plus className="mr-2 size-4" />Add footer link</Button>}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {formData.footerLinks.map((link, index) => (
                <ItemFrame key={`footer-${index}`} title={link.label} subtitle={link.href} iconName={link.icon || "Globe"} onRemove={() => removeItem("footerLinks", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Label</FieldLabel><Input value={link.label} onChange={(e) => handleArrayChange("footerLinks", index, "label", e.target.value)} placeholder="e.g. Twitter" /></Field>
                    <Field><FieldLabel>Href</FieldLabel><Input value={link.href} onChange={(e) => handleArrayChange("footerLinks", index, "href", e.target.value)} placeholder="e.g. https://twitter.com/..." /></Field>
                    <div className="md:col-span-2">
                      <IconField label="Icon" value={link.icon} onChange={(nextIcon) => handleArrayChange("footerLinks", index, "icon", nextIcon)} />
                    </div>
                  </FieldGroup>
                </ItemFrame>
              ))}
            </div>
          </EditorSection>
        </TabsContent>

        {/* --- SETTINGS TAB --- */}
        <TabsContent value="settings" className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm md:p-7">
          <EditorSection title="Portfolio settings" description="Index and visibility controls for multi-portfolio management.">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_320px]">
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-primary">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Visibility</p>
                    <p className="text-xs text-muted-foreground">This portfolio is currently {formData.isEnabled ? "visible" : "hidden"}.</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Public access</p>
                    <p className="text-xs text-muted-foreground">Enable or disable this portfolio without losing content.</p>
                  </div>
                  <Switch checked={formData.isEnabled} onCheckedChange={(checked) => setFormData((current) => ({ ...current, isEnabled: checked }))} />
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 md:min-w-[240px]">
                <Field>
                  <FieldLabel>Display index</FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    value={formData.orderIndex}
                    onChange={(e) => setFormData((current) => ({ ...current, orderIndex: Number(e.target.value) || 1 }))}
                  />
                </Field>
                <p className="mt-3 text-xs text-muted-foreground">
                  Use the portfolio index to control multi-portfolio ordering on the backend.
                </p>
              </div>
            </div>
          </EditorSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}