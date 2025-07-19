"""
LBE Competition Analysis - Understanding Barriers and Opportunities
Analyzes Local Business Enterprise (LBE) participation patterns to identify 
how to better help LBE firms compete against dominant subcontractors.
"""

import pandas as pd
import numpy as np
import re
from typing import Dict, List, Tuple


def analyze_lbe_competition(file_path: str):
    """
    Comprehensive analysis of LBE participation and competitiveness.
    """
    print("=== LBE COMPETITION ANALYSIS ===\n")
    
    # Load and clean data
    df = pd.read_excel(file_path, sheet_name='Contract Info')
    
    # Clean monetary columns
    def clean_currency(value):
        if pd.isna(value):
            return np.nan
        if isinstance(value, (int, float)):
            return float(value)
        str_val = str(value).strip()
        cleaned = re.sub(r'[$,()%]', '', str_val)
        if str_val.startswith('(') and str_val.endswith(')'):
            cleaned = '-' + cleaned
        try:
            return float(cleaned) if cleaned else np.nan
        except (ValueError, TypeError):
            return np.nan
    
    # Clean monetary columns
    for col in ['Contract Award Amount (Awarded)', 'SUB $$ ', 'Engineers Estimate']:
        if col in df.columns:
            df[col] = df[col].apply(clean_currency)
    
    # Create role flags
    df['is_prime'] = df['Sub/Prime'].str.contains('Prime', case=False, na=False)
    df['is_sub'] = df['Sub/Prime'].str.contains('Sub', case=False, na=False)
    
    # Clean LBE status
    df['is_lbe'] = df['LBE? '].str.contains('Y', case=False, na=False)
    df['lbe_requirement'] = pd.to_numeric(df['LBE Requirement'], errors='coerce')
    
    # Analyze LBE participation by role
    print("1. LBE PARTICIPATION BY ROLE")
    print("=" * 40)
    
    role_analysis = df.groupby(['Sub/Prime', 'is_lbe']).size().unstack(fill_value=0)
    role_totals = df.groupby('Sub/Prime').size()
    
    print("LBE Participation Rates by Role:")
    for role in role_analysis.index:
        if role == role:  # Skip NaN
            lbe_count = role_analysis.loc[role, True] if True in role_analysis.columns else 0
            total_count = role_totals[role]
            lbe_rate = lbe_count / total_count * 100
            print(f"  {role}: {lbe_count}/{total_count} ({lbe_rate:.1f}%)")
    
    # Analyze LBE success in subcontracting
    print(f"\n2. LBE SUBCONTRACTOR ANALYSIS")
    print("=" * 40)
    
    # Get subcontractor data
    subs = df[(df['is_sub'] == True) & (df['SUB $$ '] > 0) & (df['SUB $$ '].notna())].copy()
    
    lbe_subs = subs[subs['is_lbe'] == True]
    non_lbe_subs = subs[subs['is_lbe'] == False]
    
    print(f"LBE Subcontractors: {len(lbe_subs)} ({len(lbe_subs)/len(subs)*100:.1f}%)")
    print(f"Non-LBE Subcontractors: {len(non_lbe_subs)} ({len(non_lbe_subs)/len(subs)*100:.1f}%)")
    
    lbe_sub_dollars = lbe_subs['SUB $$ '].sum()
    total_sub_dollars = subs['SUB $$ '].sum()
    
    print(f"LBE Share of Subcontract Dollars: ${lbe_sub_dollars:,.0f} ({lbe_sub_dollars/total_sub_dollars*100:.1f}%)")
    print(f"Total Subcontract Dollars: ${total_sub_dollars:,.0f}")
    
    # Average contract sizes
    avg_lbe_contract = lbe_subs['SUB $$ '].mean()
    avg_non_lbe_contract = non_lbe_subs['SUB $$ '].mean()
    
    print(f"Average LBE Contract Size: ${avg_lbe_contract:,.0f}")
    print(f"Average Non-LBE Contract Size: ${avg_non_lbe_contract:,.0f}")
    print(f"Size Gap: {avg_non_lbe_contract/avg_lbe_contract:.1f}x larger for non-LBE")
    
    # Analyze by scope
    print(f"\n3. LBE PARTICIPATION BY SCOPE")
    print("=" * 40)
    
    scope_analysis = subs.groupby('Scope of Work').agg({
        'is_lbe': ['sum', 'count', 'mean'],
        'SUB $$ ': ['sum']
    }).round(3)
    
    scope_analysis.columns = ['LBE_Count', 'Total_Subs', 'LBE_Rate', 'Total_Dollars']
    scope_analysis['LBE_Dollar_Share'] = 0.0
    
    # Calculate LBE dollar share by scope
    for scope in scope_analysis.index:
        scope_subs = subs[subs['Scope of Work'] == scope]
        lbe_dollars = scope_subs[scope_subs['is_lbe'] == True]['SUB $$ '].sum()
        total_dollars = scope_subs['SUB $$ '].sum()
        if total_dollars > 0:
            scope_analysis.loc[scope, 'LBE_Dollar_Share'] = lbe_dollars / total_dollars
    
    # Sort by total dollars descending
    scope_analysis = scope_analysis.sort_values('Total_Dollars', ascending=False)
    
    print("Top 10 Scopes by Dollar Value - LBE Performance:")
    print("Scope | Total $ | LBE Rate | LBE $ Share")
    print("-" * 60)
    for scope, row in scope_analysis.head(10).iterrows():
        print(f"{scope[:30]:<30} | ${row['Total_Dollars']:>8,.0f} | {row['LBE_Rate']:>6.1%} | {row['LBE_Dollar_Share']:>8.1%}")
    
    # Identify LBE opportunities
    print(f"\n4. LBE OPPORTUNITY ANALYSIS")
    print("=" * 40)
    
    # High-value scopes with low LBE participation
    low_lbe_high_value = scope_analysis[
        (scope_analysis['Total_Dollars'] > 500000) & 
        (scope_analysis['LBE_Rate'] < 0.3) &
        (scope_analysis['Total_Subs'] > 1)
    ].head(10)
    
    print("High-Value Scopes with Low LBE Participation (Opportunities):")
    print("Scope | Total $ | LBE Rate | Current Competitors")
    print("-" * 70)
    for scope, row in low_lbe_high_value.iterrows():
        print(f"{scope[:35]:<35} | ${row['Total_Dollars']:>8,.0f} | {row['LBE_Rate']:>6.1%} | {row['Total_Subs']:>8.0f}")
    
    # Analyze against dominant firms
    print(f"\n5. LBE vs DOMINANT FIRMS ANALYSIS")
    print("=" * 40)
    
    # Identify dominant non-LBE firms
    firm_analysis = subs.groupby('Contractor Name').agg({
        'SUB $$ ': 'sum',
        'is_lbe': 'first',
        'Scope of Work': 'nunique'
    }).sort_values('SUB $$ ', ascending=False)
    
    firm_analysis.columns = ['Total_Dollars', 'Is_LBE', 'Scope_Count']
    
    top_non_lbe = firm_analysis[firm_analysis['Is_LBE'] == False].head(10)
    top_lbe = firm_analysis[firm_analysis['Is_LBE'] == True].head(10)
    
    print("Top 10 Non-LBE Subcontractors:")
    for firm, row in top_non_lbe.iterrows():
        print(f"  {firm}: ${row['Total_Dollars']:,.0f} across {row['Scope_Count']} scopes")
    
    print(f"\nTop 10 LBE Subcontractors:")
    for firm, row in top_lbe.iterrows():
        print(f"  {firm}: ${row['Total_Dollars']:,.0f} across {row['Scope_Count']} scopes")
    
    # Scope overlap analysis
    print(f"\n6. COMPETITIVE SCOPE ANALYSIS")
    print("=" * 40)
    
    # Find scopes where LBE and non-LBE compete directly
    competitive_scopes = []
    for scope in subs['Scope of Work'].unique():
        scope_data = subs[subs['Scope of Work'] == scope]
        has_lbe = (scope_data['is_lbe'] == True).any()
        has_non_lbe = (scope_data['is_lbe'] == False).any()
        total_value = scope_data['SUB $$ '].sum()
        
        if has_lbe and has_non_lbe and total_value > 100000:
            lbe_share = scope_data[scope_data['is_lbe'] == True]['SUB $$ '].sum() / total_value
            competitive_scopes.append({
                'Scope': scope,
                'Total_Value': total_value,
                'LBE_Share': lbe_share,
                'LBE_Count': (scope_data['is_lbe'] == True).sum(),
                'NonLBE_Count': (scope_data['is_lbe'] == False).sum()
            })
    
    competitive_df = pd.DataFrame(competitive_scopes).sort_values('Total_Value', ascending=False)
    
    print(f"Scopes with Direct LBE vs Non-LBE Competition (Value > $100K):")
    print("Scope | Value | LBE Share | LBE Firms | Non-LBE Firms")
    print("-" * 80)
    for _, row in competitive_df.head(15).iterrows():
        print(f"{row['Scope'][:25]:<25} | ${row['Total_Value']:>8,.0f} | {row['LBE_Share']:>7.1%} | {row['LBE_Count']:>8.0f} | {row['NonLBE_Count']:>12.0f}")
    
    # LBE Requirements vs Performance
    print(f"\n7. LBE REQUIREMENT vs PERFORMANCE")
    print("=" * 40)
    
    # Analyze contracts with LBE requirements
    contracts_with_req = df[df['lbe_requirement'] > 0].copy()
    
    req_performance = contracts_with_req.groupby('lbe_requirement').agg({
        'is_lbe': 'mean',
        'Contract Award Amount (Awarded)': 'mean'
    }).round(3)
    
    print("LBE Requirements vs Actual LBE Participation:")
    print("Requirement | Actual LBE Rate | Avg Contract Size")
    print("-" * 55)
    for req, row in req_performance.iterrows():
        print(f"{req:>10.0%} | {row['is_lbe']:>13.1%} | ${row['Contract Award Amount (Awarded)']:>14,.0f}")
    
    # Save analysis results
    print(f"\n8. SAVING LBE ANALYSIS RESULTS")
    print("=" * 40)
    
    import os
    os.makedirs('lbe_analysis', exist_ok=True)
    
    # Save detailed data
    scope_analysis.to_csv('lbe_analysis/lbe_scope_analysis.csv')
    firm_analysis.to_csv('lbe_analysis/firm_analysis.csv')
    competitive_df.to_csv('lbe_analysis/competitive_scopes.csv', index=False)
    
    # Create LBE vs Non-LBE comparison
    lbe_comparison = pd.DataFrame({
        'Metric': [
            'Number of Subcontractors',
            'Total Dollar Volume',
            'Average Contract Size',
            'Number of Scopes Served',
            'Market Share (%)'
        ],
        'LBE_Firms': [
            len(lbe_subs),
            lbe_sub_dollars,
            avg_lbe_contract,
            lbe_subs['Scope of Work'].nunique(),
            lbe_sub_dollars / total_sub_dollars * 100
        ],
        'Non_LBE_Firms': [
            len(non_lbe_subs),
            total_sub_dollars - lbe_sub_dollars,
            avg_non_lbe_contract,
            non_lbe_subs['Scope of Work'].nunique(),
            (total_sub_dollars - lbe_sub_dollars) / total_sub_dollars * 100
        ]
    })
    
    lbe_comparison.to_csv('lbe_analysis/lbe_vs_nonlbe_comparison.csv', index=False)
    
    print("Saved analysis files:")
    print("  - lbe_analysis/lbe_scope_analysis.csv")
    print("  - lbe_analysis/firm_analysis.csv") 
    print("  - lbe_analysis/competitive_scopes.csv")
    print("  - lbe_analysis/lbe_vs_nonlbe_comparison.csv")
    
    return {
        'scope_analysis': scope_analysis,
        'firm_analysis': firm_analysis,
        'competitive_scopes': competitive_df,
        'lbe_comparison': lbe_comparison
    }


if __name__ == "__main__":
    results = analyze_lbe_competition("2020BidData.xlsx")
