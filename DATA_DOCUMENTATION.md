# Data Documentation - Column Definitions & File Purpose


## `scope_subcontractor_aggregation_consolidated.csv`**

**Purpose**: Shows each subcontractor's market position within consolidated trade categories

### **Column Definitions**:
- **`ScopeOfWork`**: Consolidated trade category (e.g., "AC Paving & Asphalt Work (Consolidated)")
- **`SubcontractorName`**: Name of the subcontractor company
- **`TotalSubAmount`**: Total dollar amount this subcontractor earned in this trade scope
- **`ContractsCount`**: Number of different contracts this subcontractor participated in for this scope
- **`ScopeTotalSub`**: Total dollars spent on subcontractors across all companies in this scope
- **`ShareOfScope`**: This subcontractor's market share within the scope (0.0 to 1.0)


---

## **File 2: `market_concentration_hhi_consolidated.csv`**

**Purpose**: Market concentration analysis using Herfindahl-Hirschman Index for each consolidated trade scope

Note: WE use HHI because simply counting how many competitors exist in a market does not tell the full story. HHI accounts for both the number of competitors and their relative market shares.

### **Column Definitions**:
- **`ScopeOfWork`**: Consolidated trade category
- **`ScopeHHI`**: Herfindahl-Hirschman Index score (0 to 10,000)
  - **0-1,499**: Unconcentrated (competitive market)
  - **1,500-2,499**: Moderately concentrated 
  - **2,500+**: Highly concentrated (monopolistic)
- **`NumSubcontractors`**: Number of competing subcontractor companies in this scope
- **`ScopeTotalSub`**: Total subcontractor spending in this scope
- **`ConcentrationLevel`**: Text classification of market concentration

**Use This For**: Identifying which trade areas lack competition and prioritizing regulatory focus

---

## **File 3: `dominant_subcontractors_consolidated.csv`**

**Purpose**: Lists subcontractors who control ≥25% market share in any consolidated trade scope

### **Column Definitions**:
- **`ScopeOfWork`**: Consolidated trade category where they hold dominance
- **`SubcontractorName`**: Name of the dominant subcontractor
- **`TotalSubAmount`**: Dollar value of their market position
- **`ContractsCount`**: Number of contracts they participated in
- **`ScopeTotalSub`**: Total market size for this scope
- **`ShareOfScope`**: Their market share (≥0.25 = ≥25%)
- **`RankInScope`**: Their ranking within this scope (1 = most dominant)

**Use This For**: Identifying specific companies that warrant regulatory attention due to market power

---

## **File 4: `scope_consolidation_mapping.csv`**

**Purpose**:How were scopes mapped to consolidated categories?

### **Column Definitions**:
- **`OriginalScope`**: Original scope name from the raw data
- **`ScopeOfWork`**: Consolidated scope category it was grouped into

---

## **Key Consolidation Categories**

The following major consolidations were performed:

Things are consolidated based on trade categories, not just scope names. This means multiple related scopes were grouped together to create a more meaningful market analysis.

For example AC Paving & Asphalt Work includes all asphalt-related scopes, not just those with "AC" in the name.

- **AC Paving & Asphalt Work**: Combined 14 fragmented AC/asphalt scopes
- **Concrete Work**: Combined 27 concrete-related scopes  
- **Pipeline & Sewer Work**: Combined 20 pipeline/sewer scopes
- **Traffic Control & Sawcutting**: Combined 18 traffic-related scopes
- **Electrical Work**: Combined 14 electrical scopes
- **Structural Work**: Combined 13 structural scopes
- **Engineering & Design Services**: Combined 10 engineering scopes
- **Trucking & Hauling**: Combined 8 trucking scopes

This consolidation reduced **257 artificially fragmented scopes** down to **141 meaningful trade categories**.
