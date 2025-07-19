# SF Subcontract Market Concentration & Equity Analysis (2020)

Understand market dynamics of San Francisco's public construction subcontracting landscape, focusing on concentration, competition, and equity for Local Business Enterprises (LBEs).


Public construction dollars should stimulate broad participation, competitive pricing, and equitable opportunity (especially for Local Business Enterprises — LBEs). 

Raw scope labels (contracts) are often inconsistent (“AC Paving”, “AC paving”, “AC Paving & Concrete flatwork”…), artificially inflating the appearance of monopolies or hiding real concentration. 

---

## Findings

| Metric | Value |
|--------|-------|
| Total Subcontract Spend | **$237.9M** |
| Consolidated Trade Categories | **141** (from 257 raw labels) |
| Competitive Markets (HHI < 1500) | **1** (Trucking & Hauling) |
| Moderately Concentrated (1500–2499) | **5** |
| Highly Concentrated (≥ 2500) | **135** (95.7% of markets) |
| Top 6 Priority Markets Share of Spend | **≈58%** |
| Example Duopoly | AC Paving & Asphalt (86.3% two firms) |
| Example High Concentration | Electrical Work (53.3% single-firm share despite 11 competitors) |

---

## Data Artifacts

| File | Purpose |
|------|---------|
| `scope_consolidation_mapping.csv` | Mapping raw → consolidated scope names |
| `scope_subcontractor_aggregation_consolidated.csv` | Subcontractor position per scope |
| `market_concentration_hhi_consolidated.csv` | HHI (concentration score), number of subs, total spend, concentration tier |
| `dominant_subcontractors_consolidated.csv` | Subs with ≥25% share in any scope (gatekeepers) |
| `DATA_DOCUMENTATION.md` | Column definitions and further file explanations |


---

## Methodology Overview

1. **Scope Consolidation**  
   - Lowercase | regex cleanup | keyword 
   - Merge synonymous / fragmented labels into canonical trade categories.  
   - Output mapping (`scope_consolidation_mapping.csv`)

2. **Aggregation & Market Share**  
   - Figure out each firms share of WORK

3. **Concentration Metrics**  
   - **HHI = Σ(share²) × 10,000** per consolidated scope.  
   - Classify: Competitive (<1500), Moderate (1500–2499), High (≥2500).  
   - Flag dominance thresholds (≥25% share, monopolies, duopolies).



