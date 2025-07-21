#!/usr/bin/env python3
"""
Consolidate LBE data to match the consolidated market concentration data.
This will fix the data inconsistency where Electrical Work shows different values 
in the concentration vs LBE analysis.
"""

import pandas as pd
import numpy as np

def load_consolidation_mapping():
    """Load the scope consolidation mapping"""
    mapping_file = 'consolidated_analysis/scope_consolidation_mapping.csv'
    mapping_df = pd.read_csv(mapping_file)
    
    # Create a dictionary for mapping
    mapping_dict = dict(zip(mapping_df['OriginalScope'], mapping_df['ScopeOfWork']))
    return mapping_dict

def consolidate_lbe_data():
    """Consolidate the LBE scope analysis data"""
    print("Loading LBE scope analysis data...")
    lbe_df = pd.read_csv('lbe_analysis/lbe_scope_analysis.csv')
    
    print("Loading consolidation mapping...")
    mapping_dict = load_consolidation_mapping()
    
    # Create consolidated scope column
    lbe_df['ConsolidatedScope'] = lbe_df['Scope of Work'].map(mapping_dict).fillna(lbe_df['Scope of Work'])
    
    print("Consolidating LBE data...")
    # Group by consolidated scope and aggregate
    consolidated_lbe = lbe_df.groupby('ConsolidatedScope').agg({
        'LBE_Count': 'sum',
        'Total_Subs': 'sum', 
        'Total_Dollars': 'sum'
    }).reset_index()
    
    # Recalculate rates and shares
    consolidated_lbe['LBE_Rate'] = consolidated_lbe['LBE_Count'] / consolidated_lbe['Total_Subs']
    
    # For LBE dollar share, we need to get the weighted average
    # First calculate LBE dollars for each scope
    lbe_df['LBE_Dollars'] = lbe_df['Total_Dollars'] * lbe_df['LBE_Dollar_Share']
    
    # Group and sum LBE dollars
    lbe_dollars_consolidated = lbe_df.groupby('ConsolidatedScope')['LBE_Dollars'].sum().reset_index()
    
    # Merge back and calculate share
    consolidated_lbe = consolidated_lbe.merge(lbe_dollars_consolidated, 
                                             left_on='ConsolidatedScope', 
                                             right_on='ConsolidatedScope')
    
    consolidated_lbe['LBE_Dollar_Share'] = consolidated_lbe['LBE_Dollars'] / consolidated_lbe['Total_Dollars']
    
    # Rename column to match original structure
    consolidated_lbe = consolidated_lbe.rename(columns={'ConsolidatedScope': 'Scope of Work'})
    
    # Reorder columns to match original
    column_order = ['Scope of Work', 'LBE_Count', 'Total_Subs', 'LBE_Rate', 'Total_Dollars', 'LBE_Dollar_Share']
    consolidated_lbe = consolidated_lbe[column_order]
    
    # Sort by total dollars descending
    consolidated_lbe = consolidated_lbe.sort_values('Total_Dollars', ascending=False)
    
    return consolidated_lbe

def main():
    print("=== CONSOLIDATING LBE DATA ===\n")
    
    try:
        consolidated_lbe = consolidate_lbe_data()
        
        # Save the consolidated data
        output_file = 'contract-insights/public/data/lbe_scope_analysis_consolidated.csv'
        consolidated_lbe.to_csv(output_file, index=False)
        
        print(f"Consolidated LBE data saved to: {output_file}")
        print(f"Number of consolidated scopes: {len(consolidated_lbe)}")
        
        # Show some key comparisons
        print("\nKey scope comparisons (Original vs Consolidated):")
        
        # Load original for comparison
        original_lbe = pd.read_csv('lbe_analysis/lbe_scope_analysis.csv')
        
        # Check Electrical Work specifically
        electrical_original = original_lbe[original_lbe['Scope of Work'].str.contains('Electrical', case=False, na=False)]
        electrical_consolidated = consolidated_lbe[consolidated_lbe['Scope of Work'].str.contains('Electrical', case=False, na=False)]
        
        print("\nElectrical Work Analysis:")
        print("Original scopes:")
        for _, row in electrical_original.iterrows():
            print(f"  {row['Scope of Work']}: ${row['Total_Dollars']:,.0f}")
        
        print("Consolidated:")
        for _, row in electrical_consolidated.iterrows():
            print(f"  {row['Scope of Work']}: ${row['Total_Dollars']:,.0f}")
        
        print("\nTop 10 consolidated scopes by total spend:")
        for _, row in consolidated_lbe.head(10).iterrows():
            lbe_share_pct = row['LBE_Dollar_Share'] * 100 if not pd.isna(row['LBE_Dollar_Share']) else 0
            print(f"  {row['Scope of Work']}: ${row['Total_Dollars']:,.0f} ({lbe_share_pct:.1f}% LBE)")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
