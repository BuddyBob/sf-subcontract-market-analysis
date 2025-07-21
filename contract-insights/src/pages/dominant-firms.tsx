'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  subcontractor: any;
}

function SlideOver({ isOpen, onClose, subcontractor }: SlideOverProps) {
  if (!isOpen || !subcontractor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-lg animate-slide-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {subcontractor.SubcontractorName}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Contract Details
            </h3>
            <div className="mt-2 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Scope of Work:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white text-right">
                  {subcontractor.ScopeOfWork}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total Amount:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(subcontractor.TotalSubAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Market Share:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatPercent(subcontractor.ShareOfScope)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Rank in Scope:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  #{subcontractor.RankInScope}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Contracts Count:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {subcontractor.ContractsCount}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Market Position
            </h3>
            <div className="mt-2">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatPercent(subcontractor.ShareOfScope)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    of scope total spend
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatCurrency(subcontractor.ScopeTotalSub)} total scope value
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DominantFirmsPage() {
  const { dominantSubcontractors, isLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'ShareOfScope', direction: 'desc' });
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<any>(null);
  const [slideOverOpen, setSlideOverOpen] = useState(false);

  const filteredAndSortedData = useMemo(() => {
    if (!dominantSubcontractors) return [];

    // Filter by search term
    let filtered = dominantSubcontractors.filter(sub =>
      sub.SubcontractorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.ScopeOfWork.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter for dominant firms (>=25% market share)
    filtered = filtered.filter(sub => sub.ShareOfScope >= 0.25);

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key as keyof typeof a];
      let bValue = b[sortConfig.key as keyof typeof b];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [dominantSubcontractors, searchTerm, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRowClick = (subcontractor: any) => {
    setSelectedSubcontractor(subcontractor);
    setSlideOverOpen(true);
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dominant Firms Analysis
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Subcontractors with market share ≥ 25% in their respective scopes
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Dominant Subcontractors</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by firm or scope..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedData.length} dominant firms. Click a row for details.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => handleSort('SubcontractorName')}
                      className="flex items-center gap-2 font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 focus-outline"
                      aria-label="Sort by subcontractor name"
                    >
                      Subcontractor
                      {getSortIcon('SubcontractorName')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => handleSort('ScopeOfWork')}
                      className="flex items-center gap-2 font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 focus-outline"
                      aria-label="Sort by scope of work"
                    >
                      Scope of Work
                      {getSortIcon('ScopeOfWork')}
                    </button>
                  </th>
                  <th className="text-right py-3 px-4">
                    <button
                      onClick={() => handleSort('TotalSubAmount')}
                      className="flex items-center gap-2 font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 focus-outline ml-auto"
                      aria-label="Sort by total amount"
                    >
                      Total Amount
                      {getSortIcon('TotalSubAmount')}
                    </button>
                  </th>
                  <th className="text-center py-3 px-4">
                    <button
                      onClick={() => handleSort('ShareOfScope')}
                      className="flex items-center gap-2 font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 focus-outline mx-auto"
                      aria-label="Sort by market share"
                    >
                      Market Share
                      {getSortIcon('ShareOfScope')}
                    </button>
                  </th>
                  <th className="text-center py-3 px-4">
                    <button
                      onClick={() => handleSort('RankInScope')}
                      className="flex items-center gap-2 font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 focus-outline mx-auto"
                      aria-label="Sort by rank"
                    >
                      Rank
                      {getSortIcon('RankInScope')}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedData.map((sub, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(sub)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {sub.SubcontractorName}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        {sub.ScopeOfWork}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(sub.TotalSubAmount)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sub.ShareOfScope >= 0.5 
                          ? 'text-danger-600 bg-danger-50 dark:bg-danger-900/20'
                          : sub.ShareOfScope >= 0.25 
                            ? 'text-warning-600 bg-warning-50 dark:bg-warning-900/20'
                            : 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      }`}>
                        {formatPercent(sub.ShareOfScope)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-gray-600 dark:text-gray-300">
                        #{sub.RankInScope}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAndSortedData.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No firms found matching your search.' : 'No dominant firms found.'}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <SlideOver
        isOpen={slideOverOpen}
        onClose={() => setSlideOverOpen(false)}
        subcontractor={selectedSubcontractor}
      />
    </div>
  );
}
