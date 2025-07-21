import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, BarChart3, Users, Building } from 'lucide-react';

export default function DownloadsPage() {
  const downloadFiles = [
    {
      name: 'market_concentration_hhi_consolidated.csv',
      description: 'Market concentration analysis with HHI scores for each scope of work',
      icon: BarChart3,
      size: '12.5 KB',
      records: '143 records'
    },
    {
      name: 'dominant_subcontractors_consolidated.csv',
      description: 'Subcontractors with significant market share in their respective scopes',
      icon: Building,
      size: '18.2 KB',
      records: '162 records'
    },
    {
      name: 'lbe_scope_analysis.csv',
      description: 'Local Business Enterprise participation analysis by scope',
      icon: Users,
      size: '25.1 KB',
      records: '259 records'
    },
    {
      name: 'scope_subcontractor_aggregation_consolidated.csv',
      description: 'Detailed scope and subcontractor relationship data',
      icon: FileText,
      size: '32.4 KB',
      records: '385 records'
    }
  ];

  const handleDownload = (filename: string) => {
    // In a real implementation, this would trigger the download
    // For now, we'll just try to download from the public folder
    const link = document.createElement('a');
    link.href = `/data/${filename}`;
    link.download = filename;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Data Downloads
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Download the complete datasets used in this analysis
        </p>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>How to Use This Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                The datasets below contain the complete analysis data for the 2020 San Francisco subcontract market. 
                Each file is in CSV format and can be opened in Excel, Google Sheets, or any data analysis tool.
              </p>
              
              <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-warning-600 dark:text-warning-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-warning-800 dark:text-warning-200">
                      Note for Full Deployment
                    </h3>
                    <p className="mt-1 text-sm text-warning-700 dark:text-warning-300">
                      To replace the sample data with full datasets, copy your CSV files to the <code className="bg-warning-100 dark:bg-warning-800 px-1 rounded">public/data/</code> directory 
                      and ensure the filenames match exactly. The dashboard will automatically load the full data on next visit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Data Sources</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• San Francisco Public Works contracts (2020)</li>
                    <li>• LBE certification records</li>
                    <li>• Subcontractor award data</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Analysis Methods</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Herfindahl-Hirschman Index (HHI)</li>
                    <li>• Market share calculations</li>
                    <li>• Scope consolidation mapping</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {downloadFiles.map((file, index) => {
          const Icon = file.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{file.name}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>{file.records}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {file.description}
                </p>
                <button
                  onClick={() => handleDownload(file.name)}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Data Dictionary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Market Concentration Fields</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Field</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Description</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-1">
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-3 font-mono text-xs bg-gray-50 dark:bg-gray-800 rounded">ScopeOfWork</td>
                        <td className="py-2 px-3 text-gray-600 dark:text-gray-300">Consolidated scope of work category</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-3 font-mono text-xs bg-gray-50 dark:bg-gray-800 rounded">ScopeHHI</td>
                        <td className="py-2 px-3 text-gray-600 dark:text-gray-300">Herfindahl-Hirschman Index score</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-3 font-mono text-xs bg-gray-50 dark:bg-gray-800 rounded">ConcentrationLevel</td>
                        <td className="py-2 px-3 text-gray-600 dark:text-gray-300">High/Moderate/Unconcentrated classification</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">LBE Analysis Fields</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Field</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Description</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-1">
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-3 font-mono text-xs bg-gray-50 dark:bg-gray-800 rounded">LBE_Count</td>
                        <td className="py-2 px-3 text-gray-600 dark:text-gray-300">Number of LBE firms in scope</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-3 font-mono text-xs bg-gray-50 dark:bg-gray-800 rounded">LBE_Dollar_Share</td>
                        <td className="py-2 px-3 text-gray-600 dark:text-gray-300">Percentage of scope dollars awarded to LBEs</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-3 font-mono text-xs bg-gray-50 dark:bg-gray-800 rounded">LBE_Rate</td>
                        <td className="py-2 px-3 text-gray-600 dark:text-gray-300">Percentage of subcontractors that are LBEs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
