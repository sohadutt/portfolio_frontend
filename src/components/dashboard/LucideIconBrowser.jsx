import { createElement, useMemo, useState } from "react"
import * as LucideIcons from "lucide-react"
import { Copy, Search } from "lucide-react"
import { toast } from "sonner"

import lucideData from "@/helper/tags.json"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { resolveIcon } from "@/helper/portfolio-data"

export default function LucideIconBrowser() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredIcons = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return Object.entries(lucideData).filter(([key, tags]) => {
      if (!query) return true
      if (key.toLowerCase().includes(query)) return true
      return Array.isArray(tags) && tags.some((tag) => tag.toLowerCase().includes(query))
    })
  }, [searchTerm])

  const handleCopy = async (iconName) => {
    await navigator.clipboard.writeText(iconName)
    toast.success(`${iconName} copied`)
  }

  return (
    <Card className="overflow-hidden rounded-3xl border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="border-b border-border/60 p-7">
        <CardTitle>Lucide Icon Browser</CardTitle>
        <CardDescription>
          Search your installed icon set and copy names for portfolio content, or use the visual picker inside the editor.
        </CardDescription>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search icons by name or tag..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-full pl-9"
          />
        </div>
      </CardHeader>

      <CardContent className="min-h-0 p-0">
        <ScrollArea className="h-[calc(100vh-15rem)] px-7 py-7">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6">
            {filteredIcons.map(([key, tags]) => {
              return (
                <div key={key} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/70 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {createElement(resolveIcon(key, LucideIcons.Component), { className: "size-5" })}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{key}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {Array.isArray(tags) && tags.length ? tags.slice(0, 3).join(", ") : "No tags"}
                    </p>
                  </div>
                  <Button type="button" variant="ghost" size="icon-sm" className="rounded-full" onClick={() => handleCopy(key)}>
                    <Copy className="size-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
