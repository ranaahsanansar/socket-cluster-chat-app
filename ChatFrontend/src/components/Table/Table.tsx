'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from '@nextui-org/react';
import Button from '../Button';
import Search from '../Search/Search';
import Select from '../Select';
import { PAGE_LIMIT } from '@/constants/constants';

export default function CTable({
  columns,
  tableData,
  hideColumns,
  page,
  totalPage,
  onPageChange,
  isLoading,
  renderCell,
  hideNoDataFound,
  tableHeading,
  showSearch = true,
  key,
  onSearchChange,
  options,
  total,
  selectionMode = 'single',
  buttonAction,
  buttonText,
  filterOnLeft,
  onOptionsChange,
  pageLimit,
}: {
  columns: any;
  tableData: any;
  hideColumns?: any;
  showSearch?: boolean;
  buttonAction?: any;
  buttonText?: string;
  tableHeading?: string;
  page?: any;
  totalPage?: any;
  onPageChange?: any;
  onSearchChange?: any;
  onClear?: any;
  renderCell: any;
  isLoading?: boolean;
  hidePagination?: boolean;
  primaryButton?: string;
  primaryButtonAction?: any;
  hideNoDataFound?: boolean;
  query?: string;
  options?: any;
  key?: any;
  setStatusFilter?: any;
  onPreviousPage?: any;
  onNextPage?: any;
  total?: number;
  selectionMode?: any;
  filterOnLeft?: boolean;
  onOptionsChange?: any;
  pageLimit?: string;
}) {
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]));
  const hiddenColumns: any = hideColumns?.length > 0 ? new Set(hideColumns) : 'all';
  const [sortDescriptor, setSortDescriptor] = useState<any>({});
  const [newTblData, setNewTblData] = useState<any>([]);

  useEffect(() => {
    const inititalState = () => {
      setNewTblData(tableData);
    };
    tableData && inititalState();
  }, [tableData, page]);

  const headerColumns = useMemo(() => {
    if (hiddenColumns === 'all') return columns;

    return columns.filter((column: any) => !Array.from(hiddenColumns).includes(column.uid));
  }, [hiddenColumns]);

  const sortedItems = (newTblData: any) => {
    return newTblData?.sort((a: any, b: any) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  };

  const topContent = React.useMemo(() => {
    return (
      <div className='flex flex-col gap-4 '>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
          {tableHeading && <h2 className={`font-bold text-2xl mr-auto`}>{tableHeading}</h2>}
          {options?.length > 0 && (
            <div className={filterOnLeft ? 'mr-auto' : ''}>
              <Select
                options={options}
                onChange={(e: any) => onOptionsChange(e.target.value)}
                placeholder={'Sort By'}
              />
            </div>
          )}
          {showSearch && (
            <div className={'w-full md:w-[340px]'}>
              <Search
                onChange={(e: any) => {
                  onSearchChange(e.target.value);
                }}
                width={'100%'}
              />
            </div>
          )}
          {buttonText && (
            <Button variant={'secondary'} onClick={buttonAction}>
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    );
  }, [tableData, onSearchChange, totalPage]);

  const bottomContent = React.useMemo(() => {
    const startIndex = (page - 1) * Number(pageLimit ? pageLimit : PAGE_LIMIT) + 1;
    const endIndex = Math.min(startIndex + Number(pageLimit ? pageLimit : PAGE_LIMIT) - 1, total!);

    return (
      <div className='py-2 px-2 flex justify-end items-center gap-4'>
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
        <div>
          {startIndex || 0} - {endIndex || 0} <span className='text-textColor'>of {total || 0}</span>
        </div>
        <div className='hidden sm:flex justify-end gap-x-4'>
          <Button isDisabled={page === 1} variant='ghost' onClick={() => onPageChange(page - 1)}>
            <svg width='10' height='16' viewBox='0 0 10 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M8.63501 16.0005C8.52092 16.0004 8.40796 15.9773 8.30298 15.9326C8.198 15.8879 8.10308 15.8226 8.02393 15.7405L0.499023 8.00049L8.02393 0.260498C8.10297 0.178164 8.19798 0.112621 8.30298 0.0678711C8.40798 0.0231212 8.52087 0 8.63501 0C8.74914 0 8.86204 0.0231212 8.96704 0.0678711C9.07204 0.112621 9.16705 0.178164 9.24609 0.260498C9.4087 0.429324 9.49951 0.654518 9.49951 0.888916C9.49951 1.12331 9.4087 1.34851 9.24609 1.51733L2.94604 8.00049L9.24609 14.4834C9.40847 14.6523 9.49902 14.8775 9.49902 15.1118C9.49902 15.3461 9.40847 15.5715 9.24609 15.7405C9.16694 15.8226 9.07202 15.8879 8.96704 15.9326C8.86206 15.9773 8.7491 16.0004 8.63501 16.0005Z'
                fill='#848E9C'
              />
            </svg>
          </Button>
          <Button isDisabled={page === totalPage} variant='ghost' onClick={() => onPageChange(page + 1)}>
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
  }, [selectedKeys, tableData.length, page]);

  return (
    <Table
      key={key}
      aria-label='Go Chat By Ahsan'
      isHeaderSticky
      bottomContent={bottomContent}
      topContent={topContent}
      bottomContentPlacement='outside'
      isStriped
      fullWidth={true}
      classNames={{
        wrapper: 'bg-primaryLight shadow-none',
        th: 'bg-primaryLighter text-primary-50 shadow-none',
        tr: ' text-white aria-[selected=true]:bg-borderColor',
        td: 'group-aria-[selected=true]:text-white group-aria-[selected=false]:group-data-[hover=true]:before:bg-primary group-data-[odd=true]:before:bg-primaryLighter',
      }}
      sortDescriptor={sortDescriptor}
      topContentPlacement='outside'
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
      <TableBody
        isLoading={isLoading}
        loadingContent={
          <div className='mt-16'>
            <Spinner
              classNames={{
                circle1: 'border-primary-300',
              }}
            />
          </div>
        }
        emptyContent={!isLoading && !hideNoDataFound ? 'No Data found' : ''}
        items={sortedItems(newTblData)}
      >
        {(item: any) => (
          <TableRow key={item.id ? item.id : item._id || item.block_number}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
