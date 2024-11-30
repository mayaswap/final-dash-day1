import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import SearchBar from './SearchBar';
import { SortablePoolField } from '../../types/pool';
import type { SortDirection } from '../../types/sort';

interface TableHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortField: SortablePoolField | null;
  sortDirection: SortDirection;
  onSort: (field: SortablePoolField) => void;
}

interface SortableHeaderProps {
  field: SortablePoolField;
  label: string;
  currentField: SortablePoolField | null;
  direction: SortDirection;
  onSort: (field: SortablePoolField) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  field,
  label,
  currentField,
  direction,
  onSort,
}) => {
  const isActive = currentField === field;

  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center justify-center space-x-1 hover:text-primary transition-colors group w-full"
    >
      <span className="text-xs text-gray-400 group-hover:text-primary">{label}</span>
      {isActive && (
        direction === 'asc' ? (
          <ArrowUp className="h-3 w-3 text-primary" />
        ) : (
          <ArrowDown className="h-3 w-3 text-primary" />
        )
      )}
    </button>
  );
};

const TableHeader = ({
  searchQuery,
  onSearchChange,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) => {
  return (
    <div className="border-b border-surface-border">
      <div className="grid grid-cols-[2fr_repeat(4,_1fr)] items-center px-4 sm:px-6 py-4 gap-4">
        <div>
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>
        <div className="text-center">
          <SortableHeader
            field="tvl"
            label="TVL"
            currentField={sortField}
            direction={sortDirection}
            onSort={onSort}
          />
        </div>
        <div className="text-center">
          <SortableHeader
            field="volume24h"
            label="24H VOL"
            currentField={sortField}
            direction={sortDirection}
            onSort={onSort}
          />
        </div>
        <div className="text-center">
          <SortableHeader
            field="volume30d"
            label="30D VOL"
            currentField={sortField}
            direction={sortDirection}
            onSort={onSort}
          />
        </div>
        <div className="text-center">
          <SortableHeader
            field="fees24h"
            label="24H FEES"
            currentField={sortField}
            direction={sortDirection}
            onSort={onSort}
          />
        </div>
      </div>
    </div>
  );
};

export default TableHeader;