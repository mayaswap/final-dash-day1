import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TableHeader from './TableHeader';
import PoolList from './PoolList';
import Pagination from './Pagination';
import TotalFees from './TotalFees';
import LoadingTriangle from '../common/LoadingTriangle';
import { Pool, SortablePoolField, parseValue } from '../../types/pool';
import { SortDirection } from '../../types/sort';
import { fetchPools } from '../../services/pools';
import { parseDollarAmount } from '../../utils/format';

const POOLS_PER_PAGE = 15;

const DashboardBody = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortablePoolField>('tvl');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const loadPools = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedPools = await fetchPools();
      setPools(fetchedPools);
    } catch (error) {
      console.error('Failed to fetch pools:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPools();
  }, [loadPools]);

  const handleSort = (field: SortablePoolField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const filteredAndSortedPools = useMemo(() => {
    let result = [...pools];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(pool => 
        pool.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        let valueA: number, valueB: number;

        switch (sortField) {
          case 'tvl':
          case 'volume24h':
          case 'volume30d':
          case 'fees24h':
            valueA = parseDollarAmount(a[sortField]);
            valueB = parseDollarAmount(b[sortField]);
            break;
          default:
            return 0;
        }

        return sortDirection === 'asc' 
          ? valueA - valueB 
          : valueB - valueA;
      });
    }

    return result;
  }, [pools, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedPools.length / POOLS_PER_PAGE);
  
  const currentPools = useMemo(() => {
    const startIndex = (currentPage - 1) * POOLS_PER_PAGE;
    return filteredAndSortedPools.slice(startIndex, startIndex + POOLS_PER_PAGE);
  }, [filteredAndSortedPools, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <TotalFees pools={pools} />
      <div className="bg-surface rounded-lg border border-surface-border shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1024px]">
            <TableHeader 
              searchQuery={searchQuery} 
              onSearchChange={setSearchQuery}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            {loading ? (
              <LoadingTriangle />
            ) : (
              <>
                <PoolList pools={currentPools} />
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBody;