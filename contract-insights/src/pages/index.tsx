import React from 'react';
import { Hero } from '@/components/hero';
import { KpiCards } from '@/components/kpi-cards';

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <KpiCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Market Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The 2020 San Francisco subcontract market analysis reveals significant patterns in market concentration and Local Business Enterprise (LBE) participation across various construction scopes.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <div className="h-2 w-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Market concentration varies significantly across construction scopes</span>
              </li>
              <li className="flex items-start">
                <div className="h-2 w-2 bg-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>LBE participation shows opportunities for improvement in certain sectors</span>
              </li>
              <li className="flex items-start">
                <div className="h-2 w-2 bg-warning-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Dominant firms control significant market share in specialized areas</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Key Insights
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Navigate through the dashboard to explore detailed analysis of market concentration, LBE equity, and competitive dynamics.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Concentration Analysis</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">How firms are concentrated</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">LBE Equity Review</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">How LBEs participate</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dominant Firms</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Where firms take &gt;25% of market</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
