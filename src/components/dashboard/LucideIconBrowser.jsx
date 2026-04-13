import { createElement, useMemo, useState } from "react"
import { Copy, Search } from "lucide-react"
import { toast } from "sonner"

import lucideData from "@/helper/tags.json"
import { resolveIcon } from "@/helper/functions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

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
    toast.success(`Copied "${iconName}" to clipboard`)
  }

  return (
    <Card className="overflow-hidden rounded-[1.5rem] sm:rounded-3xl border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="border-b border-border/60 p-5 sm:p-7 pb-5">
        <CardTitle className="text-xl sm:text-2xl tracking-tight">Lucide Icon Browser</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Search your installed icon set and copy names for portfolio content.
        </CardDescription>
        <div className="relative mt-3 sm:mt-4">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search icons by name or tag..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-full pl-10 bg-background/50 h-11"
          />
        </div>
      </CardHeader>

      <CardContent className="min-h-0 p-0 bg-muted/10">
        <ScrollArea className="h-[calc(100dvh-16rem)] px-4 sm:px-7 py-4 sm:py-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 pb-6">
            {filteredIcons.map(([key]) => {
              const IconComponent = resolveIcon(key)
              
              return (
                <div 
                  key={key} 
                  onClick={() => handleCopy(key)}
                  className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl sm:rounded-2xl border border-border/60 bg-background p-3 transition-all hover:border-primary/30 hover:bg-muted/20 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110">
                      {createElement(IconComponent, { className: "size-4 sm:size-5" })}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold capitalize text-foreground">
                        {key.replace(/-/g, ' ')}
                      </p>
                      <p className="truncate text-[10px] sm:text-xs text-muted-foreground font-mono">
                        {key}
                      </p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="size-8 shrink-0 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100" 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopy(key)
                    }}
                    title="Copy icon name"
                  >
                    <Copy className="size-3.5 sm:size-4" />
                  </Button>
                </div>
              )
            })}

            {filteredIcons.length === 0 && (
              <div className="col-span-full py-16 text-center">
                <p className="text-muted-foreground">No icons found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
