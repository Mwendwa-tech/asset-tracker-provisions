
import { useState, useEffect } from 'react';
import { 
  getRecentReports, 
  getReportTypes, 
  getReportData, 
  getReportContext 
} from '@/components/reports/ReportUtils';
import { RecentReport, ReportData } from '@/types/reports';
import { generateId } from '@/utils/formatters';
import { toast } from 'sonner';

// Use localStorage key constants
const STORAGE_KEYS = {
  RECENT_REPORTS: 'hostel-recent-reports'
};

// Helper to safely serialize reports for localStorage (removing non-serializable icon property)
const serializeReports = (reports: RecentReport[]) => {
  return reports.map(report => {
    // Exclude the icon property as it's a React element
    const { icon, ...serializableReport } = report;
    return serializableReport;
  });
};

export function useReports() {
  // Initialize state with data from localStorage or mock data
  const [recentReports, setRecentReports] = useState<RecentReport[]>(() => {
    try {
      const savedReports = localStorage.getItem(STORAGE_KEYS.RECENT_REPORTS);
      if (savedReports) {
        // Deserialize and recreate reports with proper icons
        const parsedReports = JSON.parse(savedReports);
        return parsedReports.map((report: Omit<RecentReport, 'icon'>) => {
          // We don't store icons in localStorage, so we need to regenerate them
          // They will be added in the RecentReportsList component
          return {
            ...report,
            icon: null // Placeholder, will be filled by RecentReportsList
          };
        });
      }
      return getRecentReports();
    } catch (error) {
      console.error('Error loading recent reports:', error);
      return getRecentReports();
    }
  });
  
  const [loading, setLoading] = useState(false);

  // Save to localStorage whenever recent reports change
  useEffect(() => {
    try {
      // Store only serializable data (exclude React elements like icons)
      const serializableReports = serializeReports(recentReports);
      localStorage.setItem(STORAGE_KEYS.RECENT_REPORTS, JSON.stringify(serializableReports));
    } catch (error) {
      console.error('Error saving recent reports:', error);
    }
  }, [recentReports]);

  // Generate report data
  const generateReport = (reportType: string, title: string) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      setTimeout(() => {
        // Generate report data based on type
        const data = getReportData(reportType);
        const reportId = generateId();
        
        // Add to recent reports
        const newReport: RecentReport = {
          type: reportType,
          title: title,
          date: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          icon: null // Placeholder, will be filled by RecentReportsList
        };
        
        setRecentReports(prev => [newReport, ...prev.slice(0, 4)]);
        
        toast.success(`Generated: ${title}`);
        setLoading(false);
        
        return { data, reportId };
      }, 1000);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
      setLoading(false);
      return { data: [], reportId: '' };
    }
    
    // Return empty data while loading
    return { data: [], reportId: generateId() };
  };

  return {
    recentReports,
    loading,
    reportTypes: getReportTypes(),
    generateReport
  };
}
