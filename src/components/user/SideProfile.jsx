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
import { Save, User, Check, Camera, Copy, LogOut, Loader2 } from "lucide-react"

import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

// Shared Cinematic Input Style
const sidebarInputClass = "h-10 rounded-xl border-border/40 bg-background/40 px-3 text-sm font-light backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/30 shadow-none"

export function SideProfile({ profileData }) {
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
      toast.success(response.enable_share_token ? "Access protocol enabled" : "Access restricted")
    } catch (error) {
      setFormData((prev) => ({
        ...prev,
        enable_share_token: previousEnabled,
        share_token: previousEnabled ? prev?.share_token : null,
      }))
      toast.error(error.message || "Protocol update failed")
    }
  }

  const copyShareLink = async () => {
    if (!formData?.share_token) return
    const link = `${window.location.origin}/portfolio/${formData.share_token}`
    await navigator.clipboard.writeText(link)
    toast.success("Link indexed to clipboard")
  }

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0]
      const fileExt = file.name.split('.').pop().toLowerCase()

      if (fileExt === 'heic' || fileExt === 'heif') {
        toast.loading("Converting HEIC buffer...", { id: "heic-convert" })
        try {
          const { default: heic2any } = await import('heic2any')
          const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" })
          file = new File([convertedBlob], "converted.jpg", { type: "image/jpeg" })
          toast.success("Conversion successful", { id: "heic-convert" })
        } catch {
          toast.error("Process interrupted", { id: "heic-convert" })
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
      toast.success("Profile sync complete")
      setNewImageFile(null) 
    } catch (error) {
      toast.error(error.message || "Sync failed")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast.success("Terminal session ended")
      window.location.href = "/login"
    } catch {
      toast.error("Termination failed")
    }
  }

  return (
    <>
      <Sidebar variant="inset" collapsible="icon" className="border-r border-border/30 bg-background/40 backdrop-blur-3xl">
        <SidebarHeader className="border-b border-border/20 p-5">
          <div className="flex items-center gap-4">
            <div 
              className="group relative flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-border/40 bg-card/40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-primary/40 focus-within:outline-none" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="h-full w-full rounded-[inherit] transition-opacity group-hover:opacity-40">
                <AvatarImage src={previewImage || formData?.profile_picture} alt={formData?.username} className="object-cover" />
                <AvatarFallback className="bg-primary/10 font-medium text-primary">
                  {initials}
                </AvatarFallback>
                {formData?.is_verified && (
                  <AvatarBadge className="flex h-4.5 w-4.5 items-center justify-center border-2 border-background bg-primary p-0 shadow-[0_0_10px_rgba(var(--primary),0.5)]">
                    <Check className="h-3 w-3 text-primary-foreground" strokeWidth={4} />
                  </AvatarBadge>
                )}
              </Avatar>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                <Camera className="h-5 w-5 text-primary" />
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
                <span className="truncate text-base font-medium tracking-tight text-foreground">
                  {formData?.username || "Guest"}
                </span>
                <Badge variant="secondary" className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0 text-[9px] font-bold uppercase tracking-[0.1em] text-primary">
                  {TIER_MAP?.[formData?.tier] || "Premium"}
                </Badge>
              </div>
              <span className="truncate text-xs font-light tracking-wide text-muted-foreground">
                {formData?.email}
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="gap-0 py-2">
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">Identity</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-4 p-4">
              <div className="space-y-1.5">
                <Label htmlFor="first_name" className="text-xs font-medium tracking-wide text-muted-foreground">First Name</Label>
                <Input id="first_name" name="first_name" className={sidebarInputClass} value={formData?.first_name || ""} onChange={handleChange} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name" className="text-xs font-medium tracking-wide text-muted-foreground">Last Name</Label>
                <Input id="last_name" name="last_name" className={sidebarInputClass} value={formData?.last_name || ""} onChange={handleChange} />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">Preferences</SidebarGroupLabel>
            <SidebarGroupContent className="p-4">             
              <div className="space-y-1.5">
                <Label htmlFor="theme_mode" className="text-xs font-medium tracking-wide text-muted-foreground">Visual Theme</Label>
                <Select 
                  value={String(formData?.theme_mode ?? "0")} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, theme_mode: val }))}
                >
                  <SelectTrigger id="theme_mode" className="h-10 rounded-xl border-border/40 bg-background/40 font-light backdrop-blur-sm transition-all focus:border-primary/50 focus:ring-0">
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent className="border-border/30 bg-background/80 backdrop-blur-2xl">
                    {Object.entries(THEME_MAP).map(([key, val]) => (
                      <SelectItem key={key} value={key} className="text-sm font-light">
                        {val.replace("theme-", "").charAt(0).toUpperCase() + val.replace("theme-", "").slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">Deployment</SidebarGroupLabel>
            <SidebarGroupContent className="p-4">  
              <div className="group relative flex items-center justify-between gap-4 rounded-2xl border border-border/30 bg-card/20 p-4 transition-all duration-500 hover:border-primary/30">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium tracking-tight text-foreground">Visibility</p>
                  <p className="text-[11px] font-light text-muted-foreground">
                    {formData?.enable_share_token ? "Public Live" : "Private Node"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {formData?.enable_share_token && formData?.share_token && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-lg text-primary hover:bg-primary/10"
                      onClick={copyShareLink}
                      title="Copy indexed link"
                    >
                      <Copy className="size-3.5" />
                    </Button>
                  )}
                  <Switch
                    id="sidebar-share-toggle"
                    checked={formData?.enable_share_token || false}
                    onCheckedChange={handleShareToggle}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/20 p-5 space-y-3">
          {isDirty && (
            <Button 
              className="h-11 w-full rounded-xl font-medium shadow-[0_0_20px_rgba(var(--primary),0.2)] transition-all duration-500 hover:scale-[1.02]" 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {loading ? "Syncing..." : "Commit Changes"}
            </Button>
          )}
          <Button 
            variant="ghost" 
            className="h-11 w-full justify-start rounded-xl text-sm font-light text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" 
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            End Session
          </Button>
        </SidebarFooter>
      </Sidebar>

      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="max-w-md border-border/30 bg-background/80 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium tracking-tight">Adjust Frame</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-card/20 p-4">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img ref={imgRef} src={imgSrc} alt="Buffer" onLoad={onImageLoad} className="max-h-[50vh] object-contain" />
              </ReactCrop>
            )}
          </div>
          <DialogFooter className="gap-3 sm:gap-0">
            <Button variant="outline" className="rounded-full border-border/50 bg-card/30" onClick={() => setIsCropModalOpen(false)}>Cancel</Button>
            <Button className="rounded-full px-6 shadow-none" onClick={generateCroppedImage}>Apply Protocol</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}