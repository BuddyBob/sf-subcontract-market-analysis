#!/usr/bin/env python3

import pandas as pd
import numpy as np
import os

def comprehensive_data_audit():
    """
    Comprehensive audit of all data files for consistency and errors.
    """
    print("=== COMPREHENSIVE DATA AUDIT ===\n")
    
    errors_found = []
    warnings_found = []
    
    # 1. Check all CSV files exist
    print("1. FILE EXISTENCE CHECK")
    required_files = [
        'contract-insights/public/data/firm_analysis.csv',
        'contract-insights/public/data/market_concentration_hhi_consolidated.csv',
        'contract-insights/public/data/scope_subcontractor_aggregation_consolidated.csv',
        'contract-insights/public/data/lbe_scope_analysis_consolidated.csv',
        'contract-insights/public/data/dominant_subcontractors_consolidated.csv',
        'contract-insights/public/data/competitive_scopes.csv',
        'contract-insights/public/data/lbe_vs_nonlbe_comparison.csv',
        'lbe_analysis/firm_analysis.csv',
        'lbe_analysis/lbe_scope_analysis.csv',
        'lbe_analysis/competitive_scopes.csv',
        'lbe_analysis/lbe_vs_nonlbe_comparison.csv'
    ]
    
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - MISSING")
            errors_found.append(f"Missing file: {file_path}")
    
    # 2. Data consistency checks
    print(f"\n2. DATA CONSISTENCY CHECKS")
    
    try:
        # Load main data files
        firm_df = pd.read_csv('contract-insights/public/data/firm_analysis.csv')
        conc_df = pd.read_csv('contract-insights/public/data/market_concentration_hhi_consolidated.csv')
        scope_df = pd.read_csv('contract-insights/public/data/scope_subcontractor_aggregation_consolidated.csv')
        lbe_df = pd.read_csv('contract-insights/public/data/lbe_scope_analysis_consolidated.csv')
        dom_df = pd.read_csv('contract-insights/public/data/dominant_subcontractors_consolidated.csv')
        
        # Check total dollars consistency
        expected_total = 78232534
        firm_total = firm_df['Total_Dollars'].sum()
        scope_total = scope_df['TotalSubAmount'].sum()
        
        if abs(firm_total - expected_total) < 1000:
            print(f"✅ Firm analysis total: ${firm_total:,.0f}")
        else:
            print(f"❌ Firm analysis total: ${firm_total:,.0f} (expected ${expected_total:,.0f})")
            errors_found.append(f"Firm analysis total mismatch: {firm_total}")
            
        if abs(scope_total - expected_total) < 1000:
            print(f"✅ Scope aggregation total: ${scope_total:,.0f}")
        else:
            print(f"❌ Scope aggregation total: ${scope_total:,.0f} (expected ${expected_total:,.0f})")
            errors_found.append(f"Scope aggregation total mismatch: {scope_total}")
        
        # Check scope counts
        if len(conc_df) == len(lbe_df):
            print(f"✅ Scope count consistency: {len(conc_df)} scopes")
        else:
            print(f"❌ Scope count mismatch: Concentration={len(conc_df)}, LBE={len(lbe_df)}")
            errors_found.append(f"Scope count mismatch")
            
        # Check for null values
        null_checks = [
            (firm_df, 'firm_analysis'),
            (conc_df, 'market_concentration'),
            (scope_df, 'scope_aggregation'),
            (lbe_df, 'lbe_analysis'),
            (dom_df, 'dominant_subcontractors')
        ]
        
        for df, name in null_checks:
            null_count = df.isnull().sum().sum()
            if null_count == 0:
                print(f"✅ {name}: No null values")
            else:
                print(f"⚠️  {name}: {null_count} null values")
                warnings_found.append(f"{name} has {null_count} null values")
        
        # Check data types
        print(f"\n3. DATA TYPE CHECKS")
        
        # HHI should be integers
        if conc_df['ScopeHHI'].dtype in ['int64', 'int32']:
            print("✅ HHI values are integers")
        else:
            hhi_sample = conc_df['ScopeHHI'].head(3).tolist()
            if all(float(x).is_integer() for x in hhi_sample):
                print("✅ HHI values are effectively integers")
            else:
                print(f"⚠️  HHI values may have decimals: {hhi_sample}")
                warnings_found.append("HHI values not properly rounded")
        
        # LBE status should be boolean
        if firm_df['Is_LBE'].dtype == 'bool':
            print("✅ LBE status is boolean")
        else:
            lbe_values = firm_df['Is_LBE'].unique()
            print(f"⚠️  LBE status values: {lbe_values}")
            if set(lbe_values) <= {True, False}:
                print("✅ LBE status values are valid booleans")
            else:
                warnings_found.append(f"Invalid LBE status values: {lbe_values}")
        
        # Check for duplicate contractors
        duplicate_firms = firm_df['Contractor Name'].duplicated().sum()
        if duplicate_firms == 0:
            print("✅ No duplicate contractor names")
        else:
            print(f"❌ {duplicate_firms} duplicate contractor names")
            errors_found.append(f"{duplicate_firms} duplicate contractor names")
        
        # Check share values are between 0 and 1
        invalid_shares = scope_df[(scope_df['ShareOfScope'] < 0) | (scope_df['ShareOfScope'] > 1)]
        if len(invalid_shares) == 0:
            print("✅ All share values are valid (0-1)")
        else:
            print(f"❌ {len(invalid_shares)} invalid share values")
            errors_found.append(f"{len(invalid_shares)} invalid share values")
        
    except Exception as e:
        print(f"❌ Error during data checks: {e}")
        errors_found.append(f"Data check error: {e}")
    
    # 4. Cross-file consistency
    print(f"\n4. CROSS-FILE CONSISTENCY")
    
    try:
        # Check if dominant subcontractors exist in scope aggregation
        dom_contractors = set(dom_df['SubcontractorName'].unique())
        scope_contractors = set(scope_df['SubcontractorName'].unique())
        
        missing_contractors = dom_contractors - scope_contractors
        if len(missing_contractors) == 0:
            print("✅ All dominant contractors exist in scope aggregation")
        else:
            print(f"❌ {len(missing_contractors)} dominant contractors missing from scope aggregation")
            errors_found.append(f"Missing contractors in scope aggregation: {missing_contractors}")
        
        # Check if scope names match between concentration and LBE files
        conc_scopes = set(conc_df['ScopeOfWork'].unique())
        lbe_scopes = set(lbe_df['Scope of Work'].unique())
        
        scope_diff = conc_scopes.symmetric_difference(lbe_scopes)
        if len(scope_diff) == 0:
            print("✅ Scope names match between concentration and LBE files")
        else:
            print(f"⚠️  {len(scope_diff)} scope name differences between files")
            warnings_found.append(f"Scope name differences: {scope_diff}")
            
    except Exception as e:
        print(f"❌ Error during cross-file checks: {e}")
        errors_found.append(f"Cross-file check error: {e}")
    
    # Summary
    print(f"\n=== AUDIT SUMMARY ===")
    print(f"Errors found: {len(errors_found)}")
    print(f"Warnings found: {len(warnings_found)}")
    
    if errors_found:
        print(f"\nERRORS:")
        for error in errors_found:
            print(f"❌ {error}")
    
    if warnings_found:
        print(f"\nWARNINGS:")
        for warning in warnings_found:
            print(f"⚠️  {warning}")
    
    if not errors_found and not warnings_found:
        print("✅ No issues found - data is consistent!")
    
    return errors_found, warnings_found

if __name__ == "__main__":
    comprehensive_data_audit()
