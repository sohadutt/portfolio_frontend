import * as LucideIcons from "lucide-react"
import {
  aboutContent as defaultAboutContent,
  contactMethods as defaultContactMethods,
  experience as defaultExperience,
  featuredModules as defaultFeaturedModules,
  footerLinks as defaultFooterLinks,
  heroActions as defaultHeroActions,
  heroBadges as defaultHeroBadges,
  heroContent as defaultHeroContent,
  heroFocus as defaultHeroFocus,
  heroHighlights as defaultHeroHighlights,
  heroMetrics as defaultHeroMetrics,
  navigationLinks as defaultNavigationLinks,
  pageCopy as defaultPageCopy,
  personalInfo as defaultPersonalInfo,
  projects as defaultProjects,
  sectionCopy as defaultSectionCopy,
  showcaseCategories as defaultShowcaseCategories,
  skillGroups as defaultSkillGroups,
  statusPills as defaultStatusPills,
} from "@/helper/portfolio"

const normalizeIconName = (value = "") => value.replace(/[-_\s]/g, "").toLowerCase()

const ensureArray = (value) => (Array.isArray(value) ? value : [])

const normalizeExperienceItem = (item = {}) => ({
  ...item,
  highlights: ensureArray(item.highlights),
  relatedComponents: ensureArray(item.relatedComponents),
})

export const resolveIcon = (iconName, fallback = LucideIcons.Component) => {
  if (typeof iconName === "function") return iconName
  if (!iconName) return fallback

  const matchedKey = Object.keys(LucideIcons).find(
    (key) => normalizeIconName(key) === normalizeIconName(iconName)
  )

  return matchedKey ? LucideIcons[matchedKey] : fallback
}

export const getPortfolioPersonalInfo = (data) => data?.personalInfo || defaultPersonalInfo
export const getPortfolioProfileImage = (data) =>
  data?.profile_picture ||
  data?.profilePicture ||
  data?.personalInfo?.profile_picture ||
  data?.personalInfo?.profilePicture ||
  null
export const getNavigationLinks = (data) => data?.navigationLinks?.length ? data.navigationLinks : defaultNavigationLinks
export const getHeroContent = (data) => data?.heroContent || defaultHeroContent
export const getHeroActions = (data) => ({
  primary: { ...defaultHeroActions.primary, ...(data?.heroActions?.primary || {}) },
  secondary: { ...defaultHeroActions.secondary, ...(data?.heroActions?.secondary || {}) },
})
export const getHeroMetrics = (data) => data?.heroMetrics?.length ? data.heroMetrics : defaultHeroMetrics
export const getHeroFocus = (data) => ({
  ...defaultHeroFocus,
  ...(data?.heroFocus || {}),
  areas: ensureArray(data?.heroFocus?.areas).length
    ? ensureArray(data?.heroFocus?.areas)
    : defaultHeroFocus.areas,
})
export const getHeroBadges = (data) => data?.heroBadges?.length ? data.heroBadges : defaultHeroBadges
export const getHeroHighlights = (data) => data?.heroHighlights?.length ? data.heroHighlights : defaultHeroHighlights
export const getAboutContent = (data) => data?.aboutContent || defaultAboutContent
export const getSkillGroups = (data) => data?.skillGroups?.length ? data.skillGroups : defaultSkillGroups
export const getProjects = (data) => {
  const projects = data?.projects
  if (Array.isArray(projects)) return projects
  if (Array.isArray(projects?.results)) return projects.results
  return defaultProjects
}
export const getExperience = (data) => {
  const experience = data?.experience
  if (Array.isArray(experience)) return experience.map(normalizeExperienceItem)
  if (Array.isArray(experience?.results)) return experience.results.map(normalizeExperienceItem)
  return defaultExperience.map(normalizeExperienceItem)
}
export const getFeaturedModules = (data) =>
  (data?.featuredModules?.length ? data.featuredModules : defaultFeaturedModules).map((item) => ({
    ...item,
    icon: resolveIcon(item.icon || item.icon_name, LucideIcons.Blocks),
  }))
export const getShowcaseCategories = (data) =>
  (data?.showcaseCategories?.length ? data.showcaseCategories : defaultShowcaseCategories).map((item) => ({
    ...item,
    icon: resolveIcon(item.icon || item.icon_name, LucideIcons.LayoutPanelTop),
  }))
export const getContactMethods = (data) =>
  (data?.contactMethods?.length ? data.contactMethods : defaultContactMethods).map((item) => ({
    ...item,
    icon: resolveIcon(item.icon || item.icon_name, LucideIcons.Mail),
  }))
export const getFooterLinks = (data) => data?.footerLinks?.length ? data.footerLinks : defaultFooterLinks
export const getStatusPills = (data) =>
  (data?.statusPills?.length ? data.statusPills : defaultStatusPills).map((item) => ({
    ...item,
    icon: resolveIcon(item.icon || item.icon_name, LucideIcons.Component),
  }))
export const getSectionCopy = (data) => ({
  ...defaultSectionCopy,
  ...(data?.sectionCopy || {}),
  about: { ...defaultSectionCopy.about, ...(data?.sectionCopy?.about || {}) },
  projects: { ...defaultSectionCopy.projects, ...(data?.sectionCopy?.projects || {}) },
  experience: { ...defaultSectionCopy.experience, ...(data?.sectionCopy?.experience || {}) },
  components: { ...defaultSectionCopy.components, ...(data?.sectionCopy?.components || {}) },
  contact: { ...defaultSectionCopy.contact, ...(data?.sectionCopy?.contact || {}) },
})
export const getPageCopy = (data) => ({ ...defaultPageCopy, ...(data?.pageCopy || {}) })
