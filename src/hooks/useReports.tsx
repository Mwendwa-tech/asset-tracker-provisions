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
  
  // Save scheduled reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULED_REPORTS, JSON.stringify(scheduledReports));
    } catch (error) {
      console.error('Error saving scheduled reports:', error);
    }
  }, [scheduledReports]);

  // Generate report data - enhanced for professional reports
  const generateReport = (reportType: string, title: string) => {
    setLoading(true);
    
    try {
      // Generate report data based on type
      const data = getReportData(reportType);
      const reportId = generateId();
      
      // Add summary statistics for professional reports
      const enhancedData = addReportSummary(data, reportType);
      
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
      
      // Simulate API call delay
      setTimeout(() => {
        toast.success(`Generated: ${title}`);
        setLoading(false);
      }, 800);
      
      return { data: enhancedData, reportId };
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
      setLoading(false);
      return { data: [], reportId: '' };
    }
  };
  
  // Schedule a report for automatic generation
  const scheduleReport = (reportId: string) => {
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
      
      setScheduledReports(prev => [...prev, newScheduledReport]);
    }
    
    return true;
  };
  
  // Add professional summary to reports
  const addReportSummary = (data: ReportData[], reportType: string): ReportData[] => {
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
  };

  return {
    recentReports,
    scheduledReports,
    loading,
    reportTypes: getReportTypes(),
    generateReport,
    scheduleReport
  };
}
