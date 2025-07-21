'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { 
  sampleMarketConcentration, 
  MarketConcentrationType 
} from '@/data/sample-market-concentration';
import { 
  sampleDominantSubcontractors, 
  DominantSubcontractorType 
} from '@/data/sample-dominant-subcontractors';
import { 
  sampleLbeAnalysis, 
  LbeAnalysisType 
} from '@/data/sample-lbe-analysis';
import { 
  sampleScopeAggregation, 
  ScopeAggregationType 
} from '@/data/sample-scope-aggregation';
import { parseNumericValue } from '@/lib/utils';

interface DataContextType {
  marketConcentration: MarketConcentrationType[];
  dominantSubcontractors: DominantSubcontractorType[];
  lbeAnalysis: LbeAnalysisType[];
  scopeAggregation: ScopeAggregationType[];
  isLoading: boolean;
  isUsingFallback: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [marketConcentration, setMarketConcentration] = useState<MarketConcentrationType[]>(sampleMarketConcentration);
  const [dominantSubcontractors, setDominantSubcontractors] = useState<DominantSubcontractorType[]>(sampleDominantSubcontractors);
  const [lbeAnalysis, setLbeAnalysis] = useState<LbeAnalysisType[]>(sampleLbeAnalysis);
  const [scopeAggregation, setScopeAggregation] = useState<ScopeAggregationType[]>(sampleScopeAggregation);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(true);

  const loadCsvData = async (url: string): Promise<any[]> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);
      const text = await response.text();
      
      return new Promise((resolve, reject) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transform: (value: string, header: string) => {
            // Convert numeric strings to numbers, handling edge cases
            if (header?.includes('Amount') || header?.includes('HHI') || header?.includes('Count') || 
                header?.includes('Dollars') || header?.includes('Rate') || header?.includes('Share') || 
                header?.includes('Rank') || header === 'Total_Subs' || header === 'LBE_Count' ||
                header === 'ScopeTotalSub' || header === 'ScopeHHI' || header === 'NumSubcontractors') {
              return parseNumericValue(value);
            }
            return value;
          },
          complete: (results: any) => {
            if (results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors);
            }
            resolve(results.data);
          },
          error: (error: any) => reject(error)
        });
      });
    } catch (error) {
      console.error(`Error loading ${url}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      let hasErrors = false;

      try {
        // Try to load market concentration data
        try {
          const marketData = await loadCsvData('/data/market_concentration_hhi_consolidated.csv');
          if (marketData.length > 0) {
            setMarketConcentration(marketData);
          }
        } catch (error) {
          console.warn('Using fallback market concentration data');
          hasErrors = true;
        }

        // Try to load dominant subcontractors data
        try {
          const dominantData = await loadCsvData('/data/dominant_subcontractors_consolidated.csv');
          if (dominantData.length > 0) {
            setDominantSubcontractors(dominantData);
          }
        } catch (error) {
          console.warn('Using fallback dominant subcontractors data');
          hasErrors = true;
        }

        // Try to load LBE analysis data
        try {
          const lbeData = await loadCsvData('/data/lbe_scope_analysis_consolidated.csv');
          if (lbeData.length > 0) {
            setLbeAnalysis(lbeData);
          }
        } catch (error) {
          console.warn('Using fallback LBE analysis data');
          hasErrors = true;
        }

        // Try to load scope aggregation data
        try {
          const scopeData = await loadCsvData('/data/scope_subcontractor_aggregation_consolidated.csv');
          if (scopeData.length > 0) {
            setScopeAggregation(scopeData);
          }
        } catch (error) {
          console.warn('Using fallback scope aggregation data');
          hasErrors = true;
        }

        if (hasErrors) {
          setIsUsingFallback(true);
          toast.error('Full dataset not found, using sample data', {
            duration: 4000,
            position: 'top-right',
          });
        } else {
          setIsUsingFallback(false);
          toast.success('Full dataset loaded successfully', {
            duration: 3000,
            position: 'top-right',
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setIsUsingFallback(true);
        toast.error('Error loading data, using sample dataset', {
          duration: 4000,
          position: 'top-right',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  const value: DataContextType = {
    marketConcentration,
    dominantSubcontractors,
    lbeAnalysis,
    scopeAggregation,
    isLoading,
    isUsingFallback,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
