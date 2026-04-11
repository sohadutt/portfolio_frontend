import { useState, useEffect, useMemo, useRef } from "react"
import { 
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, 
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent 
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { 
  Field, FieldContent, FieldDescription, FieldLabel 
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

import { updateUserProfile, logoutUser, toggleShareStatus, TIER_MAP, THEME_MAP } from "@/helper/functions" 
import { useTheme } from "@/hooks/use-theme" 
import { Save, User, Check, Camera, Copy, LogOut, Moon, Sun } from "lucide-react"

import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import heic2any from 'heic2any'

export function SideProfile({ profileData }) {
  const { theme, setTheme } = useTheme() 
  const [formData, setFormData] = useState(profileData || {})
  const [loading, setLoading] = useState(false)
  
  const fileInputRef = useRef(null)
  const imgRef = useRef(null)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [imgSrc, setImgSrc] = useState("")
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState(null)
  const [newImageFile, setNewImageFile] = useState(null) 
  const [previewImage, setPreviewImage] = useState(null) 

  useEffect(() => {
    if (profileData) setFormData(profileData)
  }, [profileData])

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(profileData) || newImageFile !== null
  }, [formData, profileData, newImageFile])

  const initials = useMemo(() => {
    if (!formData?.username) return <User className="size-4" />
    return formData.username.slice(0, 2).toUpperCase()
  }, [formData?.username])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleShareToggle = async (pressed) => {
    const previousEnabled = formData?.enable_share_token || false
    setFormData((prev) => ({
      ...prev,
      enable_share_token: pressed,
      share_token: pressed ? prev?.share_token : null,
    }))

    try {
      const response = await toggleShareStatus({ enable_share_token: pressed })
      setFormData((prev) => ({
        ...prev,
        enable_share_token: response.enable_share_token,
        share_token: response.share_token ?? prev?.share_token,
      }))
      toast.success(response.enable_share_token ? "Share access enabled" : "Share access disabled")
    } catch (error) {
      setFormData((prev) => ({
        ...prev,
        enable_share_token: previousEnabled,
        share_token: previousEnabled ? prev?.share_token : null,
      }))
      toast.error(error.message || "Could not update share access")
    }
  }

  const copyShareLink = async () => {
    if (!formData?.share_token) return
    const link = `${window.location.origin}/portfolio/${formData.share_token}`
    await navigator.clipboard.writeText(link)
    toast.success("Share link copied")
  }

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0]
      const fileExt = file.name.split('.').pop().toLowerCase()

      if (fileExt === 'heic' || fileExt === 'heif') {
        toast.loading("Converting HEIC image...", { id: "heic-convert" })
        try {
          const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" })
          file = new File([convertedBlob], "converted.jpg", { type: "image/jpeg" })
          toast.success("Converted successfully!", { id: "heic-convert" })
        } catch {
          toast.error("Failed to process HEIC image.", { id: "heic-convert" })
          return
        }
      }

      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '')
        setIsCropModalOpen(true)
      })
      reader.readAsDataURL(file)
      e.target.value = '' 
    }
  }

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget
    const crop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, 1, width, height),
      width,
      height
    )
    setCrop(crop)
  }

  const generateCroppedImage = async () => {
    if (!imgRef.current || !completedCrop) return

    const canvas = document.createElement('canvas')
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height
    canvas.width = completedCrop.width
    canvas.height = completedCrop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX, completedCrop.y * scaleY,
      completedCrop.width * scaleX, completedCrop.height * scaleY,
      0, 0,
      completedCrop.width, completedCrop.height
    )

    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" })
      setNewImageFile(file)
      setPreviewImage(URL.createObjectURL(blob))
      setIsCropModalOpen(false)
    }, 'image/jpeg', 0.95)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const themeModeInt = parseInt(formData?.theme_mode ?? 0, 10)

      let dataToSend = {
        first_name: formData?.first_name || "",
        last_name: formData?.last_name || "",
        theme_mode: themeModeInt, 
      }
      
      if (newImageFile) {
        dataToSend = new FormData()
        dataToSend.append("first_name", formData?.first_name || "")
        dataToSend.append("last_name", formData?.last_name || "")
        dataToSend.append("theme_mode", themeModeInt) 
        dataToSend.append('profile_picture', newImageFile)
      }

      const response = await updateUserProfile(dataToSend)
      const updatedProfile = response?.data || response
      setFormData((prev) => ({
        ...prev,
        first_name: updatedProfile?.first_name ?? prev.first_name,
        last_name: updatedProfile?.last_name ?? prev.last_name,
        profile_picture: updatedProfile?.profile_picture ?? prev.profile_picture,
        theme_mode: updatedProfile?.theme_mode ?? prev.theme_mode,
      }))
      toast.success("Profile saved")
      setNewImageFile(null) 
    } catch (error) {
      toast.error(error.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast.success("Logged out successfully")
      window.location.href = "/login"
    } catch {
      toast.error("Failed to log out")
    }
  }

  return (
    <>
      <Sidebar variant="inset" collapsible="icon" className="border-r">
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div 
              className="group relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full focus-within:outline-none" 
              onClick={() => fileInputRef.current?.click()}
              title="Update profile picture"
            >
              <Avatar className="h-full w-full border shadow-sm transition-opacity group-hover:opacity-75">
                <AvatarImage src={previewImage || formData?.profile_picture} alt={formData?.username} className="object-cover" />
                <AvatarFallback className="bg-muted font-medium text-muted-foreground">
                  {initials}
                </AvatarFallback>
                {formData?.is_verified && (
                  <AvatarBadge className="flex h-4 w-4 items-center justify-center border-2 border-background bg-blue-500 p-0">
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />
                  </AvatarBadge>
                )}
              </Avatar>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <Camera className="h-4 w-4 text-white" />
              </div>
              <input
                type="file"
                accept="image/*,.heic,.heif"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold leading-none">
                  {formData?.username || "Guest"}
                </span>
                <Badge variant="secondary" className="h-5 rounded-full px-2 py-0 text-[10px] uppercase tracking-wider">
                  {TIER_MAP?.[formData?.tier] || "Premium"}
                </Badge>
              </div>
              <span className="truncate text-xs leading-none text-muted-foreground">
                {formData?.email}
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="gap-0">
          <SidebarGroup>
            <SidebarGroupLabel>Personal Info</SidebarGroupLabel>
            <SidebarGroupContent className="p-2 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" name="first_name" value={formData?.first_name || ""} onChange={handleChange} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" name="last_name" value={formData?.last_name || ""} onChange={handleChange} />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Preferences</SidebarGroupLabel>
            <SidebarGroupContent className="p-2 space-y-4">             
              <div className="space-y-1.5 px-1">
                <Label htmlFor="theme_mode" className="text-xs text-muted-foreground tracking-wider">Portfolio Theme</Label>
                <Select 
                  value={String(formData?.theme_mode ?? "0")} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, theme_mode: val }))}
                >
                  <SelectTrigger id="theme_mode" className="w-full bg-background shadow-sm">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(THEME_MAP).map(([key, val]) => (
                      <SelectItem key={key} value={key}>
                        {val.replace("theme-", "").charAt(0).toUpperCase() + val.replace("theme-", "").slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Visibility</SidebarGroupLabel>
            <SidebarGroupContent className="p-2 space-y-4">  
              <Field orientation="horizontal" className="rounded-2xl border border-border/60 bg-background p-3 shadow-sm w-full">
                <FieldContent>
                  <FieldLabel htmlFor="sidebar-share-toggle">
                    Share access
                  </FieldLabel>
                  <FieldDescription>
                    {formData?.enable_share_token ? "Portfolio is Public" : "Portfolio is Private"}
                  </FieldDescription>
                </FieldContent>
                <div className="flex gap-2">
                  {formData?.enable_share_token && formData?.share_token && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-full"
                      onClick={copyShareLink}
                    >
                      <Copy className="size-4" />
                    </Button>
                  )}
                  <Switch
                    id="sidebar-share-toggle"
                    checked={formData?.enable_share_token || false}
                    onCheckedChange={handleShareToggle}
                  />
                </div>
              </Field>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-4 space-y-2">
          {isDirty && (
            <Button 
              className="w-full rounded-full shadow-none" 
              onClick={handleSave}
              disabled={loading}
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          )}
          <Button 
            variant="ghost" 
            className="w-full justify-start rounded-full text-muted-foreground hover:text-foreground" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </SidebarFooter>
      </Sidebar>
      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center rounded-md bg-muted/30 p-4">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img ref={imgRef} src={imgSrc} alt="Upload" onLoad={onImageLoad} className="max-h-[50vh] object-contain" />
              </ReactCrop>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropModalOpen(false)}>Cancel</Button>
            <Button onClick={generateCroppedImage}>Apply Crop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}