'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/context/DataContext';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Info, ChevronDown, Target, ArrowUpDown, Search, X } from 'lucide-react';

// Component for showing subcontractor details within a scope
function ScopeSubcontractorDetails({ scopeName }: { scopeName: string }) {
  const { scopeAggregation } = useData();
  const [subSearchTerm, setSubSearchTerm] = useState('');
  
  // Get ALL subcontractors for this specific scope, sorted by percentage
  const scopeSubcontractors = scopeAggregation
    .filter(sub => sub.ScopeOfWork === scopeName)
    .filter(sub => 
      sub.SubcontractorName.toLowerCase().includes(subSearchTerm.toLowerCase())
    )
    .sort((a, b) => (b.ShareOfScope || 0) - (a.ShareOfScope || 0));

  const totalSubcontractors = scopeAggregation
    .filter(sub => sub.ScopeOfWork === scopeName).length;

  if (totalSubcontractors === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        No subcontractor data available for this scope.
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-4 w-4 text-primary-600" />
        <h4 className="font-medium text-gray-900 dark:text-white">
          All Subcontractors in {scopeName}
        </h4>
        <span className="text-sm text-gray-500">
          ({subSearchTerm ? `${scopeSubcontractors.length} of ${totalSubcontractors}` : `${totalSubcontractors}`} firms)
        </span>
      </div>
      
      {/* Search field for subcontractors */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search subcontractors..."
            value={subSearchTerm}
            onChange={(e) => setSubSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {subSearchTerm && (
            <button
              onClick={() => setSubSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {scopeSubcontractors.map((sub, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded border">
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">
                {sub.SubcontractorName}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(sub.TotalSubAmount || 0)}
              </div>
              <div className="text-sm font-medium" style={{
                color: (sub.ShareOfScope || 0) >= 0.5 ? '#D92F2F' : 
                       (sub.ShareOfScope || 0) >= 0.25 ? '#E7B800' : '#22C55E'
              }}>
                {formatPercent(sub.ShareOfScope || 0)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ConcentrationPage() {
  const { marketConcentration, isLoading } = useData();
  const [expandedScope, setExpandedScope] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'spend' | 'hhi'>('spend');
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const concentrationData = [
    {
      tier: 'Highly Concentrated',
      count: marketConcentration.filter(item => item.ConcentrationLevel === 'Highly Concentrated').length,
      spend: marketConcentration
        .filter(item => item.ConcentrationLevel === 'Highly Concentrated')
        .reduce((sum, item) => sum + (item.ScopeTotalSub || 0), 0),
      color: '#D92F2F'
    },
    {
      tier: 'Moderately Concentrated',
      count: marketConcentration.filter(item => item.ConcentrationLevel === 'Moderately Concentrated').length,
      spend: marketConcentration
        .filter(item => item.ConcentrationLevel === 'Moderately Concentrated')
        .reduce((sum, item) => sum + (item.ScopeTotalSub || 0), 0),
      color: '#E7B800'
    },
    {
      tier: 'Unconcentrated',
      count: marketConcentration.filter(item => item.ConcentrationLevel === 'Unconcentrated').length,
      spend: marketConcentration
        .filter(item => item.ConcentrationLevel === 'Unconcentrated')
        .reduce((sum, item) => sum + (item.ScopeTotalSub || 0), 0),
      color: '#00795C'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Market Concentration Analysis
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
        Analyzing market concentration using Herfindahl-Hirschman Index (HHI) methodology.
      </p>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 text-sm">
        <span>
        <strong>HHI Scale:</strong>
        </span>
        <span className="flex gap-2 flex-wrap">
        <span className="px-2 py-1 rounded bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200">
          &lt; 1,500: Competitive
        </span>
        <span className="px-2 py-1 rounded bg-warning-50 dark:bg-warning-900/20 text-warning-800 dark:text-warning-200">
          1,500–2,499: Moderately Concentrated
        </span>
        <span className="px-2 py-1 rounded bg-danger-50 dark:bg-danger-900/20 text-danger-800 dark:text-danger-200">
          ≥ 2,500: Highly Concentrated (Few Firms Competing)
        </span>
        </span>
      </div>
    </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
        {/* Concentration Tier Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Spend by Concentration Level
              <div className="group relative">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                  HHI &lt; 1500: Unconcentrated, 1500-2500: Moderate, &gt;2500: High
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={concentrationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="tier" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Total Spend']}
                    labelFormatter={(label) => `${label} (${concentrationData.find(d => d.tier === label)?.count || 0} scopes)`}
                  />
                  <Bar dataKey="spend" fill="#0669B2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Market Scopes Overview Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Market Scope Analysis
              <div className="group relative">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                  Click on a scope to see individual subcontractor breakdown
                </div>
              </div>
            </CardTitle>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {marketConcentration.length} scopes of work analyzed. Click any scope to see subcontractor details.
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-300">Sort by:</label>
                  <button
                    onClick={() => setSortBy(sortBy === 'spend' ? 'hhi' : 'spend')}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {sortBy === 'spend' ? 'Total Spend' : 'HHI'}
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
              
              {/* Search Field */}
              <div className="flex items-center gap-2 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search scopes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {marketConcentration
                .filter(scope => 
                  scope.ScopeOfWork.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .sort((a, b) => {
                  if (sortBy === 'spend') {
                    return (b.ScopeTotalSub || 0) - (a.ScopeTotalSub || 0);
                  } else {
                    // HHI sorting: ascending (lower HHI = less concentrated = better competition)
                    return (a.ScopeHHI || 0) - (b.ScopeHHI || 0);
                  }
                })
                .map((scope, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <button
                    className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-lg"
                    onClick={() => setExpandedScope(expandedScope === scope.ScopeOfWork ? null : scope.ScopeOfWork)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          scope.ConcentrationLevel === 'Highly Concentrated' ? 'bg-danger-500' :
                          scope.ConcentrationLevel === 'Moderately Concentrated' ? 'bg-warning-500' :
                          'bg-primary-500'
                        }`}></div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {scope.ScopeOfWork}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {scope.ConcentrationLevel}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-20 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {scope.NumSubcontractors}
                          </div>
                          <div className="text-xs text-gray-500">Subs</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {scope.ScopeHHI}
                          </div>
                          <div className="text-xs text-gray-500">HHI</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(scope.ScopeTotalSub || 0)}
                          </div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                          expandedScope === scope.ScopeOfWork ? 'transform rotate-180' : ''
                        }`} />
                      </div>
                    </div>
                  </button>
                  {expandedScope === scope.ScopeOfWork && (
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <ScopeSubcontractorDetails scopeName={scope.ScopeOfWork} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Concentration Levels Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding HHI Concentration Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-900/20">
              <h3 className="font-semibold text-primary-800 dark:text-primary-200">Unconcentrated</h3>
              <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">
                HHI &lt; 1,500 - Competitive market with many players
              </p>
            </div>
            <div className="p-4 border-l-4 border-warning-500 bg-warning-50 dark:bg-warning-900/20">
              <h3 className="font-semibold text-warning-800 dark:text-warning-200">Moderately Concentrated</h3>
              <p className="text-sm text-warning-700 dark:text-warning-300 mt-1">
                HHI 1,500-2,500 - Some concentration, potential concerns
              </p>
            </div>
            <div className="p-4 border-l-4 border-danger-500 bg-danger-50 dark:bg-danger-900/20">
              <h3 className="font-semibold text-danger-800 dark:text-danger-200">Highly Concentrated</h3>
              <p className="text-sm text-danger-700 dark:text-danger-300 mt-1">
                HHI &gt; 2,500 - High concentration, limited competition
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
