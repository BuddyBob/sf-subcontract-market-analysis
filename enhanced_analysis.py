"""
Enhanced Bid Analysis with Scope Consolidation
Addresses the artificial fragmentation issue that skews market concentration data
"""

import pandas as pd
import numpy as np
import re
from typing import Dict, Tuple, List, Optional


def consolidate_scopes(df: pd.DataFrame) -> pd.DataFrame:
    """
    Consolidate artificially fragmented scopes into meaningful trade categories.
    
    This addresses the issue where similar scopes like:
    - "AC Paving", "AC paving", "AC Paving & Concrete flatwork", etc.
    are treated as separate markets when they should be consolidated.
    
    Args:
        df: DataFrame with original scope data
    
    Returns:
        DataFrame with consolidated scopes
    """
    print("Consolidating artificially fragmented scopes...")
    
    df_consolidated = df.copy()
    df_consolidated['OriginalScope'] = df_consolidated['ScopeOfWork']
    
    # Define consolidation rules
    consolidation_rules = {
        'AC_PAVING_WORK': {
            'keywords': ['ac paving', 'asphalt paving', 'ac grinding', 'ac mill', 'asphalt grinding', 'asphalt work', 'asphalt concrete', 'ac panel', 'grinding & paving', 'grinding, paving', 'ac & grinding'],
            'exclude': ['design', 'survey', 'testing'],
            'consolidated_name': 'AC Paving & Asphalt Work (Consolidated)'
        },
        'GRINDING_WORK': {
            'keywords': ['grinding'],
            'exclude': ['ac', 'asphalt', 'paving', 'design', 'survey', 'testing'],
            'consolidated_name': 'Grinding Work (Consolidated)'
        },
        'CONCRETE_WORK': {
            'keywords': ['concrete', 'cast in place'],
            'exclude': ['ac', 'asphalt', 'design'],
            'consolidated_name': 'Concrete Work (Consolidated)'
        },
        'TRAFFIC_CONTROL': {
            'keywords': ['traffic', 'sawcutting'],
            'exclude': ['design'],
            'consolidated_name': 'Traffic Control & Sawcutting (Consolidated)'
        },
        'PIPELINE_WORK': {
            'keywords': ['cipp', 'cipl', 'pipeline', 'sewer', 'water'],
            'exclude': ['design', 'testing'],
            'consolidated_name': 'Pipeline & Sewer Work (Consolidated)'
        },
        'TRUCKING_HAULING': {
            'keywords': ['trucking', 'hauling', 'transport'],
            'exclude': [],
            'consolidated_name': 'Trucking & Hauling (Consolidated)'
        },
        'ENGINEERING_DESIGN': {
            'keywords': ['engineering', 'design', 'survey'],
            'exclude': [],
            'consolidated_name': 'Engineering & Design Services (Consolidated)'
        },
        'ELECTRICAL_WORK': {
            'keywords': ['electrical', 'electric'],
            'exclude': [],
            'consolidated_name': 'Electrical Work (Consolidated)'
        },
        'STRUCTURAL_WORK': {
            'keywords': ['structural', 'steel', 'frame'],
            'exclude': [],
            'consolidated_name': 'Structural Work (Consolidated)'
        }
    }
    
    def get_consolidated_scope(original_scope) -> str:
        """Determine consolidated scope category for a given original scope"""
        # Handle NaN values
        if pd.isna(original_scope):
            return "Unknown/Unspecified Scope"
        
        scope_lower = str(original_scope).lower().strip()
        
        for category, rules in consolidation_rules.items():
            # Check if any keywords match
            has_keyword = any(keyword in scope_lower for keyword in rules['keywords'])
            # Check if any exclude terms match
            has_exclude = any(exclude in scope_lower for exclude in rules['exclude'])
            
            if has_keyword and not has_exclude:
                return rules['consolidated_name']
        
        # If no consolidation rule matches, keep original (but clean it)
        return str(original_scope).strip()
    
    # Apply consolidation
    df_consolidated['ScopeOfWork'] = df_consolidated['OriginalScope'].apply(get_consolidated_scope)
    
    # Show consolidation results
    consolidation_summary = df_consolidated.groupby('ScopeOfWork')['OriginalScope'].nunique().sort_values(ascending=False)
    print("\nScope Consolidation Summary:")
    print("Consolidated Scope -> Number of Original Scopes Combined")
    for scope, count in consolidation_summary.head(10).items():
        if count > 1:
            print(f"  {scope}: {count} original scopes")
    
    return df_consolidated


