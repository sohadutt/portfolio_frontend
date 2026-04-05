import { useState, useEffect, useMemo } from "react"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarGroupContent 
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { update_user_profile, THEME_MAP } from "@/helper/functions" 
import { Save, User } from "lucide-react"

export function SideProfile({ profileData }) {
  const [formData, setFormData] = useState(profileData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFormData(profileData)
  }, [profileData])

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(profileData)
  }, [formData, profileData])

  const handleChange = (e) => {
    const { name, value, type } = e.target
    const updatedValue = name === "theme_mode" || type === "number" ? Number(value) : value
    setFormData((prev) => ({ ...prev, [name]: updatedValue }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await update_user_profile(formData)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error(error.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={formData.profile_picture} alt={formData.username} />
            <AvatarFallback><User size={18} /></AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm truncate">{formData.username}</span>
            <span className="text-xs text-muted-foreground truncate">{formData.email}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupLabel>Personal Info</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-3 p-2">
            <div className="grid gap-1.5">
              <label htmlFor="first_name" className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                First Name
              </label>
              <Input 
                id="first_name"
                name="first_name" 
                value={formData.first_name || ""} 
                onChange={handleChange} 
                placeholder="Enter first name"
              />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="last_name" className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                Last Name
              </label>
              <Input 
                id="last_name"
                name="last_name" 
                value={formData.last_name || ""} 
                onChange={handleChange} 
                placeholder="Enter last name"
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Preferences</SidebarGroupLabel>
          <SidebarGroupContent className="p-2">
             <div className="grid gap-1.5">
              <label htmlFor="theme_mode" className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                Active Theme
              </label>
              <select 
                id="theme_mode"
                name="theme_mode"
                value={formData.theme_mode}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {Object.entries(THEME_MAP).map(([key, value]) => (
                  <option key={key} value={key} className="bg-background text-foreground">
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t h-20 flex items-center">
        {isDirty && (
          <Button 
            className="w-full animate-in fade-in slide-in-from-bottom-3 duration-300" 
            onClick={handleSave}
            disabled={loading}
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}