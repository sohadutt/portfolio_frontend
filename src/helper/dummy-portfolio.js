// Initialize with a completely EMPTY state so nothing is accidentally saved
export const initialFormState = (portfolioIndex) => {
  return {
    isEnabled: true,
    orderIndex: portfolioIndex,
    personalInfo: { name: "", shortName: "", title: "", subtitle: "", location: "", email: "", github: "", linkedin: "" },
    heroContent: { eyebrow: "", title: "", description: "" },
    heroActions: { primary: { label: "", href: "" }, secondary: { label: "", href: "" } },
    heroFocus: { eyebrow: "", title: "", areas: [] },
    heroBadges: [],
    heroHighlights: [],
    aboutContent: { title: "", description: "" },
    sectionCopy: {
      projects: { eyebrow: "", title: "", description: "" },
      experience: { eyebrow: "", title: "", description: "" },
      components: { eyebrow: "", title: "", description: "" },
      contact: { eyebrow: "", title: "", description: "" },
    },
    pageCopy: { loadingTitle: "", loadingDescription: "" },
    navigationLinks: [],
    heroMetrics: [],
    skillGroups: [],
    projects: [],
    experience: [],
    showcaseCategories: [],
    featuredModules: [],
    contactMethods: [],
    footerLinks: [],
    statusPills: [],
  }
}

export const templates = {
  navigationLinks: { label: "", href: "", icon: "Link2" },
  heroMetrics: { value: "", label: "", icon: "Sparkles" },
  heroBadges: { label: "" },
  heroHighlights: { title: "", description: "", icon: "FileText" },
  heroFocusAreas: { label: "", value: 0, icon: "Sparkles" },
  skillGroups: { title: "", description: "", items: [], icon: "Sparkles" },
  projects: { title: "", eyebrow: "", description: "", stack: [], stat: "", icon: "Globe" },
  experience: {
    period: "",
    title: "",
    company: "",
    relation: "",
    summary: "",
    highlights: [],
    relatedComponents: [],
    icon: "User"
  },
  showcaseCategories: { title: "", relation: "", preview: "", items: [], icon: "Component" },
  featuredModules: { title: "", relation: "", body: "", details: "", icon: "Blocks" },
  contactMethods: { label: "", value: "", href: "", icon: "Mail" },
  footerLinks: { label: "", href: "", icon: "Globe" },
  statusPills: { label: "", icon: "Component" },
}