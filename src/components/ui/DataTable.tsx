
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Search, RefreshCw } from 'lucide-react';

interface Column {
  header: string;
  accessorKey: string | number | symbol;
  cell?: (item: any) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  searchable?: boolean;
  searchKeys?: string[];
  pageSize?: number;
  onRefresh?: () => void;
  title?: string;
}

export function DataTable({ 
  data = [], 
  columns, 
  searchable = false, 
  searchKeys = [], 
  pageSize = 10,
  onRefresh,
  title
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm.trim()) {
      return data;
    }

    const searchLower = searchTerm.toLowerCase();
    return data.filter(item => {
      if (searchKeys.length > 0) {
        return searchKeys.some(key => {
          const value = item[key];
          return value && value.toString().toLowerCase().includes(searchLower);
        });
      }
      
      // Search all string values if no specific keys provided
      return Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchTerm, searchable, searchKeys]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
    // Reset search and pagination
    setSearchTerm('');
    setCurrentPage(1);
    setSortConfig(null);
  };

  return (
    <div className="space-y-4">
      {(searchable || onRefresh || title) && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {searchable && (
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
          </div>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className={column.sortable ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => column.sortable && handleSort(column.accessorKey.toString())}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && sortConfig?.key === column.accessorKey.toString() && (
                      <span className="text-xs">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <TableRow key={item.id || rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.cell 
                        ? column.cell({ getValue: () => item[column.accessorKey], row: { original: item } })
                        : item[column.accessorKey] || '-'
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No results found for your search.' : 'No data available.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {paginatedData.length} of {sortedData.length} items
            {searchTerm && ` (filtered from ${data.length} total)`}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
