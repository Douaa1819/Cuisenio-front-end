"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { motion, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"

interface DataTableProps<T> {
  data: T[]
  columns: {
    header: string
    accessor: keyof T | ((item: T) => ReactNode)
    className?: string
  }[]
  onRowClick?: (item: T) => void
  isLoading?: boolean
  emptyMessage?: string
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  onRowClick,
  isLoading = false,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  return (
    <div className="relative overflow-hidden rounded-md border">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <span className="mt-2 text-sm text-muted-foreground">Loading...</span>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={cn("border-b last:border-0", onRowClick && "cursor-pointer hover:bg-muted/50")}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column, index) => (
                    <TableCell key={index} className={column.className}>
                      {typeof column.accessor === "function"
                        ? column.accessor(item)
                        : (item[column.accessor] as ReactNode)}
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

