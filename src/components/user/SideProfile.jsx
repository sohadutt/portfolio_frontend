import { useState, useEffect, useMemo, useRef } from "react"
import { 
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, 
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent 
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "@/components/ui/avatar"
import { toast } from "sonner"

// Make sure logoutUser and updateUserProfile are exported from your helper
import { updateUserProfile, toggleShareStatus, logoutUser, THEME_MAP } from "@/helper/functions" 
import { Save, User, Check, Copy, Camera, LogOut } from "lucide-react"

// Cropper Imports
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import heic2any from 'heic2any'

export function SideProfile({ profileData }) {
  const [formData, setFormData] = useState(profileData || {})
  const [loading, setLoading] = useState(false)
  
  // Avatar & Cropper State
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

  const handleThemeChange = (val) => {
    setFormData((prev) => ({ ...prev, theme_mode: Number(val) }))
  }

  // --- SHARE & VISIBILITY LOGIC ---
  const handleShareToggle = async () => {
    try {
      const res = await toggleShareStatus()
      setFormData(prev => ({ 
        ...prev, 
        enable_share_token: res.enable_share_token,
        share_token: res.share_token
      }))
      toast.success(res.enable_share_token ? "Portfolio is now public" : "Portfolio is now private")
    } catch (error) {
      toast.error(error.message || "Could not toggle sharing")
    }
  }

  const copyShareLink = () => {
    if (!formData?.share_token) return
    const frontendBase = window.location.origin 
    const link = `${frontendBase}/portfolio/${formData.share_token}`
    navigator.clipboard.writeText(link)
    toast.success("Share link copied!")
  }

  // --- IMAGE UPLOAD & HEIF HANDLING ---
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
        } catch (error) {
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

  // --- SAVING DATA ---
  const handleSave = async () => {
    setLoading(true)
    try {
      let dataToSend = formData
      
      if (newImageFile) {
        dataToSend = new FormData()
        Object.keys(formData).forEach(key => {
          if (key !== 'profile_picture') dataToSend.append(key, formData[key])
        })
        dataToSend.append('profile_picture', newImageFile)
      }

      await updateUserProfile(dataToSend)
      toast.success("Profile saved")
      setNewImageFile(null) 
    } catch (error) {
      toast.error(error.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  // --- AUTH LOGIC ---
  const handleLogout = async () => {
    try {
      await logoutUser()
      toast.success("Logged out successfully")
      // Redirect to login page
      window.location.href = "/login"
    } catch (error) {
      toast.error("Failed to log out")
    }
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b p-4">
          <div className="flex items-center gap-3">
            <div 
              className="group relative cursor-pointer" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="h-12 w-12 border shadow-sm transition-opacity group-hover:opacity-75">
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
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
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
                <Badge variant="secondary" className="h-4 px-1.5 py-0 text-[10px] uppercase tracking-wider">
                  {formData?.tier || "Premium"}
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
            <SidebarGroupLabel>Visibility & Sharing</SidebarGroupLabel>
            <SidebarGroupContent className="p-2 space-y-4">
              
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-card">
                <div className="space-y-0.5">
                  <Label htmlFor="share-toggle">Public Access</Label>
                  <p className="text-xs text-muted-foreground">
                    {formData?.enable_share_token ? "Portfolio is live" : "Portfolio is private"}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {formData?.enable_share_token && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={copyShareLink}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                  <Switch 
                    id="share-toggle" 
                    checked={formData?.enable_share_token || false} 
                    onCheckedChange={handleShareToggle}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="theme_select">Active Theme</Label>
                <Select value={String(formData?.theme_mode ?? 0)} onValueChange={handleThemeChange}>
                  <SelectTrigger id="theme_select">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(THEME_MAP).map(([key, value]) => (
                      <SelectItem key={key} value={key} className="capitalize">
                        {value.replace('theme-', '')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t p-4 space-y-2">
          {isDirty && (
            <Button 
              className="w-full shadow-sm" 
              onClick={handleSave}
              disabled={loading}
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          )}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </SidebarFooter>
      </Sidebar>

      {/* CROP MODAL */}
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