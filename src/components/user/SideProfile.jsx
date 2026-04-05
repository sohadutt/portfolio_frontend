import { useState, useEffect, useMemo, useRef } from "react"
import { 
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, 
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent 
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "@/components/ui/avatar"
import { toast } from "sonner"
import { update_user_profile, status_share_token, THEME_MAP } from "@/helper/functions" 
import { Save, User, Check, Copy, Camera } from "lucide-react"

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

  // Mark as dirty if form changed OR if a new image is selected
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(profileData) || newImageFile !== null
  }, [formData, profileData, newImageFile])

  const initials = useMemo(() => {
    if (!formData?.username) return <User size={16} />
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
      const res = await status_share_token()
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
      let isMultipart = false

      if (newImageFile) {
        dataToSend = new FormData()
        Object.keys(formData).forEach(key => {
          if (key !== 'profile_picture') dataToSend.append(key, formData[key])
        })
        dataToSend.append('profile_picture', newImageFile)
        isMultipart = true
      }

      await update_user_profile(dataToSend, isMultipart)
      toast.success("Profile saved")
      setNewImageFile(null) 
    } catch (error) {
      toast.error(error.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader className="p-4 border-b">
          <div className="flex items-center gap-3">
            {/* Clickable Avatar Group */}
            <div 
              className="relative group cursor-pointer" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar size="lg" className="border shadow-sm group-hover:opacity-75 transition-opacity">
                <AvatarImage src={previewImage || formData?.profile_picture} alt={formData?.username} className="object-cover" />
                <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                  {initials}
                </AvatarFallback>
                {formData?.is_verified && (
                  <AvatarBadge className="bg-blue-500 border-2 border-background flex items-center justify-center p-0.5">
                    <Check className="text-white w-2.5 h-2.5" strokeWidth={4} />
                  </AvatarBadge>
                )}
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white w-4 h-4" />
              </div>
              <input 
                type="file" 
                accept="image/*,.heic,.heif" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect} 
              />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm truncate">{formData?.username || "Guest"}</span>
              <span className="text-xs text-muted-foreground truncate">{formData?.email}</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="gap-0">
          <SidebarGroup>
            <SidebarGroupLabel className="px-3">Personal Info</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-3 p-3">
              <div className="grid gap-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">First Name</label>
                <Input name="first_name" value={formData?.first_name || ""} onChange={handleChange} className="h-8 text-sm" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Last Name</label>
                <Input name="last_name" value={formData?.last_name || ""} onChange={handleChange} className="h-8 text-sm" />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="px-3">Visibility & Sharing</SidebarGroupLabel>
            <SidebarGroupContent className="p-3 space-y-4">
              
              {/* Restored Share Switch Card */}
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm bg-card/50">
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor="share-toggle" className="text-xs font-bold cursor-pointer">
                    Public Access
                  </Label>
                  <span className="text-[10px] text-muted-foreground">
                    {formData?.enable_share_token ? "Live" : "Private"}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  {formData?.enable_share_token && (
                     <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7 animate-in zoom-in duration-200" 
                      onClick={copyShareLink}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                  <Switch 
                    id="share-toggle" 
                    checked={formData?.enable_share_token || false} 
                    onCheckedChange={handleShareToggle}
                    size="sm"
                  />
                </div>
              </div>

              {/* Theme Selector */}
              <div className="grid gap-1.5 px-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Active Theme</label>
                <Select value={String(formData?.theme_mode ?? 0)} onValueChange={handleThemeChange}>
                  <SelectTrigger className="h-8 text-xs bg-background">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(THEME_MAP).map(([key, value]) => (
                      <SelectItem key={key} value={key} className="text-xs capitalize">
                        {value.replace('theme-', '')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t h-20 flex items-center">
          {isDirty && (
            <Button 
              className="w-full animate-in fade-in slide-in-from-bottom-3 duration-300 shadow-xl" 
              onClick={handleSave}
              disabled={loading}
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </SidebarFooter>
      </Sidebar>

      {/* CROP MODAL */}
      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-muted/30 rounded-md">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1} // Locks aspect ratio to a square
                circularCrop // Visual circle guide
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