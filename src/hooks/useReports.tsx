
import { useState, useEffect } from 'react';
import { RecentReport, ReportData } from '@/types/reports';
import { getRecentReports, getReportData } from '@/components/reports/ReportUtils';
import { generateId } from '@/utils/formatters';
import { toast } from '@/components/ui/use-toast';
import { useInventory } from './useInventory';
import { useAssets } from './useAssets';

// Use localStorage key constant
const STORAGE_KEY = 'hostel-recent-reports';

export function useReports() {
  const { items: inventoryItems } = useInventory();
  const { assets } = useAssets();
  
  // Initialize with localStorage data or fallback to mock data
  const [recentReports, setRecentReports] = useState<RecentReport[]>(() => {
    const savedReports = localStorage.getItem(STORAGE_KEY);
    return savedReports ? JSON.parse(savedReports) : getRecentReports();
  });
  
  const [loading, setLoading] = useState(false);

  // Save to localStorage whenever reports change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentReports));
  }, [recentReports]);

  // Generate a new report
  const generateReport = (reportType: string, reportTitle: string): { data: ReportData[], reportId: string } => {
    setLoading(true);
    
    try {
      // Generate report data using actual inventory and asset data
      const reportData = getReportData(reportType, inventoryItems, assets);
      
      // Create new report record
      const newReport: RecentReport = {
        type: reportType,
        title: reportTitle,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
      };
      
      // Add to recent reports
      setRecentReports(current => {
        const updatedReports = [newReport, ...current.slice(0, 9)]; // Keep max 10 reports
        return updatedReports;
      });
      
      setLoading(false);
      
      const reportId = generateId();
      
      toast({
        title: 'Report Generated',
        description: `${reportTitle} has been created successfully.`,
      });
      
      return { data: reportData, reportId };
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate report. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
      return { data: [], reportId: '' };
    }
  };

  return {
    recentReports,
    loading,
    generateReport
  };
}
