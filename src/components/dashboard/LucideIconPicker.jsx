import { createElement, useMemo, useState } from "react"
import * as LucideIcons from "lucide-react"
import { Check, ChevronsUpDown, Search } from "lucide-react"

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
import { resolveIcon } from "@/helper/portfolio-data"

function IconTile({ iconName, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(iconName)}
      className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
        selected
          ? "border-primary bg-primary/8 text-foreground"
          : "border-border bg-background hover:border-primary/30 hover:bg-accent/40"
      }`}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {createElement(resolveIcon(iconName, LucideIcons.Component), { className: "size-4" })}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{iconName}</p>
      </div>
      {selected ? (
        <Check className="size-4 text-primary" />
      ) : null}
    </button>
  )
}

export function LucideIconPicker({
  value,
  onChange,
  title = "Choose an icon",
  description = "Search and select a Lucide icon.",
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
        <Button type="button" variant="outline" className="w-full justify-between">
          <span className="flex items-center gap-2 truncate">
            {createElement(resolveIcon(value, LucideIcons.Component), { className: "size-4 text-primary" })}
            <span className="truncate">{value || "Select icon"}</span>
          </span>
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by icon name or tag..."
              className="pl-9"
            />
          </div>
        </DialogHeader>

        <ScrollArea className="h-[420px] px-6 py-5">
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
