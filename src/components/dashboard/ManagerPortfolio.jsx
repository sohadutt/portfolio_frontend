import { useState, useEffect, useMemo } from "react"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Helpers (Ensure these are exported correctly from your functions.js)
import { fetchDashboardPortfolios, togglePortfolioVisibility } from "@/helper/functions"

export default function ManagerPortfolio() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Table State
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})

  // Fetch Portfolios on mount
  useEffect(() => {
    loadPortfolios()
  }, [])

  const loadPortfolios = async () => {
    setLoading(true)
    try {
      const res = await fetchDashboardPortfolios()
      // Your backend returns { owner: "...", portfolios: [...] }
      setData(res?.portfolios || []) 
    } catch (error) {
      toast.error(error.message || "Failed to load portfolios")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleVisibility = async (orderIndex, currentStatus) => {
    // 1. Optimistic UI Update: Flip the switch immediately for a snappy feel
    setData(prevData => prevData.map(item => 
      item.order_index === orderIndex ? { ...item, is_enabled: !currentStatus } : item
    ))
    
    try {
      // 2. Send the PATCH request to the backend
      await togglePortfolioVisibility(orderIndex)
      toast.success(`Portfolio ${orderIndex} status updated`)
    } catch (error) {
      // 3. Revert the switch if the backend rejects it (e.g., Free Tier limits)
      setData(prevData => prevData.map(item => 
        item.order_index === orderIndex ? { ...item, is_enabled: currentStatus } : item
      ))
      toast.error(error.message || "Failed to update visibility")
    }
  }

  const columns = useMemo(() => [
    {
      // Changed from hero_title to title to match Django payload
      accessorKey: "title", 
      header: "Portfolio Title",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("title") || row.original.name || `Portfolio #${row.original.order_index}`}
        </div>
      ),
    },
    {
      // Replaced theme with tier since that's what the list view returns
      accessorKey: "tier",
      header: "Tier",
      cell: ({ row }) => {
        const tierValue = row.getValue("tier") || "FREE"
        return (
          <Badge variant={tierValue === "PREMIUM" ? "default" : "secondary"} className="text-[10px] uppercase tracking-wider">
            {tierValue}
          </Badge>
        )
      },
    },
    {
      // Match the backend property 'is_enabled'
      accessorKey: "is_enabled",
      header: "Public Status",
      cell: ({ row }) => {
        const isEnabled = row.getValue("is_enabled")
        const orderIndex = row.original.order_index
        return (
          <div className="flex items-center gap-3">
            <Switch
              checked={isEnabled}
              onCheckedChange={() => handleToggleVisibility(orderIndex, isEnabled)}
            />
            <span className="text-xs text-muted-foreground w-12">
              {isEnabled ? "Visible" : "Hidden"}
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
              <DropdownMenuItem onClick={() => window.open(`/preview/${portfolio.order_index}`, '_blank')}>
                <Eye className="mr-2 h-4 w-4" /> View Live
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Navigate to editor for index:", portfolio.order_index)}>
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
    initialState: {
      pagination: {
        pageSize: 5, 
      },
    },
  })

  if (loading) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center space-y-4 rounded-xl border border-dashed bg-card/50">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading workspace...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue()) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="max-w-sm bg-background"
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
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
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
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  No portfolios found. Create your first one to get started!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
           Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
           {Math.min(
             (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
             table.getFilteredRowModel().rows.length
           )}{" "}
           of {table.getFilteredRowModel().rows.length} entries
        </div>
        
        <Pagination className="w-auto mx-0">
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