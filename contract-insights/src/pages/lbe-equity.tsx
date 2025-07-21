'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/context/DataContext';
import { formatCurrency, formatPercent, getLbeEquityColor } from '@/lib/utils';
import { ArrowUpDown, Users, DollarSign, TrendingUp, Building2, Search } from 'lucide-react';

export default function LbeEquityPage() {
  const { lbeAnalysis, isLoading } = useData();
  const [sortBy, setSortBy] = useState<'lbeShare' | 'totalSpend' | 'lbeCount' | 'scope'>('lbeShare');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
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

  // Calculate overall LBE statistics and performance metrics
  const totalDollars = lbeAnalysis.reduce((sum, item) => sum + item.Total_Dollars, 0);
  const totalLbeDollars = lbeAnalysis.reduce(
    (sum, item) => sum + (item.Total_Dollars * item.LBE_Dollar_Share), 
    0
  );
  const overallLbeShare = totalDollars > 0 ? totalLbeDollars / totalDollars : 0;

  // Performance metrics for LBE vs Non-LBE
  const totalLbeCount = lbeAnalysis.reduce((sum, item) => sum + item.LBE_Count, 0);
  const totalSubsCount = lbeAnalysis.reduce((sum, item) => sum + item.Total_Subs, 0);
  const totalNonLbeCount = totalSubsCount - totalLbeCount;
  const totalNonLbeDollars = totalDollars - totalLbeDollars;
  
  const avgLbeContractSize = totalLbeCount > 0 ? totalLbeDollars / totalLbeCount : 0;
  const avgNonLbeContractSize = totalNonLbeCount > 0 ? totalNonLbeDollars / totalNonLbeCount : 0;

  // Prepare donut chart data
  const donutData = [
    {
      name: 'LBE Spend',
      value: totalLbeDollars,
      color: '#00795C'
    },
    {
      name: 'Non-LBE Spend',
      value: totalDollars - totalLbeDollars,
      color: '#D92F2F'
    }
  ];

  // Prepare scopes with concerning LBE shares
  const concerningScopes = lbeAnalysis
    .filter(item => item.LBE_Dollar_Share < 0.25 || item.LBE_Dollar_Share > 0.75)
    .sort((a, b) => a.LBE_Dollar_Share - b.LBE_Dollar_Share)
    .slice(0, 10);

  // Prepare bar chart data for LBE rates
  const scopeData = lbeAnalysis
    .filter(item => item.Total_Dollars && item.Total_Dollars > 0) // Filter out invalid data
    .sort((a, b) => b.Total_Dollars - a.Total_Dollars)
    .slice(0, 10)
    .map(item => ({
      scope: item['Scope of Work'].length > 30 
        ? item['Scope of Work'].substring(0, 30) + '...' 
        : item['Scope of Work'],
      fullScope: item['Scope of Work'],
      lbeShare: Number(item.LBE_Dollar_Share) || 0, // Ensure it's a number
      totalSpend: Number(item.Total_Dollars) || 0,
      lbeCount: Number(item.LBE_Count) || 0,
      totalSubs: Number(item.Total_Subs) || 0
    }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{data.fullScope}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">LBE Share:</span> {formatPercent(data.lbeShare)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Total Spend:</span> {formatCurrency(data.totalSpend)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">LBE/Total Subs:</span> {data.lbeCount}/{data.totalSubs}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          LBE Equity Analysis
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Local Business Enterprise participation and equity assessment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* LBE vs Non-LBE Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Overall LBE Spend Distribution</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatPercent(overallLbeShare)} LBE participation across all scopes
            </p>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">LBE Spend</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-danger-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Non-LBE Spend</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LBE vs Non-LBE Performance Comparison */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            LBE vs Non-LBE Performance Comparison
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Market share, contractor counts, and average contract sizes
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Market Share */}
            <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-primary-800 dark:text-primary-200">
                {formatPercent(overallLbeShare)}
              </div>
              <div className="text-sm text-primary-600 dark:text-primary-300 font-medium">LBE Market Share</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatCurrency(totalLbeDollars)} of {formatCurrency(totalDollars)}
              </div>
            </div>

            <div className="text-center p-4 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-6 w-6 text-danger-600" />
              </div>
              <div className="text-2xl font-bold text-danger-800 dark:text-danger-200">
                {formatPercent(1 - overallLbeShare)}
              </div>
              <div className="text-sm text-danger-600 dark:text-danger-300 font-medium">Non-LBE Market Share</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatCurrency(totalNonLbeDollars)} of {formatCurrency(totalDollars)}
              </div>
            </div>

            {/* Contractor Counts */}
            <div className="text-center p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
                {totalLbeCount}
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-300 font-medium">LBE Contractors</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatPercent(totalLbeCount / totalSubsCount)} of total
              </div>
            </div>

            <div className="text-center p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-warning-600" />
              </div>
              <div className="text-2xl font-bold text-warning-800 dark:text-warning-200">
                {totalNonLbeCount}
              </div>
              <div className="text-sm text-warning-600 dark:text-warning-300 font-medium">Non-LBE Contractors</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatPercent(totalNonLbeCount / totalSubsCount)} of total
              </div>
            </div>
          </div>

          
        </CardContent>
      </Card>

      {/* Comprehensive LBE Participation Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>All Scopes LBE Participation</CardTitle>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete overview of LBE participation across all {lbeAnalysis.length} scopes
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-300">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                >
                  <option value="lbeShare">LBE Share</option>
                  <option value="totalSpend">Total Spend</option>
                  <option value="lbeCount">LBE Count</option>
                  <option value="scope">Scope Name</option>
                </select>
                <button
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-1 px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <ArrowUpDown className="h-3 w-3" />
                  {sortDirection === 'desc' ? 'Desc' : 'Asc'}
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Scope of Work</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">LBE Share</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">LBE Count</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Total Subs</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Total Spend</th>
                </tr>
              </thead>
              <tbody>
                {lbeAnalysis
                  .filter(scope => 
                    scope['Scope of Work'].toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .sort((a, b) => {
                    let valueA, valueB;
                    switch (sortBy) {
                      case 'lbeShare':
                        valueA = a.LBE_Dollar_Share || 0;
                        valueB = b.LBE_Dollar_Share || 0;
                        break;
                      case 'totalSpend':
                        valueA = a.Total_Dollars || 0;
                        valueB = b.Total_Dollars || 0;
                        break;
                      case 'lbeCount':
                        valueA = a.LBE_Count || 0;
                        valueB = b.LBE_Count || 0;
                        break;
                      case 'scope':
                        valueA = a['Scope of Work'];
                        valueB = b['Scope of Work'];
                        break;
                      default:
                        valueA = a.LBE_Dollar_Share || 0;
                        valueB = b.LBE_Dollar_Share || 0;
                    }
                    
                    if (typeof valueA === 'string' && typeof valueB === 'string') {
                      return sortDirection === 'desc' 
                        ? valueB.localeCompare(valueA)
                        : valueA.localeCompare(valueB);
                    }
                    
                    return sortDirection === 'desc' 
                      ? (valueB as number) - (valueA as number)
                      : (valueA as number) - (valueB as number);
                  })
                  .map((scope, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {scope['Scope of Work']}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLbeEquityColor(scope.LBE_Dollar_Share)}`}>
                        {formatPercent(scope.LBE_Dollar_Share || 0)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-300">
                      {scope.LBE_Count || 0}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-300">
                      {scope.Total_Subs || 0}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-300">
                      {formatCurrency(scope.Total_Dollars || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Concerning LBE Equity Scopes */}
      <Card>
        <CardHeader>
          <CardTitle>Scopes Requiring Attention</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Scopes with very low (&lt;25%) or very high (&gt;75%) LBE participation
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Scope of Work</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">LBE Share</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">LBE Count</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Total Subs</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Total Spend</th>
                </tr>
              </thead>
              <tbody>
                {concerningScopes.map((scope, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {scope['Scope of Work']}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLbeEquityColor(scope.LBE_Dollar_Share)}`}>
                        {formatPercent(scope.LBE_Dollar_Share)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-300">
                      {scope.LBE_Count}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-300">
                      {scope.Total_Subs}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-300">
                      {formatCurrency(scope.Total_Dollars)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
