
'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  ChevronsUpDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  Zap,
  ArrowUp,
  ArrowDown,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteNews } from '@/lib/data';
import type { Article } from '@/lib/types';


interface NewsTableProps {
  data: Article[];
  onEdit: (article: Article) => void;
  onDeleteSuccess: () => void;
  isLoading: boolean;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewModeToggle: React.ReactNode;
}

export function NewsTable({ 
  data, 
  onEdit, 
  onDeleteSuccess, 
  isLoading,
  sorting,
  setSorting,
  searchQuery,
  setSearchQuery,
  viewModeToggle
}: NewsTableProps) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [idsToDelete, setIdsToDelete] = React.useState<number[]>([]);
  const { toast } = useToast();

  const openDeleteDialog = (ids: number[]) => {
    if (ids.length > 0) {
      setIdsToDelete(ids);
      setIsDeleteDialogOpen(true);
    }
  };

  const columns: ColumnDef<Article>[] = React.useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="تحديد الكل"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="تحديد الصف"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'title',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              العنوان
              {column.getIsSorted() === 'asc' ? <ArrowUp className="mr-2 h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="mr-2 h-4 w-4" /> : <ChevronsUpDown className="mr-2 h-4 w-4" />}
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="font-medium flex items-center gap-2">
            {row.original.isUrgent && <Zap className="h-4 w-4 text-destructive shrink-0" />}
            <span className="truncate">{row.getValue('title')}</span>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              الفئة
              {column.getIsSorted() === 'asc' ? <ArrowUp className="mr-2 h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="mr-2 h-4 w-4" /> : <ChevronsUpDown className="mr-2 h-4 w-4" />}
            </Button>
          );
        },
        cell: ({ row }) => <Badge variant="outline">{row.getValue('category')}</Badge>,
      },
      {
        accessorKey: 'views',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              المشاهدات
             {column.getIsSorted() === 'asc' ? <ArrowUp className="mr-2 h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="mr-2 h-4 w-4" /> : <ChevronsUpDown className="mr-2 h-4 w-4" />}
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="text-center">{row.original.views.toLocaleString('ar-EG')}</div>
        ),
      },
      {
        accessorKey: 'publishedAt',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              تاريخ النشر
              {column.getIsSorted() === 'asc' ? <ArrowUp className="mr-2 h-4 w-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="mr-2 h-4 w-4" /> : <ChevronsUpDown className="mr-2 h-4 w-4" />}
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="whitespace-nowrap text-muted-foreground">
            {format(new Date(row.getValue('publishedAt')), 'd MMM yyyy, h:mm a', { locale: ar })}
          </div>
        ),
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const article = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">فتح القائمة</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(article)}>
                  <Pencil className="ml-2 h-4 w-4" />
                  <span>تعديل</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  onClick={() => openDeleteDialog([article.id])}
                >
                  <Trash2 className="ml-2 h-4 w-4" />
                  <span>حذف</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [onEdit]
  );
  
  const table = useReactTable({
    data: isLoading ? Array(10).fill({}) : data,
    columns: columns.map(col => ({
        ...col,
        cell: isLoading ? () => <Skeleton className="h-6 w-full" /> : col.cell,
    })),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
  });

  const handleDeleteSelected = async () => {
    const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);
    openDeleteDialog(selectedIds);
  };
  
   const handleDelete = async () => {
    try {
      await Promise.all(idsToDelete.map(id => deleteNews(id)));
      toast({
        title: "نجاح",
        description: `تم حذف ${idsToDelete.length} خبر بنجاح.`,
        className: "bg-green-100 border-green-300 text-green-800",
      });
      table.resetRowSelection();
      onDeleteSuccess();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل حذف الأخبار. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
        setIsDeleteDialogOpen(false);
        setIdsToDelete([]);
    }
  };


  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between gap-4">
            <div className="relative flex-grow">
               <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input 
                  placeholder="ابحث في الأخبار..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 w-full md:w-80"
                />
            </div>
            <div className='flex items-center gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <SlidersHorizontal className="ml-2 h-4 w-4" />
                    الأعمدة
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>إظهار/إخفاء الأعمدة</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id === 'title' ? 'العنوان' : 
                           column.id === 'category' ? 'الفئة' :
                           column.id === 'views' ? 'المشاهدات' :
                           column.id === 'publishedAt' ? 'تاريخ النشر' :
                           column.id
                          }
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
              {viewModeToggle}
            </div>
        </div>
        <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
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
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {isLoading ? "جاري التحميل..." : "لم يتم العثور على نتائج."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} من{' '}
            {table.getFilteredRowModel().rows.length} صف/صفوف محددة.
          </div>
           {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                    <Trash2 className="ml-2 h-4 w-4" />
                    حذف المحدد ({table.getFilteredSelectedRowModel().rows.length})
                </Button>
            )}
        </div>
      </div>
       <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                <AlertDialogDescription>
                    هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف {idsToDelete.length > 1 ? `${idsToDelete.length} أخبار` : 'الخبر المحدد'} بشكل دائم.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIdsToDelete([])}>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                    نعم، قم بالحذف
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
}
