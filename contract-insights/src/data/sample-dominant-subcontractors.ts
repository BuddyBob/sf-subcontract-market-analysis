export const sampleDominantSubcontractors = [
  {
    ScopeOfWork: "Electrical Work (Consolidated)",
    SubcontractorName: "ABC Electrical Corp",
    TotalSubAmount: 15000000,
    ContractsCount: 5,
    ScopeTotalSub: 35225329,
    ShareOfScope: 0.426,
    RankInScope: 1
  },
  {
    ScopeOfWork: "Concrete Work (Consolidated)",
    SubcontractorName: "Premier Concrete Solutions",
    TotalSubAmount: 12500000,
    ContractsCount: 8,
    ScopeTotalSub: 31040514,
    ShareOfScope: 0.403,
    RankInScope: 1
  },
  {
    ScopeOfWork: "Pipeline & Sewer Work (Consolidated)",
    SubcontractorName: "Metro Pipeline Inc",
    TotalSubAmount: 8200000,
    ContractsCount: 6,
    ScopeTotalSub: 22540072,
    ShareOfScope: 0.364,
    RankInScope: 1
  },
  {
    ScopeOfWork: "Micro tunneling",
    SubcontractorName: "TunnelTech Systems",
    TotalSubAmount: 18500000,
    ContractsCount: 2,
    ScopeTotalSub: 22171120,
    ShareOfScope: 0.834,
    RankInScope: 1
  },
  {
    ScopeOfWork: "Traffic Control & Sawcutting (Consolidated)",
    SubcontractorName: "SafeWay Traffic Control",
    TotalSubAmount: 6100000,
    ContractsCount: 12,
    ScopeTotalSub: 14276559,
    ShareOfScope: 0.427,
    RankInScope: 1
  }
];

export type DominantSubcontractorType = typeof sampleDominantSubcontractors[0];
