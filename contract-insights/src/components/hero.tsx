'use client';

import React from 'react';
import { useData } from '@/context/DataContext';

export function Hero() {
  const { isUsingFallback } = useData();

  return (
    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900 py-12 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">2020 SF Subcontract</span>
            <span className="block text-primary-600 dark:text-primary-400">
              Market Analysis
            </span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Interactive dashboard analyzing market concentration, LBE equity, and dominant firm patterns 
            in San Francisco&apos;s 2020 subcontract marketplace.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              {isUsingFallback && (
                <div className="inline-flex items-center px-4 py-2 border border-warning-300 rounded-md text-sm font-medium text-warning-700 bg-warning-50 dark:bg-warning-900 dark:text-warning-200 dark:border-warning-700">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Using sample data - see Downloads for full dataset
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
