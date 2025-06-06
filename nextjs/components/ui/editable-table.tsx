"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {useState} from "react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {ArrowDown, ArrowUp, ChevronsUpDown} from "lucide-react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Input} from "@/components/ui/input";

type DataTableProps<T extends object> = {
    columns: ColumnDef<T, any>[]
    data: T[]
    onSaveAction: (data: T[]) => void
}

export function DataTable<T extends object>({columns, data, onSaveAction}: DataTableProps<T>) {
    const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null)
    const [editedRow, setEditedRow] = useState<Partial<T> | null>(null)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
            columnVisibility: columns.reduce((acc, column) => {
                acc[column.id!] = true // Maak elke kolom standaard zichtbaar
                return acc
            }, {} as Record<string, boolean>), // Initialiseer met zichtbare kolommen
        },
    })

    const startEdit = (rowIndex: number) => {
        setEditingRowIndex(rowIndex)
        setEditedRow({...data[rowIndex]})
    }

    const saveEdit = () => {
        if (editedRow != null) {
            const updated = [...data];
            if (editingRowIndex === data.length) {
                // Toevoegen
                updated.push(editedRow as T);
            } else {
                // Bewerken
                updated[editingRowIndex!] = {...updated[editingRowIndex!], ...editedRow};
            }
            onSaveAction(updated);
            setEditingRowIndex(null);
            setEditedRow(null);
        }
    };

    const handleSort = (columnId: string) => {
        const column = table.getColumn(columnId)
        if (column) {
            column.toggleSorting()
        }
    }

    const handleColumnVisibility = (columnId: string, value: boolean) => {
        const column = table.getColumn(columnId)
        if (column) {
            column.toggleVisibility(value)
        }
    }

    function getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    }

    function setNestedValue(obj: any, path: string, value: any) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    }

    const handleAddRow = () => {
        const newRow = {} as T; // lege rij van type T
        setEditedRow(newRow);
        data.unshift(newRow);
        setEditingRowIndex(0); // nieuwe index
        console.log(data);
    };

    const cancelEdit = () => {
        setEditedRow(null);
        setEditingRowIndex(null);
    };

    const renderEditField = (column: ColumnDef<T>, value: any, onChange: (val: any) => void) => {
        const meta = column.meta as any;

        switch (meta?.type) {
            case 'select':
                return (
                    <Select value={value ?? 'none'} onValueChange={onChange}>
                        <SelectTrigger className="bg-cyan-800 text-white text-xs p-1">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            {meta.options.map((opt: any) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'textarea':
                return (
                    <textarea
                        className="bg-cyan-800 text-white border border-gray-500 rounded-sm py-1 px-2 w-full"
                        value={(value || []).join('\n')}
                        onChange={(e) => onChange(e.target.value.split('\n'))}
                    />
                );

            case 'number':
                return (
                    <Input
                        type="number"
                        className="bg-cyan-800 text-white"
                        value={value ?? ''}
                        onChange={(e) => onChange(parseFloat(e.target.value))}
                    />
                );

            case 'checkbox':
                return (
                    <input
                        type="checkbox"
                        checked={value ?? false}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                );

            case 'date':
                return (
                    <Input
                        type="date"
                        className="bg-cyan-800 text-white"
                        value={value ?? ''}
                        onChange={(e) => onChange(e.target.value)}
                    />
                );

            default:
                return (
                    <Input
                        className="bg-cyan-800 text-white"
                        value={value ?? ''}
                        onChange={(e) => onChange(e.target.value)}
                    />
                );
        }
    };


    return (
        <div className="space-y-4">
            <div className="justify-end flex">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="hidden lg:flex">
                            <ChevronsUpDown className="h-4 w-4"/>
                            Kolommen
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuLabel>Kolom Zichtbaarheid</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        {table
                            .getAllColumns()
                            .filter(column => typeof column.accessorFn !== "undefined" && column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(checked) => handleColumnVisibility(column.id, checked)}
                                >
                                    {String(column.columnDef.header)}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" onClick={handleAddRow}>
                    + Rij toevoegen
                </Button>
            </div>

            <Table className={'overflow-x-auto'}>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id}>
                                    <div className="flex items-center space-x-2">
                                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                                        {/* Sorteren knop naast de kolom */}
                                        <Button variant={'link'} onClick={() => handleSort(header.id)}>
                                            {header.column.getIsSorted() === "desc" ? (
                                                <ArrowDown className="h-3.5 w-3.5"/>
                                            ) : header.column.getIsSorted() === "asc" ? (
                                                <ArrowUp className="h-3.5 w-3.5"/>
                                            ) : (
                                                <ChevronsUpDown className="h-3.5 w-3.5"/>
                                            )}
                                        </Button>
                                    </div>
                                </TableHead>
                            ))}
                            <TableHead>Acties</TableHead>
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row, rowIndex) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <TableCell key={cell.id}>
                                        {editingRowIndex === rowIndex ? (
                                            <>
                                                {renderEditField(cell.column.columnDef, getNestedValue(editedRow, cell.column.id), newValue => {
                                                    setEditedRow(prev => {
                                                        const updated = {...(prev ?? {})};
                                                        setNestedValue(updated, cell.column.id, newValue);
                                                        return updated;
                                                    });
                                                })}
                                            </>
                                        ) : (
                                            flexRender(cell.column.columnDef.cell, cell.getContext())
                                        )}
                                    </TableCell>
                                );
                            })}
                            <TableCell>
                                {editingRowIndex === rowIndex ? (
                                    <>
                                        <Button onClick={saveEdit} variant="outline" size="sm">
                                            Opslaan
                                        </Button>
                                        <Button onClick={cancelEdit} variant="ghost" size="sm"
                                                className="ml-2 text-red-500">
                                            Annuleer
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={() => startEdit(rowIndex)} variant="outline" size="sm">
                                        Bewerken
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between px-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} van{" "}
                    {table.getFilteredRowModel().rows.length} rij(en) geselecteerd.
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rijen per pagina</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value: any) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize}/>
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[5, 10, 20, 50, 100, 200, 500].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Vorige
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Volgende
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
