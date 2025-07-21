'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/context/DataContext';
import { formatCurrency, formatPercent, getLbeEquityColor } from '@/lib/utils';

export default function LbeEquityPage() {
  const { lbeAnalysis, isLoading } = useData();

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

  // Calculate overall LBE statistics
  const totalDollars = lbeAnalysis.reduce((sum, item) => sum + item.Total_Dollars, 0);
  const totalLbeDollars = lbeAnalysis.reduce(
    (sum, item) => sum + (item.Total_Dollars * item.LBE_Dollar_Share), 
    0
  );
  const overallLbeShare = totalDollars > 0 ? totalLbeDollars / totalDollars : 0;

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

      {/* Comprehensive LBE Participation Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>All Scopes LBE Participation</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Complete overview of LBE participation across all {lbeAnalysis.length} scopes, sorted by LBE share
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
                {lbeAnalysis
                  .sort((a, b) => (b.LBE_Dollar_Share || 0) - (a.LBE_Dollar_Share || 0))
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
