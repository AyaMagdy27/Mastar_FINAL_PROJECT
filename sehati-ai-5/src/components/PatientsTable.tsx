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
import { ArrowUpDown, ChevronDown, Check, MoreHorizontal, Download } from 'lucide-react';

export function PatientsTable({ data, onRowClick, onDeletePatient, onEditPatient }: { data: any[], onRowClick: (p: any) => void, onDeletePatient: (id: string) => void, onEditPatient: (p: any) => void }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <button
          className="flex items-center font-bold tracking-widest text-[10px] uppercase cursor-pointer hover:text-indigo-600 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-bold text-slate-800">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'nationalId',
      header: () => <div className="font-bold tracking-widest text-[10px] uppercase">National ID</div>,
      cell: ({ row }) => <div className="text-slate-500 font-mono text-xs">{row.getValue('nationalId') || 'N/A'}</div>,
    },
    {
      accessorKey: 'gender',
      header: () => <div className="font-bold tracking-widest text-[10px] uppercase">Gender</div>,
      cell: ({ row }) => <div className="capitalize">{row.getValue('gender')}</div>,
    },
    {
      accessorKey: 'dob',
      header: () => <div className="font-bold tracking-widest text-[10px] uppercase">DOB</div>,
      cell: ({ row }) => <div>{row.getValue('dob')}</div>,
    },
    {
      accessorKey: 'phone',
      header: () => <div className="font-bold tracking-widest text-[10px] uppercase">Phone</div>,
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'status',
      header: () => <div className="font-bold tracking-widest text-[10px] uppercase">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex ${
            status === 'Recovered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
            status === 'New Patient' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
            'bg-amber-50 text-amber-700 border border-amber-100'
          }`}>
            {status}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="text-right">
             <button onClick={(e) => { e.stopPropagation(); onEditPatient(row.original); }} className="text-xs font-bold text-blue-600 uppercase mr-3">Edit</button>
             <button onClick={(e) => { e.stopPropagation(); onDeletePatient(row.original.id); }} className="text-xs font-bold text-red-600 uppercase">Delete</button>
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
    link.setAttribute('download', 'patients.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    // Standard basic implementation - open in new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Patients List</title>');
      printWindow.document.write('<style>table { width:100%; border-collapse: collapse; } th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }</style>');
      printWindow.document.write('</head><body><h2>Patients List</h2><table><thead><tr>');
      
      const headers = columns.filter(c => (c as any).accessorKey).map(c => (c as any).accessorKey as string);
      headers.forEach(h => printWindow.document.write(`<th>${h.toUpperCase()}</th>`));
      printWindow.document.write('</tr></thead><tbody>');
      
      data.forEach(row => {
        printWindow.document.write('<tr>');
        headers.forEach(h => printWindow.document.write(`<td>${row[h] || ''}</td>`));
        printWindow.document.write('</tr>');
      });
      
      printWindow.document.write('</tbody></table></body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      // printWindow.close();
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm flex flex-col w-full">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
        <input
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
          className="w-full sm:max-w-sm px-4 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-2">
            <button onClick={exportCSV} className="flex items-center text-xs font-bold uppercase tracking-wider bg-background border border-border px-4 py-2 rounded-lg hover:bg-accent transition-all active:scale-95">
               <Download className="w-4 h-4 mr-2" /> CSV
            </button>
            <button onClick={exportPDF} className="flex items-center text-xs font-bold uppercase tracking-wider bg-background border border-border px-4 py-2 rounded-lg hover:bg-accent transition-all active:scale-95">
               <Download className="w-4 h-4 mr-2" /> PDF
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
                  className="cursor-pointer hover:bg-muted/50"
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
                  No patients found.
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
