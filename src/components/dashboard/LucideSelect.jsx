import { useState, useMemo, useRef, useCallback, lazy, Suspense, useEffect } from "react"
import dynamicIconImports from "lucide-react/dynamicIconImports"
import lucideData from "@/helper/tags.json"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

// Dynamically load the icon only when it is rendered
const DynamicIcon = ({ name, ...props }) => {
  const LucideIcon = useMemo(() => {
    // Check if the icon exists in the current version of lucide-react
    if (!dynamicIconImports[name]) return null
    return lazy(dynamicIconImports[name])
  }, [name])

  if (!LucideIcon) return null

  return (
    // Show a skeleton square while the SVG is fetching
    <Suspense fallback={<div className="h-5 w-5 bg-muted animate-pulse rounded" />}>
      <LucideIcon {...props} />
    </Suspense>
  )
}

export default function LucideSelect() {
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleCount, setVisibleCount] = useState(20)

  // Reset the visible count back to 20 whenever the user types a new search
  useEffect(() => {
    setVisibleCount(20)
  }, [searchTerm])

  // Filter icons based on search term
  const filteredIcons = useMemo(() => {
    const query = searchTerm.toLowerCase()

    return Object.entries(lucideData).filter(([key, tags]) => {
      if (key.toLowerCase().includes(query)) return true
      if (Array.isArray(tags) && tags.some((tag) => tag.toLowerCase().includes(query))) {
        return true
      }
      return false
    })
  }, [searchTerm])

  // Only slice the first N icons to render
  const visibleIcons = filteredIcons.slice(0, visibleCount)

  // Infinite scroll logic using Intersection Observer
  const observer = useRef()
  const lastIconElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect()
      
      observer.current = new IntersectionObserver((entries) => {
        // If the last element comes into view, load 20 more icons
        if (entries[0].isIntersecting && visibleCount < filteredIcons.length) {
          setVisibleCount((prev) => prev + 20)
        }
      })
      
      if (node) observer.current.observe(node)
    },
    [visibleCount, filteredIcons.length]
  )

  return (
    <Card className="w-full max-w-3xl flex flex-col h-[600px]">
      <CardHeader className="space-y-4 pb-4">
        <div>
          <CardTitle>Icon Library</CardTitle>
          <CardDescription>Hover over an icon to see its name.</CardDescription>
        </div>
        <Input
          placeholder="Search icons by name or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        {/* We use Shadcn's ScrollArea here */}
        <ScrollArea className="h-full w-full px-6 pb-6">
          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-11 gap-3 p-1">
            {visibleIcons.map(([key], index) => {
              // Attach the observer ref to the very last icon in the current visible list
              const isLastElement = visibleIcons.length === index + 1

              return (
                <HoverCard key={key} openDelay={100} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10 shrink-0"
                      ref={isLastElement ? lastIconElementRef : null}
                    >
                      <DynamicIcon name={key} className="h-5 w-5" />
                      <span className="sr-only">{key}</span>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent 
                    className="w-auto px-3 py-1.5 text-sm font-semibold capitalize"
                    side="top"
                  >
                    {key.replace(/-/g, " ")}
                  </HoverCardContent>
                </HoverCard>
              )
            })}
            
            {/* Empty State */}
            {filteredIcons.length === 0 && (
              <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
                No icons found matching "{searchTerm}"
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}