def analyze_with_consolidation(file_path: str):
    """
    Run the full analysis with scope consolidation to get realistic market concentration insights.
    """
    print("=== ENHANCED BID ANALYSIS WITH SCOPE CONSOLIDATION ===\n")
    
    # Load the existing analysis results
    print("Loading existing analysis results...")
    
    try:
        # Read the detailed subcontractor records
        subs_data = pd.read_csv('analysis_results/02_subcontractor_records.csv')
        print(f"Loaded {len(subs_data)} subcontractor records")
        
        # Consolidate scopes
        subs_consolidated = consolidate_scopes(subs_data)
        
        # Re-aggregate with consolidated scopes
        print("\nRe-computing aggregations with consolidated scopes...")
        
        # Group by consolidated scope and contractor
        scope_sub_agg_consolidated = subs_consolidated.groupby(['ScopeOfWork', 'SubcontractorName']).agg({
            'SubAmount': 'sum',
            'ContractID': 'nunique'
        }).reset_index()
        
        scope_sub_agg_consolidated = scope_sub_agg_consolidated.rename(columns={
            'SubAmount': 'TotalSubAmount',
            'ContractID': 'ContractsCount'
        })
        
        # Compute scope totals and shares
        scope_totals = scope_sub_agg_consolidated.groupby('ScopeOfWork')['TotalSubAmount'].sum().reset_index()
        scope_totals = scope_totals.rename(columns={'TotalSubAmount': 'ScopeTotalSub'})
        
        scope_sub_agg_consolidated = scope_sub_agg_consolidated.merge(scope_totals, on='ScopeOfWork')
        scope_sub_agg_consolidated['ShareOfScope'] = scope_sub_agg_consolidated['TotalSubAmount'] / scope_sub_agg_consolidated['ScopeTotalSub']
        
        # Compute HHI for consolidated scopes
        def calc_hhi(group):
            shares = group['ShareOfScope']
            hhi = (shares ** 2).sum() * 10000
            return hhi
        
        scope_hhi_consolidated = scope_sub_agg_consolidated.groupby('ScopeOfWork').apply(calc_hhi, include_groups=False).reset_index()
        scope_hhi_consolidated.columns = ['ScopeOfWork', 'ScopeHHI']
        
        # Add scope statistics
        scope_stats = scope_sub_agg_consolidated.groupby('ScopeOfWork').agg({
            'SubcontractorName': 'nunique',
            'TotalSubAmount': 'sum'
        }).reset_index()
        scope_stats.columns = ['ScopeOfWork', 'NumSubcontractors', 'ScopeTotalSub']
        
        scope_hhi_consolidated = scope_hhi_consolidated.merge(scope_stats, on='ScopeOfWork')
        
        # Classify concentration levels
        def classify_concentration(hhi):
            if hhi < 1500:
                return "Unconcentrated"
            elif hhi <= 2500:
                return "Moderately Concentrated"
            else:
                return "Highly Concentrated"
        
        scope_hhi_consolidated['ConcentrationLevel'] = scope_hhi_consolidated['ScopeHHI'].apply(classify_concentration)
        
        # Extract dominant subcontractors (consolidated)
        dominant_subs_consolidated = scope_sub_agg_consolidated[scope_sub_agg_consolidated['ShareOfScope'] >= 0.25].copy()
        dominant_subs_consolidated['RankInScope'] = dominant_subs_consolidated.groupby('ScopeOfWork')['ShareOfScope'].rank(
            method='dense', ascending=False
        )
        
        # Print comparison results
        print("\n=== COMPARISON: BEFORE vs AFTER CONSOLIDATION ===")
        
        # Load original results for comparison
        original_hhi = pd.read_csv('analysis_results/04_market_concentration_hhi.csv')
        original_dominant = pd.read_csv('analysis_results/05_dominant_subcontractors.csv')
        
        print(f"\n📊 SCOPE COUNTS:")
        print(f"  Original scopes: {len(original_hhi)}")
        print(f"  Consolidated scopes: {len(scope_hhi_consolidated)}")
        print(f"  Reduction: {len(original_hhi) - len(scope_hhi_consolidated)} scopes consolidated")
        
        print(f"\n📊 MARKET CONCENTRATION:")
        orig_highly_concentrated = len(original_hhi[original_hhi['ConcentrationLevel'] == 'Highly Concentrated'])
        new_highly_concentrated = len(scope_hhi_consolidated[scope_hhi_consolidated['ConcentrationLevel'] == 'Highly Concentrated'])
        
        print(f"  Original highly concentrated: {orig_highly_concentrated}/{len(original_hhi)} ({orig_highly_concentrated/len(original_hhi)*100:.1f}%)")
        print(f"  Consolidated highly concentrated: {new_highly_concentrated}/{len(scope_hhi_consolidated)} ({new_highly_concentrated/len(scope_hhi_consolidated)*100:.1f}%)")
        
        print(f"\n📊 DOMINANT SUBCONTRACTORS:")
        print(f"  Original dominant positions: {len(original_dominant)}")
        print(f"  Consolidated dominant positions: {len(dominant_subs_consolidated)}")
        
        # Show most significant consolidated scopes
        print(f"\n📊 TOP CONSOLIDATED SCOPES BY DOLLAR VALUE:")
        top_consolidated = scope_hhi_consolidated.nlargest(10, 'ScopeTotalSub')
        for _, row in top_consolidated.iterrows():
            print(f"  {row['ScopeOfWork']}: ${row['ScopeTotalSub']:,.0f} (HHI: {row['ScopeHHI']:.0f}, {row['NumSubcontractors']} subs)")
        
        # Show AC Paving consolidation specifically
        ac_paving_data = scope_sub_agg_consolidated[scope_sub_agg_consolidated['ScopeOfWork'] == 'AC Paving & Asphalt Work (Consolidated)']
        if not ac_paving_data.empty:
            print(f"\n🚨 AC PAVING CONSOLIDATION RESULTS:")
            ac_total = ac_paving_data['ScopeTotalSub'].iloc[0]
            ac_hhi = scope_hhi_consolidated[scope_hhi_consolidated['ScopeOfWork'] == 'AC Paving & Asphalt Work (Consolidated)']['ScopeHHI'].iloc[0]
            ac_subs = len(ac_paving_data)
            print(f"  Total Value: ${ac_total:,.0f}")
            print(f"  HHI: {ac_hhi:.0f} ({classify_concentration(ac_hhi)})")
            print(f"  Number of Subcontractors: {ac_subs}")
            print(f"  Top Players:")
            for _, row in ac_paving_data.nlargest(5, 'ShareOfScope').iterrows():
                print(f"    {row['SubcontractorName']}: {row['ShareOfScope']:.1%} (${row['TotalSubAmount']:,.0f})")
        
        # Save consolidated results
        print(f"\nSaving consolidated analysis results...")
        
        import os
        output_dir = "consolidated_analysis"
        os.makedirs(output_dir, exist_ok=True)
        
        scope_sub_agg_consolidated.to_csv(f"{output_dir}/scope_subcontractor_aggregation_consolidated.csv", index=False)
        scope_hhi_consolidated.to_csv(f"{output_dir}/market_concentration_hhi_consolidated.csv", index=False)
        dominant_subs_consolidated.to_csv(f"{output_dir}/dominant_subcontractors_consolidated.csv", index=False)
        
        # Save scope mapping for transparency
        scope_mapping = subs_consolidated[['OriginalScope', 'ScopeOfWork']].drop_duplicates().sort_values('ScopeOfWork')
        scope_mapping.to_csv(f"{output_dir}/scope_consolidation_mapping.csv", index=False)
        
        print(f"  Saved consolidated results to: {output_dir}/")
        
        print("\n=== REALISTIC MARKET CONCENTRATION INSIGHTS ===")
        
        # Calculate realistic concentration stats
        unconcentrated = len(scope_hhi_consolidated[scope_hhi_consolidated['ConcentrationLevel'] == 'Unconcentrated'])
        moderate = len(scope_hhi_consolidated[scope_hhi_consolidated['ConcentrationLevel'] == 'Moderately Concentrated'])
        high = len(scope_hhi_consolidated[scope_hhi_consolidated['ConcentrationLevel'] == 'Highly Concentrated'])
        total = len(scope_hhi_consolidated)
        
        print(f"""
After consolidating artificially fragmented scopes, the REALISTIC market structure shows:

📊 MARKET CONCENTRATION BREAKDOWN:
  • Unconcentrated (Competitive): {unconcentrated}/{total} scopes ({unconcentrated/total*100:.1f}%)
  • Moderately Concentrated: {moderate}/{total} scopes ({moderate/total*100:.1f}%)  
  • Highly Concentrated: {high}/{total} scopes ({high/total*100:.1f}%)

This is a much more realistic picture than the original 99.6% highly concentrated finding,
which was skewed by artificial scope fragmentation.

🎯 REAL ISSUES TO ADDRESS:
  • Focus on the {high} genuinely highly concentrated trade areas
  • Investigate why even consolidated scopes show concentration
  • Address barriers to entry in the most valuable trade categories
        """)
        
    except Exception as e:
        print(f"Error in consolidated analysis: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    analyze_with_consolidation("2020BidData.xlsx")
