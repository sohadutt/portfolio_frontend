import { useState, useEffect, useMemo } from "react"
import lucideData from "@/helper/tags.json"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Loader2, Plus, MoreHorizontal, Eye, Pencil } from "lucide-react"
import { toast } from "sonner"

// Shadcn UI Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Pagination Components
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Helpers
import { fetchDashboardPortfolios, togglePortfolioVisibility, THEME_MAP } from "@/helper/functions"

export default function ManagerPortfolio() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Table State
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})

  const iconNames = Object.keys(lucideData)

  // Fetch Portfolios on mount
  useEffect(() => {
    loadPortfolios()
  }, [])

  const loadPortfolios = async () => {
    setLoading(true)
    try {
      const res = await fetchDashboardPortfolios()
      setData(res || []) 
    } catch (error) {
      toast.error(error.message || "Failed to load portfolios")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleVisibility = async (index, currentStatus) => {
    try {
      setData(prevData => prevData.map(item => 
        item.index === index ? { ...item, is_visible: !currentStatus } : item
      ))
      await togglePortfolioVisibility(index)
      toast.success("Visibility updated")
    } catch (error) {
      setData(prevData => prevData.map(item => 
        item.index === index ? { ...item, is_visible: currentStatus } : item
      ))
      toast.error(error.message || "Failed to update visibility")
    }
  }

  const columns = useMemo(() => [
    {
      accessorKey: "hero_title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("hero_title") || `Portfolio #${row.original.index}`}
        </div>
      ),
    },
    {
      accessorKey: "theme_mode",
      header: "Theme",
      cell: ({ row }) => {
        const themeValue = row.getValue("theme_mode")
        const themeName = THEME_MAP[themeValue] || "Ocean"
        return (
          <Badge variant="secondary" className="capitalize">
            {themeName.replace("theme-", "")}
          </Badge>
        )
      },
    },
    {
      accessorKey: "is_visible",
      header: "Visibility",
      cell: ({ row }) => {
        const isVisible = row.getValue("is_visible")
        const index = row.original.index
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isVisible}
              onCheckedChange={() => handleToggleVisibility(index, isVisible)}
            />
            <span className="text-xs text-muted-foreground w-12">
              {isVisible ? "Public" : "Hidden"}
            </span>
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const portfolio = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => window.open(`/portfolio/${portfolio.token || portfolio.index}`, '_blank')}>
                <Eye className="mr-2 h-4 w-4" /> View Live
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Edit", portfolio.index)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Content
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [data])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    // Optional: Define how many rows you want per page (default is usually 10)
    initialState: {
      pagination: {
        pageSize: 5, 
      },
    },
  })

  if (loading) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center space-y-4 rounded-xl border border-dashed">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading portfolios...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("hero_title")?.getFilterValue()) ?? ""}
          onChange={(event) => table.getColumn("hero_title")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id.replace("_", " ")}
                  </DropdownMenuCheckboxItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => console.log("Create new")}>
            <Plus className="mr-2 h-4 w-4" /> New Portfolio
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No portfolios found. Create your first one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
           Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
           {Math.min(
             (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
             table.getFilteredRowModel().rows.length
           )}{" "}
           of {table.getFilteredRowModel().rows.length} entries
        </div>
        
        <Pagination className="justify-end w-auto mx-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  table.previousPage()
                }}
                className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {/* Generate numbered page links */}
            {Array.from({ length: table.getPageCount() }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  href="#"
                  isActive={table.getState().pagination.pageIndex === i}
                  onClick={(e) => {
                    e.preventDefault()
                    table.setPageIndex(i)
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  table.nextPage()
                }}
                className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}