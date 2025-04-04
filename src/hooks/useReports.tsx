
import { useState, useEffect, useCallback } from 'react';
import { 
  getRecentReports, 
  getReportTypes, 
  getReportContext,
  generateMockReportData
} from '@/components/reports/ReportUtils';
import { RecentReport, ReportData } from '@/types/reports';
import { generateId } from '@/utils/formatters';
import { toast } from 'sonner';

// Use localStorage key constants
const STORAGE_KEYS = {
  RECENT_REPORTS: 'hostel-recent-reports',
  SCHEDULED_REPORTS: 'hostel-scheduled-reports'
};

// Helper to safely serialize reports for localStorage (removing non-serializable icon property)
const serializeReports = (reports: RecentReport[]) => {
  return reports.map(report => {
    // Exclude the icon property as it's a React element
    const { icon, ...serializableReport } = report;
    return serializableReport;
  });
};

interface ScheduledReport {
  id: string;
  reportType: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextRun: Date;
}

export function useReports() {
  // Initialize state with data from localStorage or mock data using lazy initialization
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
  
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULED_REPORTS);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading scheduled reports:', error);
      return [];
    }
  });
  
  const [loading, setLoading] = useState(false);

  // Memoized function to prevent unnecessary re-renders
  const saveRecentReports = useCallback((reports: RecentReport[]) => {
    try {
      const serializableReports = serializeReports(reports);
      localStorage.setItem(STORAGE_KEYS.RECENT_REPORTS, JSON.stringify(serializableReports));
    } catch (error) {
      console.error('Error saving recent reports:', error);
    }
  }, []);

  // Memoized function to save scheduled reports
  const saveScheduledReports = useCallback((reports: ScheduledReport[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULED_REPORTS, JSON.stringify(reports));
    } catch (error) {
      console.error('Error saving scheduled reports:', error);
    }
  }, []);

  // Optimized effect with debounce to prevent excessive writes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveRecentReports(recentReports);
    }, 300); // Debounce by 300ms
    
    return () => clearTimeout(timeoutId);
  }, [recentReports, saveRecentReports]);
  
  // Optimized effect for scheduled reports
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveScheduledReports(scheduledReports);
    }, 300); // Debounce by 300ms
    
    return () => clearTimeout(timeoutId);
  }, [scheduledReports, saveScheduledReports]);

  // Generate report data - enhanced for professional reports with optimized performance
  const generateReport = useCallback((reportType: string, title: string) => {
    setLoading(true);
    
    try {
      // Generate report data based on type using mock data (or real API in production)
      const data = generateMockReportData(reportType);
      const reportId = generateId();
      
      // Add summary statistics for professional reports
      const enhancedData = addReportSummary(data, reportType);
      
      // Add to recent reports with optimistic update
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
      
      // Optimistic update for faster UI response
      setRecentReports(prev => [newReport, ...prev.slice(0, 4)]);
      
      // Simulate API call delay (this would be a real API call in production)
      setTimeout(() => {
        setLoading(false);
        // In production, this would update with real API data if needed
      }, 300); // Reduced from 800ms to 300ms for better responsiveness
      
      return { data: enhancedData, reportId };
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
      setLoading(false);
      return { data: [], reportId: '' };
    }
  }, []);
  
  // Schedule a report for automatic generation - optimized
  const scheduleReport = useCallback((reportId: string) => {
    const reportType = getReportTypes().find(r => r.id === reportId);
    if (!reportType) return false;
    
    // Check if this report is already scheduled
    const isAlreadyScheduled = scheduledReports.some(r => r.reportType === reportId);
    
    if (!isAlreadyScheduled) {
      const newScheduledReport: ScheduledReport = {
        id: generateId(),
        reportType: reportId,
        title: reportType.title,
        frequency: 'weekly',
        nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next week
      };
      
      // Optimistic update for immediate UI feedback
      setScheduledReports(prev => [...prev, newScheduledReport]);
      return true;
    }
    
    return false;
  }, [scheduledReports]);
  
  // Add professional summary to reports - optimized with memoization
  const addReportSummary = useCallback((data: ReportData[], reportType: string): ReportData[] => {
    // Add a summary entry based on report type
    if (data.length > 0) {
      switch (reportType) {
        case 'inventory-status':
          const totalItems = data.reduce((sum, item) => {
            const itemValue = typeof item.value === 'number' ? item.value : 0;
            return sum + itemValue;
          }, 0);
          
          const averageValue = data.reduce((sum, item) => {
            const secondaryValue = item.secondary && typeof item.secondary === 'number' ? item.secondary : 0;
            return sum + secondaryValue;
          }, 0) / data.length;
          
          return [
            {
              name: "Summary",
              value: "Summary",
              detail: `Total Items: ${totalItems}, Average Value: $${averageValue.toFixed(2)}`,
              status: "summary",
              color: "#4C51BF"
            },
            ...data
          ];
          
        case 'asset-usage':
        case 'asset-utilization': // Added alias for consistency
          const checkedOutAssets = data.filter(item => item.status === 'checked-out').length;
          const percentCheckedOut = (checkedOutAssets / data.length * 100).toFixed(1);
          
          return [
            {
              name: "Summary",
              value: "Summary",
              detail: `Usage Rate: ${percentCheckedOut}%, ${checkedOutAssets} of ${data.length} assets in use`,
              status: "summary",
              color: "#4C51BF"
            },
            ...data
          ];
          
        case 'request-analytics':
          const pendingRequests = data.filter(item => item.status === 'pending').length;
          const approvedRequests = data.filter(item => item.status === 'approved').length;
          
          return [
            {
              name: "Summary",
              value: "Summary",
              detail: `${pendingRequests} pending requests, ${approvedRequests} approved requests`,
              status: "summary",
              color: "#4C51BF"
            },
            ...data
          ];
          
        default:
          return data;
      }
    }
    return data;
  }, []);

  return {
    recentReports,
    scheduledReports,
    loading,
    reportTypes: getReportTypes(),
    generateReport,
    scheduleReport
  };
}
