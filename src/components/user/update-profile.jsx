import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import AvatarCropper from './avatar-cropper'; 
import { update_user_profile, get_user_profile, THEME_MAP } from '@/data/functions';
import { Loader2, Check } from 'lucide-react';

const ProfileForm = () => {
    const [profile, setProfile] = useState({ 
        firstName: '', 
        lastName: '', 
        avatarUrl: null, 
        themeMode: 0 
    });
    const [tempBlob, setTempBlob] = useState(null);
    const [tempPreview, setTempPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const themeNames = ['Ocean', 'Forest', 'Desert', 'Space', 'Sunset'];
    const themeColors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-600', 'bg-purple-500', 'bg-orange-500'];

    useEffect(() => {
        get_user_profile().then(data => {
            setProfile({
                firstName: data.first_name || '',
                lastName: data.last_name || '',
                avatarUrl: data.profile_picture,
                themeMode: data.theme_mode || 0
            });
        }).catch(() => toast.error("Failed to fetch profile data"));
    }, []);

    const handleThemeSelect = async (modeIndex) => {
        const newMode = parseInt(modeIndex);
        setProfile(prev => ({ ...prev, themeMode: newMode }));
        
        const themeClass = THEME_MAP[newMode];
        Object.values(THEME_MAP).forEach(t => document.documentElement.classList.remove(t));
        document.documentElement.classList.add(themeClass);
        
        try {
            await update_user_profile({ theme_mode: newMode });
            toast.success(`${themeNames[newMode]} theme applied`);
        } catch (err) {
            toast.error("Preference saved locally, but failed to sync to cloud.");
        }
    };

    const handleCropSave = (blob) => {
        setTempBlob(blob);
        if (tempPreview) URL.revokeObjectURL(tempPreview);
        setTempPreview(URL.createObjectURL(blob));
        toast.info("Avatar ready for synchronization");
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const fd = new FormData();
        fd.append('first_name', profile.firstName);
        fd.append('last_name', profile.lastName);
        
        if (tempBlob) {
            // Filename 'avatar.jpg' ensures MultiPartParser detects the file correctly
            fd.append('profile_picture', tempBlob, 'avatar.jpg');
        }

        try {
            // Second arg 'true' triggers the aggressive header cleaning in functions.js
            const res = await update_user_profile(fd, true);
            const updatedData = res.data || res;

            setProfile({
                firstName: updatedData.first_name || '',
                lastName: updatedData.last_name || '',
                avatarUrl: updatedData.profile_picture || null,
                themeMode: updatedData.theme_mode || 0
            });
            
            setTempBlob(null);
            setTempPreview(null);
            toast.success("Identity synchronized with system");
        } catch (err) {
            console.error("Sync Error:", err);
            toast.error(err?.detail || "Server synchronization failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-border/60 bg-card/50 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="font-serif text-2xl tracking-tight">Portfolio Aesthetic</CardTitle>
                    <CardDescription>Choose the primary visual mode for your public workspace.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                        {themeNames.map((name, index) => {
                            const isSelected = profile.themeMode === index;
                            return (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => handleThemeSelect(index)}
                                    className={`group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 transition-all duration-300 ${
                                        isSelected 
                                        ? 'border-primary bg-primary/5 ring-4 ring-primary/10' 
                                        : 'border-border/40 hover:border-primary/40 hover:bg-muted/50'
                                    }`}
                                >
                                    <div className={`size-3 rounded-full shadow-sm transition-transform group-hover:scale-125 ${themeColors[index]}`} />
                                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {name}
                                    </span>
                                    {isSelected && <div className="absolute right-2 top-2"><Check className="size-3 text-primary" /></div>}
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/50 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="font-serif text-2xl tracking-tight">Identity & Avatar</CardTitle>
                    <CardDescription>Update your public-facing details and profile image.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-10">
                        <div className="flex justify-center pt-2">
                            <AvatarCropper 
                                currentAvatarUrl={tempPreview || profile.avatarUrl} 
                                onCropSave={handleCropSave} 
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">First Name</Label>
                                <Input 
                                    value={profile.firstName} 
                                    onChange={e => setProfile({...profile, firstName: e.target.value})}
                                    className="h-12 rounded-xl border-border/60 bg-background/50"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Last Name</Label>
                                <Input 
                                    value={profile.lastName} 
                                    onChange={e => setProfile({...profile, lastName: e.target.value})}
                                    className="h-12 rounded-xl border-border/60 bg-background/50"
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full rounded-full py-7 font-bold uppercase tracking-widest shadow-2xl shadow-primary/20" 
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : "Synchronize Identity"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileForm;