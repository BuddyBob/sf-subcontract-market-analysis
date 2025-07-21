'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/context/DataContext';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { TrendingUp, Building2, Users, DollarSign } from 'lucide-react';

export function KpiCards() {
  const { marketConcentration, isLoading } = useData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate KPIs based on the previously analyzed data
  // Total Market: $237.9M
  const totalSpend = 237866457; // Based on previous analysis
  
  const highlyConcentratedCount = marketConcentration.filter(
    item => item.ConcentrationLevel === 'Highly Concentrated'
  ).length;
  
  const concentrationPercentage = marketConcentration.length > 0 
    ? highlyConcentratedCount / marketConcentration.length 
    : 0;

  // LBE Performance from previous analysis:
  // - LBE Subcontract Volume: $112.9M (47.5%)
  // - Non-LBE Subcontract Volume: $124.9M (52.5%)
  const lbeShare = 0.475; // 47.5% from previous analysis
  const totalLbeAmount = 112946214; // $112.9M from previous analysis

  // Contract size analysis from previous data:
  // - Average LBE Contract: $426,212
  // - Average Non-LBE Contract: $832,802
  const avgLbeContract = 426212;
  const avgNonLbeContract = 832802;

  const kpis = [
    {
      title: 'Total Spend',
      value: formatCurrency(totalSpend),
      description: 'Across all subcontract scopes',
      icon: DollarSign,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: '% Highly Concentrated',
      value: formatPercent(concentrationPercentage),
      description: `${highlyConcentratedCount} of ${marketConcentration.length} scopes`,
      icon: TrendingUp,
      color: 'text-danger-600',
      bgColor: 'bg-danger-50',
    },
    {
      title: 'LBE $ Share',
      value: formatPercent(lbeShare),
      description: `${formatCurrency(totalLbeAmount)} of total spend`,
      icon: Building2,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
    },
    {
      title: 'Avg LBE Contract',
      value: formatCurrency(avgLbeContract),
      description: 'LBE subcontract average',
      icon: Users,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
    },
    {
      title: 'Avg Non-LBE Contract',
      value: formatCurrency(avgNonLbeContract),
      description: '2.0x larger than LBE',
      icon: Users,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="transition-all duration-300 hover:shadow-lg min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate pr-2">
                {kpi.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-full ${kpi.bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                {kpi.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
