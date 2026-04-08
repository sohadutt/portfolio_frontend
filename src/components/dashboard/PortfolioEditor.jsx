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
} from "lucide-react"
import { toast } from "sonner"

import { createNewPortfolio, fetchDashboardPortfolios, fetchPortfolio, updatePortfolio } from "@/helper/functions"
import { resolveIcon } from "@/helper/portfolio-data"
import { defaultPortfolioDocument } from "@/helper/portfolio"
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

const cloneDocument = (value) => JSON.parse(JSON.stringify(value))

const initialFormState = (portfolioIndex) => {
  const template = cloneDocument(defaultPortfolioDocument)

  return {
    isEnabled: template.is_enabled ?? true,
    orderIndex: portfolioIndex,
    personalInfo: template.personalInfo || {},
    heroContent: template.heroContent || { eyebrow: "", title: "", description: "" },
    aboutContent: template.aboutContent || { title: "", description: "" },
    navigationLinks: template.navigationLinks || [],
    heroMetrics: template.heroMetrics || [],
    skillGroups: template.skillGroups || [],
    projects: template.projects || [],
    experience: template.experience || [],
    showcaseCategories: template.showcaseCategories || [],
    featuredModules: template.featuredModules || [],
    contactMethods: template.contactMethods || [],
    footerLinks: template.footerLinks || [],
    statusPills: template.statusPills || [],
  }
}

const templates = {
  navigationLinks: { label: "", href: "" },
  heroMetrics: { value: "", label: "" },
  skillGroups: { title: "", description: "", items: [] },
  projects: { title: "", eyebrow: "", description: "", stack: [], stat: "" },
  experience: {
    period: "",
    title: "",
    company: "",
    relation: "",
    summary: "",
    highlights: [],
    relatedComponents: [],
  },
  showcaseCategories: { title: "", relation: "", preview: "", items: [], icon: "Component" },
  featuredModules: { title: "", relation: "", body: "", details: "", icon: "Blocks" },
  contactMethods: { label: "", value: "", href: "", icon: "Mail" },
  footerLinks: { label: "", href: "" },
  statusPills: { label: "", icon: "Component" },
}

function joinList(list = []) {
  return Array.isArray(list) ? list.join(", ") : ""
}

function parseList(value = "") {
  return value.split(",").map((item) => item.trim()).filter(Boolean)
}

function ensureArray(value) {
  return Array.isArray(value) ? value : []
}

