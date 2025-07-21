export const sampleMarketConcentration = [
  {
    ScopeOfWork: "Concrete Work (Consolidated)",
    ScopeHHI: 3069,
    NumSubcontractors: 8,
    ScopeTotalSub: 6909290.5,
    ConcentrationLevel: "Highly Concentrated"
  },
  {
    ScopeOfWork: "Tunneling",
    ScopeHHI: 10000,
    NumSubcontractors: 1,
    ScopeTotalSub: 6187000,
    ConcentrationLevel: "Highly Concentrated"
  },
  {
    ScopeOfWork: "AC Paving & Asphalt Work (Consolidated)",
    ScopeHHI: 3300,
    NumSubcontractors: 5,
    ScopeTotalSub: 5258741,
    ConcentrationLevel: "Highly Concentrated"
  },
  {
    ScopeOfWork: "Traffic Control & Sawcutting (Consolidated)",
    ScopeHHI: 3792,
    NumSubcontractors: 9,
    ScopeTotalSub: 5142700,
    ConcentrationLevel: "Highly Concentrated"
  },
  {
    ScopeOfWork: "Engineering & Design Services (Consolidated)",
    ScopeHHI: 2325,
    NumSubcontractors: 8,
    ScopeTotalSub: 4038744,
    ConcentrationLevel: "Moderately Concentrated"
  }
];

export type MarketConcentrationType = typeof sampleMarketConcentration[0];
