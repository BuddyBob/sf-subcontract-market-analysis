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
              The San Francisco subcontract market analysis reveals significant patterns in market concentration and Local Business Enterprise (LBE) participation across various construction scopes.
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

        {/* Developer Credit */}
        <div className="mt-12 pb-8 flex justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              Project developed by Thavas Antonio as part of SFPUC internship
              <a 
                href="https://www.linkedin.com/in/thavas-antonio/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                aria-label="Connect with Thavas Antonio on LinkedIn"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