function EditorSection({ title, description, action, children }) {
  return (
    <Card className="border-border/60 bg-background shadow-sm mb-6 last:mb-0">
      <CardHeader className="border-b border-border/50 pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg tracking-tight">{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  )
}

function ItemFrame({ title, subtitle, iconName, onRemove, children }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 mb-4 last:mb-0">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-primary">
            {createElement(resolveIcon(iconName), { className: "size-4" })}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{title}</p>
            {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
          </div>
        </div>
        <Button type="button" variant="ghost" size="icon-sm" className="rounded-full" onClick={onRemove}>
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
      const response = await fetchPortfolio(null, portfolioIndex)

      if (response) {
        const normalizedProjects = Array.isArray(response.projects) ? response.projects : response.projects?.results || []
        const normalizedExperience = (Array.isArray(response.experience) ? response.experience : response.experience?.results || []).map((item) => ({
          ...item,
          highlights: ensureArray(item.highlights),
          relatedComponents: ensureArray(item.relatedComponents),
        }))

        setFormData((current) => ({
          ...current,
          isEnabled: response.isEnabled ?? current.isEnabled,
          orderIndex: response.orderIndex ?? current.orderIndex,
          personalInfo: { ...current.personalInfo, ...(response.personalInfo || {}) },
          heroContent: { ...current.heroContent, ...(response.heroContent || {}) },
          aboutContent: { ...current.aboutContent, ...(response.aboutContent || {}) },
          navigationLinks: response.navigationLinks || [],
          heroMetrics: response.heroMetrics || [],
          skillGroups: response.skillGroups || [],
          projects: normalizedProjects,
          experience: normalizedExperience,
          showcaseCategories: (response.showcaseCategories || []).map((item) => ({
            ...item,
            icon: item.icon || item.icon_name || "Component",
          })),
          featuredModules: (response.featuredModules || []).map((item) => ({
            ...item,
            icon: item.icon || item.icon_name || "Blocks",
          })),
          contactMethods: (response.contactMethods || []).map((item) => ({
            ...item,
            icon: item.icon || item.icon_name || "Mail",
          })),
          footerLinks: response.footerLinks || [],
          statusPills: (response.statusPills || []).map((item) => ({
            ...item,
            icon: item.icon || item.icon_name || "Component",
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
    setFormData((current) => ({
      ...current,
      [section]: { ...current[section], [field]: value },
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
        aboutContent: formData.aboutContent,
        navigationLinks: formData.navigationLinks,
        heroMetrics: formData.heroMetrics,
        skillGroups: formData.skillGroups,
        projects: formData.projects,
        experience: formData.experience,
        showcaseCategories: formData.showcaseCategories,
        featuredModules: formData.featuredModules,
        contactMethods: formData.contactMethods,
        footerLinks: formData.footerLinks,
        statusPills: formData.statusPills,
      }

      if (isNewPortfolio) {
        const createdPortfolio = await createNewPortfolio(payload, portfolioIndex)
        setFormData((current) => ({
          ...current,
          ...createdPortfolio,
          orderIndex: createdPortfolio?.orderIndex ?? current.orderIndex,
          isEnabled: createdPortfolio?.isEnabled ?? current.isEnabled,
        }))
        setIsNewPortfolio(false)
        toast.success("Portfolio created successfully")
      } else {
        const updatedPortfolio = await updatePortfolio(payload, portfolioIndex)
        setFormData((current) => ({
          ...current,
          ...updatedPortfolio,
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

      {/* CHANGED flex-col HERE TO ENSURE STACKING */}
      <Tabs defaultValue="identity" className="flex w-full flex-col gap-6">
        
        {/* CHANGED LAYOUT HERE TO SPAN FULL WIDTH */}
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
          <EditorSection title="Personal information" description="Primary identity and profile metadata displayed throughout the portfolio.">
            <FieldGroup className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <Field><FieldLabel>Full name</FieldLabel><Input value={formData.personalInfo.name} onChange={(e) => handleNestedChange("personalInfo", "name", e.target.value)} /></Field>
              <Field><FieldLabel>Short name</FieldLabel><Input value={formData.personalInfo.shortName} onChange={(e) => handleNestedChange("personalInfo", "shortName", e.target.value)} /></Field>
              <Field><FieldLabel>Professional title</FieldLabel><Input value={formData.personalInfo.title} onChange={(e) => handleNestedChange("personalInfo", "title", e.target.value)} /></Field>
              <Field><FieldLabel>Subtitle</FieldLabel><Input value={formData.personalInfo.subtitle} onChange={(e) => handleNestedChange("personalInfo", "subtitle", e.target.value)} /></Field>
              <Field><FieldLabel>Location</FieldLabel><Input value={formData.personalInfo.location} onChange={(e) => handleNestedChange("personalInfo", "location", e.target.value)} /></Field>
              <Field><FieldLabel>Public email</FieldLabel><Input type="email" value={formData.personalInfo.email} onChange={(e) => handleNestedChange("personalInfo", "email", e.target.value)} /></Field>
              <Field><FieldLabel>GitHub URL</FieldLabel><Input value={formData.personalInfo.github} onChange={(e) => handleNestedChange("personalInfo", "github", e.target.value)} /></Field>
              <Field><FieldLabel>LinkedIn URL</FieldLabel><Input value={formData.personalInfo.linkedin} onChange={(e) => handleNestedChange("personalInfo", "linkedin", e.target.value)} /></Field>
            </FieldGroup>
          </EditorSection>
        </TabsContent>

        {/* --- CONTENT TAB --- */}
        <TabsContent value="content" className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm md:p-7">
          <EditorSection title="Hero content" description="Top-of-page messaging and headline copy.">
            <FieldGroup>
              <Field><FieldLabel>Eyebrow</FieldLabel><Input value={formData.heroContent.eyebrow} onChange={(e) => handleNestedChange("heroContent", "eyebrow", e.target.value)} /></Field>
              <Field><FieldLabel>Title</FieldLabel><Textarea rows={3} value={formData.heroContent.title} onChange={(e) => handleNestedChange("heroContent", "title", e.target.value)} /></Field>
              <Field><FieldLabel>Description</FieldLabel><Textarea rows={5} value={formData.heroContent.description} onChange={(e) => handleNestedChange("heroContent", "description", e.target.value)} /></Field>
            </FieldGroup>
          </EditorSection>

          <EditorSection
            title="Hero metrics"
            description="Small high-impact stats shown near the hero area."
            action={<Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => addItem("heroMetrics")}><Plus className="mr-2 size-4" />Add metric</Button>}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {formData.heroMetrics.map((metric, index) => (
                <ItemFrame
                  key={`metric-${index}`}
                  title={metric.label || `Metric ${index + 1}`}
                  subtitle={metric.value || "Add a value"}
                  iconName="Sparkles"
                  onRemove={() => removeItem("heroMetrics", index)}
                >
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Value</FieldLabel><Input value={metric.value} onChange={(e) => handleArrayChange("heroMetrics", index, "value", e.target.value)} /></Field>
                    <Field><FieldLabel>Label</FieldLabel><Input value={metric.label} onChange={(e) => handleArrayChange("heroMetrics", index, "label", e.target.value)} /></Field>
                  </FieldGroup>
                </ItemFrame>
              ))}
            </div>
          </EditorSection>

          <EditorSection
            title="Status pills"
            description="Compact pills shown in the hero section."
            action={<Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => addItem("statusPills")}><Plus className="mr-2 size-4" />Add pill</Button>}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {formData.statusPills.map((item, index) => (
                <ItemFrame key={`pill-${index}`} title={item.label || `Status pill ${index + 1}`} subtitle={item.icon || "Icon"} iconName={item.icon} onRemove={() => removeItem("statusPills", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Label</FieldLabel><Input value={item.label} onChange={(e) => handleArrayChange("statusPills", index, "label", e.target.value)} /></Field>
                    <IconField label="Icon" value={item.icon} onChange={(nextIcon) => handleArrayChange("statusPills", index, "icon", nextIcon)} />
                  </FieldGroup>
                </ItemFrame>
              ))}
            </div>
          </EditorSection>

          <EditorSection title="About section" description="Longer narrative content about you and your work.">
            <FieldGroup>
              <Field><FieldLabel>Section title</FieldLabel><Input value={formData.aboutContent.title} onChange={(e) => handleNestedChange("aboutContent", "title", e.target.value)} /></Field>
              <Field><FieldLabel>Description</FieldLabel><Textarea rows={7} value={formData.aboutContent.description} onChange={(e) => handleNestedChange("aboutContent", "description", e.target.value)} /></Field>
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
                <ItemFrame key={`skill-${index}`} title={group.title || `Skill group ${index + 1}`} subtitle="Grouped skills with description" iconName="Sparkles" onRemove={() => removeItem("skillGroups", index)}>
                  <FieldGroup>
                    <Field><FieldLabel>Title</FieldLabel><Input value={group.title} onChange={(e) => handleArrayChange("skillGroups", index, "title", e.target.value)} /></Field>
                    <Field><FieldLabel>Description</FieldLabel><Textarea rows={3} value={group.description} onChange={(e) => handleArrayChange("skillGroups", index, "description", e.target.value)} /></Field>
                    <Field><FieldLabel>Items</FieldLabel><Input value={joinList(group.items)} onChange={(e) => handleArrayListChange("skillGroups", index, "items", e.target.value)} placeholder="React, Django, PostgreSQL" /></Field>
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
                <ItemFrame key={`project-${index}`} title={project.title || `Project ${index + 1}`} subtitle={project.eyebrow || "Project category"} iconName="Globe" onRemove={() => removeItem("projects", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Title</FieldLabel><Input value={project.title} onChange={(e) => handleArrayChange("projects", index, "title", e.target.value)} /></Field>
                    <Field><FieldLabel>Eyebrow</FieldLabel><Input value={project.eyebrow} onChange={(e) => handleArrayChange("projects", index, "eyebrow", e.target.value)} /></Field>
                    <Field className="md:col-span-2"><FieldLabel>Description</FieldLabel><Textarea rows={4} value={project.description} onChange={(e) => handleArrayChange("projects", index, "description", e.target.value)} /></Field>
                    <Field><FieldLabel>Stack</FieldLabel><Input value={joinList(project.stack)} onChange={(e) => handleArrayListChange("projects", index, "stack", e.target.value)} placeholder="React, Tailwind, Django" /></Field>
                    <Field><FieldLabel>Stat</FieldLabel><Input value={project.stat} onChange={(e) => handleArrayChange("projects", index, "stat", e.target.value)} /></Field>
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
                <ItemFrame key={`experience-${index}`} title={item.title || `Experience ${index + 1}`} subtitle={item.company || "Role and company"} iconName="User" onRemove={() => removeItem("experience", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Period</FieldLabel><Input value={item.period} onChange={(e) => handleArrayChange("experience", index, "period", e.target.value)} /></Field>
                    <Field><FieldLabel>Relation</FieldLabel><Input value={item.relation} onChange={(e) => handleArrayChange("experience", index, "relation", e.target.value)} /></Field>
                    <Field><FieldLabel>Title</FieldLabel><Input value={item.title} onChange={(e) => handleArrayChange("experience", index, "title", e.target.value)} /></Field>
                    <Field><FieldLabel>Company</FieldLabel><Input value={item.company} onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)} /></Field>
                    <Field className="md:col-span-2"><FieldLabel>Summary</FieldLabel><Textarea rows={4} value={item.summary} onChange={(e) => handleArrayChange("experience", index, "summary", e.target.value)} /></Field>
                    <Field><FieldLabel>Highlights</FieldLabel><Input value={joinList(item.highlights)} onChange={(e) => handleArrayListChange("experience", index, "highlights", e.target.value)} placeholder="Built X, Improved Y" /></Field>
                    <Field><FieldLabel>Related components</FieldLabel><Input value={joinList(item.relatedComponents)} onChange={(e) => handleArrayListChange("experience", index, "relatedComponents", e.target.value)} placeholder="Table, Badge, Dialog" /></Field>
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
                <ItemFrame key={`showcase-${index}`} title={item.title || `Category ${index + 1}`} subtitle={item.relation || "Connected relation"} iconName={item.icon} onRemove={() => removeItem("showcaseCategories", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Title</FieldLabel><Input value={item.title} onChange={(e) => handleArrayChange("showcaseCategories", index, "title", e.target.value)} /></Field>
                    <Field><FieldLabel>Relation</FieldLabel><Input value={item.relation} onChange={(e) => handleArrayChange("showcaseCategories", index, "relation", e.target.value)} /></Field>
                    <Field className="md:col-span-2"><FieldLabel>Preview</FieldLabel><Textarea rows={3} value={item.preview} onChange={(e) => handleArrayChange("showcaseCategories", index, "preview", e.target.value)} /></Field>
                    <Field><FieldLabel>Items</FieldLabel><Input value={joinList(item.items)} onChange={(e) => handleArrayListChange("showcaseCategories", index, "items", e.target.value)} placeholder="Badge, Dialog, Table" /></Field>
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
                <ItemFrame key={`module-${index}`} title={item.title || `Module ${index + 1}`} subtitle={item.relation || "Connected relation"} iconName={item.icon} onRemove={() => removeItem("featuredModules", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Title</FieldLabel><Input value={item.title} onChange={(e) => handleArrayChange("featuredModules", index, "title", e.target.value)} /></Field>
                    <Field><FieldLabel>Relation</FieldLabel><Input value={item.relation} onChange={(e) => handleArrayChange("featuredModules", index, "relation", e.target.value)} /></Field>
                    <Field className="md:col-span-2"><FieldLabel>Body</FieldLabel><Textarea rows={3} value={item.body} onChange={(e) => handleArrayChange("featuredModules", index, "body", e.target.value)} /></Field>
                    <Field className="md:col-span-2"><FieldLabel>Details</FieldLabel><Textarea rows={3} value={item.details} onChange={(e) => handleArrayChange("featuredModules", index, "details", e.target.value)} /></Field>
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
                <ItemFrame key={`nav-${index}`} title={link.label || `Link ${index + 1}`} subtitle={link.href || "Anchor or URL"} iconName="Link2" onRemove={() => removeItem("navigationLinks", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Label</FieldLabel><Input value={link.label} onChange={(e) => handleArrayChange("navigationLinks", index, "label", e.target.value)} /></Field>
                    <Field><FieldLabel>Href</FieldLabel><Input value={link.href} onChange={(e) => handleArrayChange("navigationLinks", index, "href", e.target.value)} /></Field>
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
                <ItemFrame key={`contact-${index}`} title={item.label || `Method ${index + 1}`} subtitle={item.value || item.href || "Contact detail"} iconName={item.icon} onRemove={() => removeItem("contactMethods", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Label</FieldLabel><Input value={item.label} onChange={(e) => handleArrayChange("contactMethods", index, "label", e.target.value)} /></Field>
                    <Field><FieldLabel>Value</FieldLabel><Input value={item.value} onChange={(e) => handleArrayChange("contactMethods", index, "value", e.target.value)} /></Field>
                    <Field className="md:col-span-2"><FieldLabel>Href</FieldLabel><Input value={item.href} onChange={(e) => handleArrayChange("contactMethods", index, "href", e.target.value)} /></Field>
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
                <ItemFrame key={`footer-${index}`} title={link.label || `Footer link ${index + 1}`} subtitle={link.href || "Anchor or URL"} iconName="Globe" onRemove={() => removeItem("footerLinks", index)}>
                  <FieldGroup className="grid gap-4 md:grid-cols-2">
                    <Field><FieldLabel>Label</FieldLabel><Input value={link.label} onChange={(e) => handleArrayChange("footerLinks", index, "label", e.target.value)} /></Field>
                    <Field><FieldLabel>Href</FieldLabel><Input value={link.href} onChange={(e) => handleArrayChange("footerLinks", index, "href", e.target.value)} /></Field>
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