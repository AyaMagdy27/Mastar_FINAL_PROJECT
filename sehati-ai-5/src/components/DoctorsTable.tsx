import React, { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowUpDown, Download } from 'lucide-react';

export function DoctorsTable({ data, onRowClick, onDeleteDoctor, onEditDoctor }: { data: any[], onRowClick: (d: any) => void, onDeleteDoctor: (id: string) => void, onEditDoctor: (d: any) => void }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <button
          className="flex items-center font-bold tracking-widest text-[10px] uppercase cursor-pointer hover:text-primary transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-bold text-foreground">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'specialization',
      header: () => <div className="font-bold tracking-widest text-[10px] uppercase">Specialization</div>,
      cell: ({ row }) => <div>{row.getValue('specialization')}</div>,
    },
    {
      accessorKey: 'status',
      header: () => <div className="font-bold tracking-widest text-[10px] uppercase">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue('status') as string || 'Offline';
        const config = {
          'Available': { color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-100' },
          'Busy': { color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-100' },
          'Offline': { color: 'bg-slate-500', text: 'text-slate-700', bg: 'bg-slate-100' }
        }[status] || { color: 'bg-slate-500', text: 'text-slate-700', bg: 'bg-slate-100' };

        return (
          <div className="flex items-center space-x-2">
            <span className={`relative flex h-2.5 w-2.5`}>
              {status === 'Available' && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.color}`}></span>}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.color}`}></span>
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${config.bg} ${config.text}`}>
              {status}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'department',
      header: () => <div className="font-bold tracking-widest text-[10px] uppercase">Department</div>,
      cell: ({ row }) => <div>{row.getValue('department')}</div>,
    },
    {
      accessorKey: 'experience',
      header: () => <div className="font-bold tracking-widest text-[10px] uppercase">Experience</div>,
      cell: ({ row }) => <div>{row.getValue('experience')} years</div>,
    },
    {
      accessorKey: 'consultationFee',
      header: () => <div className="font-bold tracking-widest text-[10px] uppercase">Fee</div>,
      cell: ({ row }) => <div>${row.getValue('consultationFee')}</div>,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="text-right">
             <button onClick={(e) => { e.stopPropagation(); onEditDoctor(row.original); }} className="text-xs font-bold text-blue-600 uppercase mr-3 hover:text-blue-800 transition-colors">Edit</button>
             <button onClick={(e) => { e.stopPropagation(); onDeleteDoctor(row.original.id); }} className="text-xs font-bold text-red-600 uppercase hover:text-red-800 transition-colors">Delete</button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const exportCSV = () => {
    const headers = columns.filter(c => (c as any).accessorKey).map(c => (c as any).accessorKey as string);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        let val = row[header];
        if (typeof val === 'string') {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return `"${val || ''}"`;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'doctors.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm flex flex-col w-full">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
        <input
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search doctors..."
          className="w-full sm:max-w-sm px-4 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-2">
            <button onClick={exportCSV} className="flex items-center text-xs font-bold uppercase tracking-wider bg-background border border-border px-4 py-2 rounded-lg hover:bg-accent transition-colors">
               <Download className="w-4 h-4 mr-2" /> CSV
            </button>
        </div>
      </div>
      <div className="rounded-md border-0">
        <Table>
          <TableHeader className="bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No doctors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data.length > 0 && (
         <div className="flex items-center justify-between px-4 py-4 border-t border-border bg-muted/10">
          <div className="text-sm text-muted-foreground font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border border-border rounded-md bg-background text-sm font-medium hover:bg-accent disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border border-border rounded-md bg-background text-sm font-medium hover:bg-accent disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
