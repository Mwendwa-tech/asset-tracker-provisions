
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown, 
  Filter, 
  MoreHorizontal,
  Search, 
  X
} from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey: keyof T;
    cell?: (item: T) => React.ReactNode;
    sortable?: boolean;
  }[];
  onRowClick?: (item: T) => void;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  rowActions?: {
    label: string;
    onClick: (item: T) => void;
    icon?: React.ReactNode;
  }[] | ((item: T) => {
    label: string;
    onClick: (item: T) => void;
    icon?: React.ReactNode;
  }[]);
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  searchable = true,
  searchKeys,
  rowActions,
}: DataTableProps<T>) {
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(data);

  const handleSort = (column: keyof T) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  useState(() => {
    if (!searchQuery) {
      setFilteredData(data);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const keys = searchKeys || Object.keys(data[0] || {}) as (keyof T)[];
    
    const filtered = data.filter(item => {
      return keys.some(key => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowercaseQuery);
      });
    });
    
    setFilteredData(filtered);
  });

  const getSortedData = () => {
    if (!sortBy) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue > bValue ? 1 : -1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query) {
      setFilteredData(data);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const keys = searchKeys || Object.keys(data[0] || {}) as (keyof T)[];
    
    const filtered = data.filter(item => {
      return keys.some(key => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowercaseQuery);
      });
    });
    
    setFilteredData(filtered);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredData(data);
  };

  const getSortIcon = (column: keyof T) => {
    if (sortBy !== column) return <ChevronsUpDown className="ml-1 h-4 w-4" />;
    return sortOrder === 'asc' ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  const getRowActions = (item: T) => {
    if (!rowActions) return [];
    
    if (typeof rowActions === 'function') {
      return rowActions(item);
    }
    
    return rowActions;
  };

  return (
    <div className="space-y-2">
      {searchable && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>
                  {column.sortable ? (
                    <button
                      className="flex items-center text-left"
                      onClick={() => handleSort(column.accessorKey)}
                    >
                      {column.header}
                      {getSortIcon(column.accessorKey)}
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
              {rowActions && <TableHead className="w-[80px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSortedData().map((item, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {column.cell ? column.cell(item) : String(item[column.accessorKey] || '')}
                  </TableCell>
                ))}
                {rowActions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {getRowActions(item).map((action, actionIndex) => (
                          <DropdownMenuItem
                            key={actionIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(item);
                            }}
                          >
                            {action.icon && (
                              <span className="mr-2">{action.icon}</span>
                            )}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {getSortedData().length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (rowActions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <div>
          Showing {getSortedData().length} of {data.length} items
        </div>
      </div>
    </div>
  );
}
