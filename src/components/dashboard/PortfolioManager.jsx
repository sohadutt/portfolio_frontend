import { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Eye, Loader2, MoreHorizontal, Pencil, Plus } from "lucide-react"
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

import {
  loadDashboardPortfolios,
  selectDashboardPortfolios,
  updatePortfolioVisibility,
} from "@/store/portfolioSlice"

const ACTION_MENU_WIDTH = 192
const ACTION_MENU_HEIGHT = 112
const ACTION_MENU_MARGIN = 8

function getMenuPosition(event) {
  const maxX = window.innerWidth - ACTION_MENU_WIDTH - ACTION_MENU_MARGIN
  const maxY = window.innerHeight - ACTION_MENU_HEIGHT - ACTION_MENU_MARGIN

  return {
    x: Math.max(ACTION_MENU_MARGIN, Math.min(event.clientX, maxX)),
    y: Math.max(ACTION_MENU_MARGIN, Math.min(event.clientY, maxY)),
  }
}

function PortfolioActionMenu({ onPreview, onEdit }) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event) {
      if (!event.target.closest("[data-portfolio-action-menu]")) {
        setOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false)
    }

    function handleResize() {
      setOpen(false)
    }

    window.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("resize", handleResize)
    }
  }, [open])

  const openAtPointer = (event) => {
    setPosition(getMenuPosition(event))
    setOpen((current) => !current)
  }

  const runAction = (action) => {
    setOpen(false)
    action()
  }

  return (
    <div className="flex justify-end sm:justify-start" data-portfolio-action-menu>
      <Button
        variant="ghost"
        className="h-8 w-8 p-0"
        aria-haspopup="menu"
        aria-expanded={open}
        onPointerDown={(event) => {
          event.preventDefault()
          openAtPointer(event)
        }}
      >
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {open ? (
        <div
          role="menu"
          className="fixed z-50 w-48 rounded-md bg-popover/95 p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 backdrop-blur-xl"
          style={{ left: position.x, top: position.y }}
        >
          <div className="px-2 py-1.5 text-sm font-semibold">Actions</div>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-hidden hover:bg-foreground/10 focus:bg-foreground/10"
            onClick={() => runAction(onPreview)}
          >
            <Eye className="h-4 w-4" /> View Live
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-hidden hover:bg-foreground/10 focus:bg-foreground/10"
            onClick={() => runAction(onEdit)}
          >
            <Pencil className="h-4 w-4" /> Edit Content
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default function PortfolioManager() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: data, loading } = useSelector(selectDashboardPortfolios)
  
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})

  useEffect(() => {
    async function loadPortfolios() {
      try {
        await dispatch(loadDashboardPortfolios()).unwrap()
      } catch (error) {
        toast.error(error.message || "Failed to load portfolios")
      }
    }

    loadPortfolios()
  }, [dispatch])

  const handleToggleVisibility = useCallback(async (orderIndex, currentStatus) => {
    try {
      await dispatch(updatePortfolioVisibility({ orderIndex, currentStatus })).unwrap()
      toast.success(`Portfolio ${orderIndex} status updated`)
    } catch (error) {
      toast.error(error.message || "Failed to update visibility")
    }
  }, [dispatch])

  const columns = useMemo(() => [
    {
      accessorKey: "title", 
      header: "Portfolio Title",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1.5 sm:gap-0 sm:flex-row sm:items-center">
          <div className="font-medium truncate max-w-[160px] sm:max-w-[300px]">
            {row.getValue("title") || row.original.name || `Portfolio #${row.original.order_index}`}
          </div>
          <Badge variant="secondary" className="w-fit text-[10px] uppercase tracking-wider sm:hidden">
            #{row.original.order_index}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "order_index",
      header: "Index",
      cell: ({ row }) => {
        return (
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
            #{row.getValue("order_index")}
          </Badge>
        )
      },
    },
    {
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
            <span className="hidden sm:inline-block text-xs text-muted-foreground w-12">
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
          <PortfolioActionMenu
            onPreview={() => window.open(`/preview/${portfolio.order_index}`, "_blank")}
            onEdit={() => navigate(`/dashboard/portfolios/${portfolio.order_index}/edit`)}
          />
        )
      },
    },
  ], [handleToggleVisibility, navigate])

  // eslint-disable-next-line react-hooks/incompatible-library
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
      <div className="flex h-[400px] w-full flex-col items-center justify-center space-y-4 rounded-2xl border border-border/60 bg-background shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading workspace...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Action Buttons: Stacked on mobile, row on md+ */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue()) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="w-full md:max-w-sm rounded-full bg-background"
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full">Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="!transition-none">
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
          
          <Button 
            className="flex-1 md:flex-none rounded-full shadow-none" 
            onClick={() => navigate(`/dashboard/portfolios/${Math.max(...data.map((item) => Number(item.order_index) || 0), 0) + 1}/edit`)}
          >
            <Plus className="mr-2 h-4 w-4" /> New Portfolio
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm">
        {/* Removed min-w-[760px] to allow native mobile squishing */}
        <Table>
          <TableHeader className="bg-muted/25">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // Hide the Index column completely on small screens
                  const isHiddenMobile = header.column.id === "order_index";
                  return (
                    <TableHead 
                      key={header.id} 
                      className={isHiddenMobile ? "hidden sm:table-cell" : ""}
                    >
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
                <TableRow key={row.id} className="hover:bg-muted/30" data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => {
                    // Hide the Index column completely on small screens
                    const isHiddenMobile = cell.column.id === "order_index";
                    return (
                      <TableCell 
                        key={cell.id} 
                        className={isHiddenMobile ? "hidden sm:table-cell py-3 sm:py-4" : "py-3 sm:py-4"}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
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
      
      {/* Pagination Footer: Center aligned on mobile, spaced out on lg */}
      <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
        <div className="text-sm text-muted-foreground">
           Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
           {Math.min(
             (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
             table.getFilteredRowModel().rows.length
           )}{" "}
           of {table.getFilteredRowModel().rows.length} entries
        </div>
        
        <Pagination className="mx-auto sm:mx-0 w-auto justify-center sm:justify-end">
          <PaginationContent className="flex-wrap justify-center gap-1">
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
              <PaginationItem key={i} className="hidden sm:inline-block">
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
