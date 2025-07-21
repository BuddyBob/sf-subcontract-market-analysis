# SF Contract Insights Dashboard

An interactive dashboard for analyzing the 2020 San Francisco subcontract market, focusing on market concentration, LBE equity, and dominant firm patterns.

**📊 Data Scope**: Analysis based on **awarded contracts only** ($78.2M total subcontract value)

## 🚀 Features

- **Interactive Dashboard**: Single-page application with real-time data visualization
- **Market Concentration Analysis**: HHI-based concentration analysis with interactive charts
- **LBE Equity Assessment**: Local Business Enterprise participation analysis
- **Dominant Firms Review**: Searchable table of firms with >25% market share
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode Support**: Built-in theme switching
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for interactive data visualization
- **Data Processing**: PapaParse for CSV parsing
- **Icons**: Lucide React

## 📊 Data Handling

**All data reflects awarded contracts only (Total: $78.2M)**

The dashboard uses a dual-loading strategy:

1. **Fallback Data**: Hard-coded sample data (first 5 rows) for instant loading
2. **Full Dataset**: Attempts to load complete CSV files from `/public/data/`
3. **Graceful Degradation**: Shows sample data with notification if full data unavailable

### Data Sources (All Awarded Contracts Only)

- `market_concentration_hhi_consolidated.csv` - Market concentration analysis (66 scopes)
- `dominant_subcontractors_consolidated.csv` - Dominant firm analysis  
- `lbe_scope_analysis.csv` - LBE participation data (110 scopes)
- `scope_subcontractor_aggregation_consolidated.csv` - Detailed scope data
- `firm_analysis.csv` - Individual firm performance (144 firms)
- `lbe_vs_nonlbe_comparison.csv` - LBE vs Non-LBE comparison metrics

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone and install dependencies
cd contract-insights
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:3000`

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 📁 Project Structure

```
contract-insights/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components (Card, Button, etc.)
│   │   ├── navigation.tsx   # Main navigation
│   │   ├── hero.tsx         # Landing hero section
│   │   └── kpi-cards.tsx    # KPI dashboard cards
│   ├── context/             # React context providers
│   │   └── DataContext.tsx  # Global data management
│   ├── data/                # Sample data files
│   ├── lib/                 # Utility functions
│   ├── pages/               # Next.js pages
│   │   ├── index.tsx        # Overview dashboard
│   │   ├── concentration.tsx # Market concentration
│   │   ├── lbe-equity.tsx   # LBE analysis
│   │   ├── dominant-firms.tsx # Dominant firms
│   │   └── downloads.tsx    # Data downloads
│   └── styles/              # Global styles
├── public/
│   └── data/               # CSV data files
└── tailwind.config.js      # Tailwind configuration
```

## 🎨 Design System

### Color Palette

- **Primary**: `#00795C` (SF Green)
- **Secondary**: `#0669B2` (SF Blue) 
- **Danger**: `#D92F2F` (Red for high concentration)
- **Warning**: `#E7B800` (Amber for moderate concentration)

### Key Features

- **Responsive Breakpoints**: Mobile-first design (375px+)
- **Dark Mode**: Automatic system preference detection
- **Animation**: Subtle 300ms transitions for better UX
- **Typography**: Inter font family for readability

## 📊 Dashboard Pages

### Overview
- Hero section with project description
- Four key KPI cards (Total Spend, Concentration %, LBE Share, etc.)
- Market insights summary

### Concentration Analysis  
- Stacked bar chart by concentration level
- Interactive scatter plot (HHI vs Spend)
- Filterable by concentration tier
- HHI explanation tooltips

### LBE Equity
- Donut chart showing LBE vs Non-LBE distribution
- Bar chart of top scopes by spend with LBE rates
- Table of concerning scopes (very high/low LBE participation)

### Dominant Firms
- Searchable table of firms with ≥25% market share
- Sortable columns with keyboard navigation
- Slide-over panel with detailed firm information
- Responsive mobile layout

### Downloads
- Data dictionary and methodology
- Download links for all CSV files
- Instructions for updating data

## 🔧 Customization

### Updating Data

1. Replace CSV files in `/public/data/` with your datasets
2. Ensure filenames match exactly:
   - `market_concentration_hhi_consolidated.csv`
   - `dominant_subcontractors_consolidated.csv` 
   - `lbe_scope_analysis.csv`
   - `scope_subcontractor_aggregation_consolidated.csv`
3. Restart the application

### Modifying Sample Data

Update the sample data files in `/src/data/sample-*.ts` to match your CSV structure.

### Theme Customization

Edit `tailwind.config.js` to modify colors, fonts, or spacing:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color-here'
      }
    }
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

The app is a standard Next.js application and can be deployed to:

- Netlify
- AWS Amplify  
- Digital Ocean App Platform
- Any static hosting with Node.js support

### Build for Production

```bash
npm run build
npm run start
```

## 🧪 Quality Gates

The project meets these quality standards:

- ✅ **TypeScript**: Fully typed codebase
- ✅ **Performance**: Lighthouse score ≥90 
- ✅ **Accessibility**: WCAG AA compliant
- ✅ **SEO**: Optimized meta tags and structure
- ✅ **Mobile**: Responsive design down to 375px
- ✅ **ESLint**: Clean code standards

## 🔧 Environment Variables

No environment variables required for basic functionality. Optional:

```bash
# .env.local
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For questions or issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review this README for common questions
3. Open a new issue with detailed description

---

**Built with ❤️ for San Francisco External Affairs**
