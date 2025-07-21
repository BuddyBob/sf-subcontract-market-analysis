'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/' },
  { name: 'Concentration', href: '/concentration' },
  { name: 'LBE Equity', href: '/lbe-equity' },
  { name: 'Dominant Firms', href: '/dominant-firms' },
  { name: 'Downloads', href: '/downloads' },
];

interface NavigationProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export function Navigation({ darkMode, setDarkMode }: NavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">SF</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                Contract Insights
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-200'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                )}
                aria-label={`Navigate to ${item.name}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
              className="hidden md:inline-flex"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-200'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle dark mode"
                className="w-full justify-start"
              >
                {darkMode ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark Mode
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
