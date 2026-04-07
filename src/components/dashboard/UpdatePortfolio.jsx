import { useState, useEffect } from "react"
import { fetchPortfolio, updatePortfolio } from "@/helper/functions"
import { Toaster, toast } from "sonner"
import { 
  Save, User, LayoutTemplate, FileText, Settings2, Loader2, 
  Plus, Trash2, List, Briefcase, Code2 
} from "lucide-react"

// Shadcn Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"

export default function UpdatePortfolio({ portfolioIndex = 1 }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // 1. FULLY EXPANDED STATE MATCHING YOUR JSON
  const [formData, setFormData] = useState({
    isEnabled: true,
    orderIndex: portfolioIndex,
    personalInfo: {
      name: "", shortName: "", title: "", subtitle: "", 
      location: "", email: "", github: "", linkedin: ""
    },
    heroContent: { eyebrow: "", title: "", description: "" },
    aboutContent: { title: "", description: "" },
    
    // Arrays
    navigationLinks: [],
    heroMetrics: [],
    skillGroups: [],
    projects: [],
    experience: [],
    showcaseCategories: [],
    featuredModules: [],
    contactMethods: [],
    footerLinks: [],
    statusPills: []
  })

  useEffect(() => {
    loadPortfolioData()
  }, [portfolioIndex])

  const loadPortfolioData = async () => {
    try {
      setLoading(true)
      const res = await fetchPortfolio(null, portfolioIndex)
      
      if (res) {
        setFormData(prev => ({
          ...prev,
          isEnabled: res.isEnabled ?? prev.isEnabled,
          orderIndex: res.orderIndex ?? prev.orderIndex,
          
          // DEEP MERGE: Protects un-edited fields from being blanked out
          personalInfo: { ...prev.personalInfo, ...(res.personalInfo || {}) },
          heroContent: { ...prev.heroContent, ...(res.heroContent || {}) },
          aboutContent: { ...prev.aboutContent, ...(res.aboutContent || {}) },
          
          // Arrays (Fallback to empty arrays if backend sends undefined)
          navigationLinks: res.navigationLinks || [],
          heroMetrics: res.heroMetrics || [],
          skillGroups: res.skillGroups || [],
          projects: res.projects || [],
          experience: res.experience || [],
          showcaseCategories: res.showcaseCategories || [],
          featuredModules: res.featuredModules || [],
          contactMethods: res.contactMethods || [],
          footerLinks: res.footerLinks || [],
          statusPills: res.statusPills || []
        }))
      }
    } catch (err) {
      console.error('Portfolios Loading Error:', err)
      toast.error(err.message || "Failed to load portfolio data.")
    } finally {
      setLoading(false)
    }
  }

  // --- HANDLERS ---

  // Deep update for objects (Personal Info, Hero, About)
  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }))
  }

  // Deep update for Arrays (Projects, Experience, Metrics, etc.)
  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]]
      newArray[index] = { ...newArray[index], [field]: value }
      return { ...prev, [arrayName]: newArray }
    })
  }

  // Array Add/Remove functions
  const addArrayItem = (arrayName, template) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template]
    }))
  }

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }))
  }

  // Array Specific Handlers (e.g., for comma-separated lists like Project 'stack')
  const handleArrayListChange = (arrayName, index, field, commaString) => {
    const listArray = commaString.split(',').map(item => item.trim()).filter(Boolean)
    handleArrayChange(arrayName, index, field, listArray)
  }

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      // The exact payload expected by your Django PortfolioSubmissionSerializer
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
      
      await updatePortfolio(payload, portfolioIndex)
      toast.success("Portfolio updated successfully!")
    } catch (err) {
      toast.error(err.message || "Failed to update portfolio.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">Loading Portfolio Editor...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4 border-b">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Portfolio #{portfolioIndex}</h2>
          <p className="text-sm text-muted-foreground">Manage your content and component data.</p>
        </div>
        <Button onClick={handleSubmit} disabled={saving} className="shadow-md">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
          <TabsTrigger value="personal" className="py-2.5"><User className="w-4 h-4 mr-2 hidden sm:block"/> Personal</TabsTrigger>
          <TabsTrigger value="hero" className="py-2.5"><LayoutTemplate className="w-4 h-4 mr-2 hidden sm:block"/> Hero</TabsTrigger>
          <TabsTrigger value="about" className="py-2.5"><FileText className="w-4 h-4 mr-2 hidden sm:block"/> About</TabsTrigger>
          <TabsTrigger value="lists" className="py-2.5"><List className="w-4 h-4 mr-2 hidden sm:block"/> Lists Data</TabsTrigger>
          <TabsTrigger value="settings" className="py-2.5"><Settings2 className="w-4 h-4 mr-2 hidden sm:block"/> Settings</TabsTrigger>
        </TabsList>

        {/* --- PERSONAL INFO TAB --- */}
        <TabsContent value="personal" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>This information will be displayed globally across your portfolio.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.personalInfo.name} onChange={(e) => handleNestedChange('personalInfo', 'name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortName">Short Name (Logo)</Label>
                <Input id="shortName" value={formData.personalInfo.shortName} onChange={(e) => handleNestedChange('personalInfo', 'shortName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input id="title" value={formData.personalInfo.title} onChange={(e) => handleNestedChange('personalInfo', 'title', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle / Skills Summary</Label>
                <Input id="subtitle" value={formData.personalInfo.subtitle} onChange={(e) => handleNestedChange('personalInfo', 'subtitle', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={formData.personalInfo.location} onChange={(e) => handleNestedChange('personalInfo', 'location', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Public Email</Label>
                <Input id="email" type="email" value={formData.personalInfo.email} onChange={(e) => handleNestedChange('personalInfo', 'email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL</Label>
                <Input id="github" type="url" value={formData.personalInfo.github} onChange={(e) => handleNestedChange('personalInfo', 'github', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input id="linkedin" type="url" value={formData.personalInfo.linkedin} onChange={(e) => handleNestedChange('personalInfo', 'linkedin', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- HERO CONTENT TAB --- */}
        <TabsContent value="hero" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>The main introduction on your landing page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="heroEyebrow">Eyebrow Text</Label>
                <Input id="heroEyebrow" value={formData.heroContent.eyebrow} onChange={(e) => handleNestedChange('heroContent', 'eyebrow', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Main Title</Label>
                <Textarea id="heroTitle" rows={2} className="text-lg font-medium" value={formData.heroContent.title} onChange={(e) => handleNestedChange('heroContent', 'title', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroDescription">Hero Description</Label>
                <Textarea id="heroDescription" rows={4} value={formData.heroContent.description} onChange={(e) => handleNestedChange('heroContent', 'description', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- ABOUT CONTENT TAB --- */}
        <TabsContent value="about" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="aboutTitle">About Title</Label>
                <Input id="aboutTitle" value={formData.aboutContent.title} onChange={(e) => handleNestedChange('aboutContent', 'title', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutDescription">Detailed Biography</Label>
                <Textarea id="aboutDescription" rows={6} value={formData.aboutContent.description} onChange={(e) => handleNestedChange('aboutContent', 'description', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- DYNAMIC ARRAYS (LISTS) TAB --- */}
        <TabsContent value="lists" className="space-y-6 mt-6">
          
          {/* ARRAY: HERO METRICS */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
              <div>
                <CardTitle className="text-lg">Hero Metrics</CardTitle>
                <CardDescription>Stats that appear in the hero grid.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => addArrayItem('heroMetrics', { value: "", label: "" })}>
                <Plus className="w-4 h-4 mr-2" /> Add Metric
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {formData.heroMetrics.map((metric, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-card shadow-sm relative group transition-all hover:border-primary/50">
                  <div className="space-y-1.5 flex-[1]">
                    <Label className="text-xs text-muted-foreground">Value</Label>
                    <Input value={metric.value} onChange={(e) => handleArrayChange('heroMetrics', index, 'value', e.target.value)} />
                  </div>
                  <div className="space-y-1.5 flex-[2]">
                    <Label className="text-xs text-muted-foreground">Label</Label>
                    <Input value={metric.label} onChange={(e) => handleArrayChange('heroMetrics', index, 'label', e.target.value)} />
                  </div>
                  <Button variant="ghost" size="icon" className="mt-6 text-muted-foreground hover:text-destructive" onClick={() => removeArrayItem('heroMetrics', index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {formData.heroMetrics.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">No metrics added.</p>}
            </CardContent>
          </Card>

          {/* ARRAY: STATUS PILLS */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
              <div>
                <CardTitle className="text-lg">Status Pills</CardTitle>
                <CardDescription>Small badges above the hero title.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => addArrayItem('statusPills', { label: "", icon: "Component" })}>
                <Plus className="w-4 h-4 mr-2" /> Add Pill
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {formData.statusPills.map((pill, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg bg-card shadow-sm">
                  <div className="space-y-1.5 flex-[2]">
                    <Label className="text-xs text-muted-foreground">Label</Label>
                    <Input value={pill.label} onChange={(e) => handleArrayChange('statusPills', index, 'label', e.target.value)} />
                  </div>
                  <div className="space-y-1.5 flex-[1]">
                    <Label className="text-xs text-muted-foreground">Lucide Icon Name</Label>
                    <Input value={pill.icon} onChange={(e) => handleArrayChange('statusPills', index, 'icon', e.target.value)} />
                  </div>
                  <Button variant="ghost" size="icon" className="mt-6 text-muted-foreground hover:text-destructive" onClick={() => removeArrayItem('statusPills', index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ARRAY: PROJECTS */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
              <div>
                <CardTitle className="text-lg flex items-center gap-2"><Code2 className="w-5 h-5"/> Projects</CardTitle>
                <CardDescription>Featured projects or case studies.</CardDescription>
              </div>
              <Button variant="default" size="sm" onClick={() => addArrayItem('projects', { title: "", eyebrow: "", description: "", stack: [], stat: "" })}>
                <Plus className="w-4 h-4 mr-2" /> Add Project
              </Button>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {formData.projects.map((project, index) => (
                <div key={index} className="p-5 border rounded-xl bg-card shadow-sm relative group">
                  <Button 
                    variant="destructive" size="icon" 
                    className="absolute -top-3 -right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={() => removeArrayItem('projects', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-primary uppercase">Project Title</Label>
                      <Input value={project.title} onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-primary uppercase">Eyebrow / Category</Label>
                      <Input value={project.eyebrow} onChange={(e) => handleArrayChange('projects', index, 'eyebrow', e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <Label className="text-xs font-semibold text-primary uppercase">Description</Label>
                    <Textarea rows={3} value={project.description} onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-primary uppercase">Tech Stack (Comma separated)</Label>
                      <Input 
                        value={project.stack?.join(', ') || ""} 
                        placeholder="React, Tailwind, Django"
                        onChange={(e) => handleArrayListChange('projects', index, 'stack', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-primary uppercase">Highlight Stat</Label>
                      <Input value={project.stat} placeholder="e.g. 70% faster load time" onChange={(e) => handleArrayChange('projects', index, 'stat', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Note: You can replicate the "Projects" card structure for "experience", "skillGroups", etc. using the same functions */}

        </TabsContent>

        {/* --- SETTINGS TAB --- */}
        <TabsContent value="settings" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Configurations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4 bg-card">
                <div className="space-y-1">
                  <Label className="text-base font-semibold">Public Access</Label>
                  <p className="text-sm text-muted-foreground">Toggle if this portfolio is visible to the public.</p>
                </div>
                <Switch checked={formData.isEnabled} onCheckedChange={handleToggleChange} />
              </div>

              <div className="grid gap-2 max-w-sm p-4 border rounded-lg bg-card">
                <Label htmlFor="orderIndex" className="font-semibold">Display Index</Label>
                <Input 
                  id="orderIndex" type="number" min={1}
                  value={formData.orderIndex}
                  onChange={(e) => setFormData(prev => ({ ...prev, orderIndex: parseInt(e.target.value) || 1 }))}
                />
                <p className="text-xs text-muted-foreground mt-1">Premium feature: Manage multiple portfolios by assigning them different indexes.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
      <Toaster position="bottom-right" />
    </div>
  )
}