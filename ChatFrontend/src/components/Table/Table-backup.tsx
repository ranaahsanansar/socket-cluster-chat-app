'use client';
import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button as NButton,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  SelectItem,
  Select,
} from '@nextui-org/react';
import { PlusIcon } from './PlusIcon';
import { VerticalDotsIcon } from './VerticalDotsIcon';
import { SearchIcon } from './SearchIcon';
import { ChevronDownIcon } from './ChevronDownIcon';
// import {columns, users, statusOptions} from "./data";
import { capitalize } from './utils';
import Search from '../Search/Search';
import Button from '@/components/Button';

const statusColorMap = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
};

const INITIAL_VISIBLE_COLUMNS = ['name', 'role', 'status', 'actions', 'email'];

export default function CTable({
  columns,
  users,
  statusOptions,
  showButton = true,
  buttonAction,
  buttonText = 'ADD TOKEN',
  tableHeading,
  showSearch = true,
}: {
  columns: any;
  users: any;
  statusOptions?: any;
  showButton?: boolean;
  showSearch?: boolean;
  buttonAction?: any;
  buttonText?: string;
  tableHeading?: string;
}) {
  const [filterValue, setFilterValue] = React.useState('');
  const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState<any>('all');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<any>({
    column: 'age',
    direction: 'ascending',
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) => user.name.toLowerCase().includes(filterValue?.toLowerCase()));
    }
    if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
      filteredUsers = filteredUsers.filter((user) => Array.from(statusFilter).includes(user.status));
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user: any, columnKey: any) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case 'name':
        return <div>{user?.email}</div>;
      case 'role':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-small capitalize'>{cellValue}</p>
            <p className='text-bold text-tiny capitalize text-default-400'>{user.team}</p>
          </div>
        );
      case 'status':
        return (
          <Chip className='capitalize' size='sm' variant='flat'>
            {cellValue}
          </Chip>
        );
      case 'actions':
        return (
          <div className='relative flex justify-between items-center gap-2'>
            <h3 className='text-primary-50'>{user?.action}</h3>
            <Dropdown placement='left-start' className='bg-primaryLight border-2 border-primaryLighter text-textColor'>
              <DropdownTrigger>
                <NButton isIconOnly size='sm' variant='light'>
                  <VerticalDotsIcon height={'auto'} width={'auto'} className='text-default-300' />
                </NButton>
              </DropdownTrigger>
              <DropdownMenu
                classNames={{
                  list: 'text-textColor',
                }}
              >
                <DropdownItem className='hover:!bg-primary hover:!text-textColor'>View</DropdownItem>
                <DropdownItem className='hover:!bg-primary hover:!text-textColor'>Edit</DropdownItem>
                <DropdownItem className='hover:!bg-primary hover:!text-textColor'>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value: any) => {
    if (value) {
      setFilterValue(value.target.value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className='flex flex-col gap-4 '>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
          <h2 className={`font-bold text-2xl mr-auto`}>{tableHeading}</h2>
          <Select
            onSelectionChange={setStatusFilter}
            label='Sort by'
            className='max-w-[140px]'
            classNames={{
              trigger:
                'bg-primary text-textColor data-[hover=true]:bg-primary hover:bg-primary border border-borderColor h-12 min-h-12',
              label: 'text-textColor',
              value: 'group-data-[has-value=true]:text-textColor',
            }}
          >
            <SelectItem key={'all'}>All</SelectItem>
            <SelectItem key={'option2'}>Option 2</SelectItem>
          </Select>
          {showSearch && (
            <div className={'w-[340px]'}>
              <Search onChange={onSearchChange} width={'100%'} onClear={() => onClear()} />
            </div>
          )}
          {/*{showButton && <Button onClick={buttonAction}>{buttonText}</Button>}*/}
        </div>
      </div>
    );
  }, [filterValue, statusFilter, visibleColumns, onRowsPerPageChange, users.length, onSearchChange, hasSearchFilter]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className='py-2 px-2 flex justify-end items-center'>
        {/*<span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${filteredItems.length} selected`}
             Total {users.length}
        </span>*/}
        {/* <Pagination
                    classNames={{
                        cursor: "bg-secondary border-1 w-7 min-w-7 h-7 md:h-[2.25rem] md:w-[2.25rem] md:min-w-[2.25rem] border-primaryLighter rounded-md",
                        item: "ml-1 md:ml-2 bg-primaryLight w-7 min-w-7 h-7 md:h-[2.25rem] md:w-[2.25rem] md:min-w-[2.25rem] !rounded-md text-gray-500 border-1 border-primaryLighter data-[hover=true]:!bg-primary",
                        prev: "bg-primaryLight w-7 min-w-7 h-7 md:h-[2.25rem] md:w-[2.25rem] md:min-w-[2.25rem] border-1 border-primaryLighter !rounded-md data-[slot]:text-white data-[disabled]:bg-textColor data-[disabled]:!rounded-md data-[disabled]:text-gray-500 text-xl data-[hover=true]:!bg-primary",
                        next: "bg-primaryLight w-7 min-w-7 h-7 md:h-[2.25rem] md:w-[2.25rem] md:min-w-[2.25rem] border-1 ml-1 md:ml-2 border-primaryLighter !rounded-md data-[slot]:text-white data-[disabled]:bg-textColor data-[disabled]:!rounded-md data-[disabled]:text-gray-500 text-xl data-[hover=true]:!bg-primary",
                    }}
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />*/}
        <div className='hidden sm:flex w-[30%] justify-end gap-x-4'>
          <Button isDisabled={pages === 1} variant='ghost' onClick={onPreviousPage}>
            <svg width='10' height='16' viewBox='0 0 10 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M8.63501 16.0005C8.52092 16.0004 8.40796 15.9773 8.30298 15.9326C8.198 15.8879 8.10308 15.8226 8.02393 15.7405L0.499023 8.00049L8.02393 0.260498C8.10297 0.178164 8.19798 0.112621 8.30298 0.0678711C8.40798 0.0231212 8.52087 0 8.63501 0C8.74914 0 8.86204 0.0231212 8.96704 0.0678711C9.07204 0.112621 9.16705 0.178164 9.24609 0.260498C9.4087 0.429324 9.49951 0.654518 9.49951 0.888916C9.49951 1.12331 9.4087 1.34851 9.24609 1.51733L2.94604 8.00049L9.24609 14.4834C9.40847 14.6523 9.49902 14.8775 9.49902 15.1118C9.49902 15.3461 9.40847 15.5715 9.24609 15.7405C9.16694 15.8226 9.07202 15.8879 8.96704 15.9326C8.86206 15.9773 8.7491 16.0004 8.63501 16.0005Z'
                fill='#848E9C'
              />
            </svg>
          </Button>
          <Button isDisabled={pages === 1} variant='ghost' onClick={onNextPage}>
            <svg width='10' height='16' viewBox='0 0 10 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M1.36401 0C1.4781 6.10352e-05 1.59107 0.0231991 1.69604 0.0678711C1.80102 0.112543 1.89595 0.177842 1.9751 0.26001L9.5 8L1.9751 15.74C1.89605 15.8223 1.80104 15.8879 1.69604 15.9326C1.59105 15.9774 1.47815 16.0005 1.36401 16.0005C1.24988 16.0005 1.13698 15.9774 1.03198 15.9326C0.926986 15.8879 0.831974 15.8223 0.75293 15.74C0.590326 15.5712 0.499512 15.346 0.499512 15.1116C0.499512 14.8772 0.590326 14.652 0.75293 14.4832L7.05298 8L0.75293 1.51709C0.590556 1.34814 0.5 1.123 0.5 0.888672C0.5 0.654348 0.590556 0.428955 0.75293 0.26001C0.832079 0.177842 0.927004 0.112543 1.03198 0.0678711C1.13696 0.0231991 1.24993 6.10352e-05 1.36401 0Z'
                fill='#848E9C'
              />
            </svg>
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      isStriped
      aria-label='Example table with custom cells, pagination and sorting'
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement='outside'
      fullWidth={true}
      classNames={{
        wrapper: 'bg-primaryLight shadow-none',
        th: 'bg-primaryLighter text-primary-50 shadow-none',
        tr: 'cursor-pointer',
        td: 'group-aria-[selected=false]:group-data-[hover=true]:before:bg-primary group-data-[odd=true]:before:bg-primaryLighter',
      }}
      selectedKeys={selectedKeys}
      selectionMode='single'
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement='outside'
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column: any) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'No users found'} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
        )}
      </TableBody>
    </Table>
  );
}
