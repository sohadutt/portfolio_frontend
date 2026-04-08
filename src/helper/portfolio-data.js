import * as LucideIcons from "lucide-react"
import {
  aboutContent as defaultAboutContent,
  contactMethods as defaultContactMethods,
  experience as defaultExperience,
  featuredModules as defaultFeaturedModules,
  footerLinks as defaultFooterLinks,
  heroContent as defaultHeroContent,
  heroMetrics as defaultHeroMetrics,
  navigationLinks as defaultNavigationLinks,
  personalInfo as defaultPersonalInfo,
  projects as defaultProjects,
  showcaseCategories as defaultShowcaseCategories,
  skillGroups as defaultSkillGroups,
  statusPills as defaultStatusPills,
} from "@/helper/portfolio"

const normalizeIconName = (value = "") => value.replace(/[-_\s]/g, "").toLowerCase()

export const resolveIcon = (iconName, fallback = LucideIcons.Component) => {
  if (typeof iconName === "function") return iconName
  if (!iconName) return fallback

  const matchedKey = Object.keys(LucideIcons).find(
    (key) => normalizeIconName(key) === normalizeIconName(iconName)
  )

  return matchedKey ? LucideIcons[matchedKey] : fallback
}

export const getPortfolioPersonalInfo = (data) => data?.personalInfo || defaultPersonalInfo
export const getNavigationLinks = (data) => data?.navigationLinks?.length ? data.navigationLinks : defaultNavigationLinks
export const getHeroContent = (data) => data?.heroContent || defaultHeroContent
export const getHeroMetrics = (data) => data?.heroMetrics?.length ? data.heroMetrics : defaultHeroMetrics
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
  if (Array.isArray(experience)) return experience
  if (Array.isArray(experience?.results)) return experience.results
  return defaultExperience
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
