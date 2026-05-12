import { createElement, useMemo, useState } from "react"
import { Check, ChevronsUpDown, Search, Component } from "lucide-react"

import lucideData from "@/helper/tags.json"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { resolveIcon } from "@/helper/functions"

function IconTile({ iconName, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(iconName)}
      className={`group relative flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        selected
          ? "border-primary/40 bg-primary/10 shadow-[0_0_20px_0_color-mix(in_oklch,var(--primary)_10%,transparent)]"
          : "border-border/30 bg-card/20 hover:border-primary/30 hover:bg-card/40"
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            selected 
              ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] scale-105" 
              : "border border-primary/20 bg-primary/10 text-primary group-hover:scale-110"
        }`}>
          {createElement(resolveIcon(iconName, Component), { className: "size-5" })}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium tracking-tight text-foreground">
            {iconName.replace(/-/g, ' ')}
          </p>
          <p className="truncate text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-0.5">
            {iconName}
          </p>
        </div>
      </div>
      
      {selected && (
        <Check className="size-5 text-primary shrink-0 animate-in zoom-in duration-300" />
      )}
    </button>
  )
}

export function LucideIconPicker({
  value,
  onChange,
  title = "Choose an icon",
  description = "Search and select a Lucide icon for this module.",
}) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredIcons = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return Object.entries(lucideData)
      .filter(([key, tags]) => {
        if (!query) return true
        if (key.toLowerCase().includes(query)) return true
        return Array.isArray(tags) && tags.some((tag) => tag.toLowerCase().includes(query))
      })
      .map(([key]) => key)
  }, [searchTerm])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          className="h-12 w-full justify-between rounded-xl border-border/40 bg-card/20 px-4 font-light backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-primary/40 hover:bg-card/40 shadow-none"
        >
          <span className="flex items-center gap-3 truncate">
            <div className="flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              {createElement(resolveIcon(value, Component), { className: "size-4" })}
            </div>
            <span className="truncate text-sm tracking-wide font-medium">
              {value ? value.replace(/-/g, ' ') : "Select an icon"}
            </span>
          </span>
          <ChevronsUpDown className="size-4 text-muted-foreground shrink-0" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden rounded-[2.5rem] border-border/30 bg-background/60 backdrop-blur-2xl shadow-2xl">
        <DialogHeader className="relative border-b border-border/30 px-8 py-8">
          {/* Header Glow */}
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-[40px] pointer-events-none" />
          
          <div className="relative z-10">
            <DialogTitle className="text-3xl font-medium tracking-tight text-foreground">{title}</DialogTitle>
            <DialogDescription className="mt-1.5 text-base font-light text-muted-foreground">{description}</DialogDescription>
            
            <div className="relative mt-8">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by icon name or tag..."
                className="h-12 w-full rounded-full border-border/40 bg-card/40 pl-11 text-base font-light backdrop-blur-sm transition-all duration-500 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/40"
              />
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[500px] bg-transparent">
          <div className="px-8 py-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredIcons.map((iconName) => (
                <IconTile
                  key={iconName}
                  iconName={iconName}
                  selected={iconName === value}
                  onSelect={(nextIcon) => {
                    onChange(nextIcon)
                    setOpen(false)
                  }}
                />
              ))}
              
              {filteredIcons.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-card/30 border border-border/30">
                    <Search className="size-8 text-muted-foreground/40" />
                  </div>
                  <p className="text-lg font-light text-muted-foreground tracking-wide">
                    No icons found matching "<span className="text-foreground font-medium">{searchTerm}</span>"
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}