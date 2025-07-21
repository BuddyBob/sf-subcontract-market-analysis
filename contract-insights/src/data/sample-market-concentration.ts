export const sampleMarketConcentration = [
  {
    ScopeOfWork: "Electrical Work (Consolidated)",
    ScopeHHI: 3342,
    NumSubcontractors: 11,
    ScopeTotalSub: 35225329,
    ConcentrationLevel: "Highly Concentrated"
  },
  {
    ScopeOfWork: "Concrete Work (Consolidated)",
    ScopeHHI: 2013,
    NumSubcontractors: 17,
    ScopeTotalSub: 31040514,
    ConcentrationLevel: "Moderately Concentrated"
  },
  {
    ScopeOfWork: "Pipeline & Sewer Work (Consolidated)",
    ScopeHHI: 1541,
    NumSubcontractors: 15,
    ScopeTotalSub: 22540072,
    ConcentrationLevel: "Moderately Concentrated"
  },
  {
    ScopeOfWork: "Micro tunneling",
    ScopeHHI: 3681,
    NumSubcontractors: 3,
    ScopeTotalSub: 22171120,
    ConcentrationLevel: "Highly Concentrated"
  },
  {
    ScopeOfWork: "Traffic Control & Sawcutting (Consolidated)",
    ScopeHHI: 1771,
    NumSubcontractors: 14,
    ScopeTotalSub: 14276559,
    ConcentrationLevel: "Moderately Concentrated"
  }
];

export type MarketConcentrationType = typeof sampleMarketConcentration[0];
