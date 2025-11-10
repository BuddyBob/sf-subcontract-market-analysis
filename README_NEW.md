# SF Construction Market Analysis: Competition & LBE Equity (2020)

**Understanding market concentration and barriers facing Local Business Enterprises in San Francisco's contracting business**

San Francisco's construction subcontracting market shows **severe concentration** with significant barriers for Local Business Enterprises (LBEs). 

While LBEs make up 60% of awarded subcontractors, they receive contracts **1.9x smaller** than non-LBE firms and are largely excluded from high-value technical work.

---

## **Key Findings (Awarded Contracts Only)**

### **Market Concentration Analysis**
| Metric | Value | Impact |
|--------|-------|---------|
| **Total Awarded Subcontracts** | **$78.2M** | Actual market size (awarded contracts only) |
| **Highly Concentrated Markets** | **65 of 66 scopes** (98.5%) | Severe concentration across almost all trades |
| **Moderately Concentrated** | **1 scope** (1.5%) | Only Engineering & Design Services |
| **Competitive Markets** | **0 scopes** (0%) | No truly competitive markets exist |
| **Perfect Monopolies** | **54 scopes** (HHI = 10,000) | Single firm controls entire scope |

### **LBE Participation & Performance**
| Metric | LBE Performance | Non-LBE Performance | Gap |
|--------|-----------------|---------------------|-----|
| **Contractors** | 87 firms (60.4%) | 57 firms (39.6%) | Good representation |
| **Dollar Share** | $34.8M (44.5%) | $43.4M (55.5%) | Underperforming relative to participation |
| **Average Contract Size** | $399,815 | $762,257 | **1.9x size gap** |
| **Market Access** | Strong in concrete, excluded from tunneling | Dominate high-value technical work | Clear segmentation |

---

## **Critical Market Insights**

### **1. Extreme Market Concentration**
- **98.5% of scopes** are highly concentrated (HHI ≥ 2,500)
- **22 monopolies** where single firms control entire scopes
- **Total market value**: Only $78.2M in actual awards (vs. $238M including losing bids)

### **2. LBE Success Areas**
- **Concrete Work**: $6.9M market, 99.1% LBE participation
- **Traffic Control**: $5.1M market, 99.9% LBE participation  
- **AC Paving**: $5.3M market, 87.1% LBE participation

### **3. LBE Exclusion Areas**
- **Tunneling**: $6.2M market, 0% LBE participation (Ward & Burke monopoly)
- **Items 35-43**: $7.0M market, 0% LBE participation (Apex Rockfall monopoly)
- **Micro Tunneling**: $5.5M market, 0% LBE participation

### **4. Market Power Concentration**
- **Top 5 Non-LBE firms control**: $30.1M (38.5% of total market)
- **Top 5 LBE firms control**: $19.7M (25.2% of total market)
- **Largest contracts**: Technical/specialized work dominated by non-LBE firms

---

## **Data Methodology**

**CRITICAL**: Analysis includes **ONLY awarded contracts** (168 records out of 503 total bids).
- **Excluded**: 335 losing bid records (66.6% of original data)
- **Impact**: Previous estimates were inflated by 3x
- **Verified**: All data files sum to exactly $78,232,534

---

## **Interactive Dashboard**

The `contract-insights/` folder contains a Next.js dashboard with:

### **Features**
- **Market Concentration Analysis**: HHI-based competition assessment
- **LBE Equity Review**: Participation rates and performance gaps
- **Dominant Firms Analysis**: Companies with ≥25% market share
- **Search & Filtering**: Find specific firms or scopes
- **Real-time Data**: Loads from corrected CSV files

### **Pages**
1. **Overview**: Key metrics and market summary
2. **Concentration**: Scope-by-scope competition analysis
3. **LBE Equity**: Participation rates and performance comparison
4. **Dominant Firms**: Market leaders with LBE status indicators
5. **Downloads**: Data access and documentation

### **Running the Dashboard**
```bash
cd contract-insights
npm install
npm run dev
# Open http://localhost:3000
```

---

## **Data Files**

### **Dashboard Data** (`contract-insights/public/data/`)
| File | Records | Purpose |
|------|---------|---------|
| `firm_analysis.csv` | 95 contractors | Individual firm performance & LBE status |
| `market_concentration_hhi_consolidated.csv` | 66 scopes | HHI scores and concentration levels |
| `scope_subcontractor_aggregation_consolidated.csv` | 113 records | Detailed market positions by firm & scope |
| `lbe_scope_analysis_consolidated.csv` | 66 scopes | LBE participation rates by scope |
| `dominant_subcontractors_consolidated.csv` | 94 firms | Companies with ≥5% market share |

### **Analysis Scripts**
| File | Purpose |
|------|---------|
| `lbe_analysis.py` | Main analysis script (awarded contracts only) |
| `consolidate_lbe_data.py` | Scope consolidation for dashboard |
| `enhanced_analysis.py` | Market concentration calculations |

---

## **Key Policy Implications**

### **1. Market Structure**
- **Extreme concentration** suggests potential for price manipulation
- **Technical barriers** prevent LBE entry into high-value work
- **Scope consolidation** needed to create meaningful competition

### **2. LBE Program Effectiveness**
- **Good participation** in traditional trades (concrete, paving)
- **Complete exclusion** from technical specialties
- **Contract size gap** limits LBE growth opportunities

### **3. Strategic Recommendations**
- **Target technical capacity building** for LBEs
- **Investigate dominant firm practices** in monopolized scopes
- **Consider scope bundling** to increase competition
- **Address equipment/certification barriers** in specialized work

---

**Analysis Date**: July 2025  
**Data Source**: SF 2020 Bid Data (awarded contracts only)  
**Total Market**: $78,232,534 in subcontract awards
