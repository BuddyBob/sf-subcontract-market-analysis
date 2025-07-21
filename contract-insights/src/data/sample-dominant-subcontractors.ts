export const sampleDominantSubcontractors = [
  {
    ScopeOfWork: "Tunneling",
    SubcontractorName: "Ward & Burke Tunneling",
    TotalSubAmount: 6187000,
    ContractsCount: 1,
    ScopeTotalSub: 6187000,
    ShareOfScope: 1.0,
    RankInScope: 1
  },
  {
    ScopeOfWork: "Coating",
    SubcontractorName: "Murphy Industrial Coatings",
    TotalSubAmount: 482000,
    ContractsCount: 1,
    ScopeTotalSub: 507350,
    ShareOfScope: 0.95,
    RankInScope: 1
  },
  {
    ScopeOfWork: "Trucking & Hauling (Consolidated)",
    SubcontractorName: "Camajani Trucking",
    TotalSubAmount: 950000,
    ContractsCount: 4,
    ScopeTotalSub: 1841000,
    ShareOfScope: 0.516,
    RankInScope: 1
  },
  {
    ScopeOfWork: "AC Paving & Asphalt Work (Consolidated)",
    SubcontractorName: "Radius Earthwork Inc",
    TotalSubAmount: 600000,
    ContractsCount: 1,
    ScopeTotalSub: 5258741,
    ShareOfScope: 0.114,
    RankInScope: 3
  },
  {
    ScopeOfWork: "Traffic Control & Sawcutting (Consolidated)",
    SubcontractorName: "CMC Traffic Control Specialists",
    TotalSubAmount: 2948000,
    ContractsCount: 2,
    ScopeTotalSub: 5142700,
    ShareOfScope: 0.573,
    RankInScope: 1
  }
];

export type DominantSubcontractorType = typeof sampleDominantSubcontractors[0];
