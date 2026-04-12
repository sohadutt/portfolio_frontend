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
      className={`group flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
        selected
          ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/20"
          : "border-border/60 bg-background hover:border-primary/30 hover:bg-muted/30"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
            selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary group-hover:bg-primary/20"
        }`}>
          {createElement(resolveIcon(iconName, Component), { className: "size-5" })}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold capitalize text-foreground">
            {iconName.replace(/-/g, ' ')}
          </p>
          <p className="truncate text-xs text-muted-foreground font-mono">
            {iconName}
          </p>
        </div>
      </div>
      
      {selected ? (
        <Check className="size-5 text-primary shrink-0" />
      ) : null}
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
          className="w-full justify-between rounded-xl border-border/60 bg-background hover:bg-muted/50 h-12 px-4 shadow-sm"
        >
          <span className="flex items-center gap-3 truncate">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {createElement(resolveIcon(value, Component), { className: "size-4" })}
            </div>
            <span className="truncate font-medium capitalize">
              {value ? value.replace(/-/g, ' ') : "Select an icon"}
            </span>
          </span>
          <ChevronsUpDown className="size-4 text-muted-foreground shrink-0" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden rounded-[2rem] border-border/70">
        <DialogHeader className="border-b border-border/60 px-7 py-6 bg-muted/10">
          <DialogTitle className="text-2xl tracking-tight">{title}</DialogTitle>
          <DialogDescription className="text-base">{description}</DialogDescription>
          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by icon name or tag..."
              className="w-full rounded-full pl-10 bg-background/80 h-11"
            />
          </div>
        </DialogHeader>

        <ScrollArea className="h-[480px] bg-background">
          <div className="px-7 py-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                <div className="col-span-full py-16 text-center">
                  <p className="text-muted-foreground">No icons found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}