
import { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { ReportCard } from '@/components/reports/ReportCard';
import { RecentReportsList } from '@/components/reports/RecentReportsList';
import { ReportDialog } from '@/components/reports/ReportDialog';
import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';
import { getReportContext } from '@/components/reports/ReportUtils';
import { ReportData } from '@/types/reports';
import { useReports } from '@/hooks/useReports';
import { toast } from '@/components/ui/use-toast';

const Reports = () => {
  const { recentReports, loading, generateReport, reportTypes, scheduleReport } = useReports();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentReportType, setCurrentReportType] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [reportId, setReportId] = useState("");
  
  // Improved report generation with performance optimizations
  const handleGenerateReport = useCallback((reportType: string, title: string) => {
    setCurrentReportType(reportType);
    setReportTitle(title);
    
    // Show dialog immediately with loading state for better UX
    setIsDialogOpen(true);
    
    // Generate the report data with optimistic updates
    requestAnimationFrame(() => {
      try {
        const { data, reportId } = generateReport(reportType, title);
        
        // Update state with the generated data
        setReportData(data);
        setReportId(reportId);
      } catch (error) {
        console.error("Error generating report:", error);
        toast.error("Failed to generate report");
      }
    });
  }, [generateReport]);
  
  // Optimized schedule function with immediate feedback
  const handleScheduleReport = useCallback((id: string) => {
    try {
      const success = scheduleReport(id);
      if (success) {
        toast.success('Report scheduled successfully');
      }
      return success;
    } catch (error) {
      console.error("Error scheduling report:", error);
      toast.error("Failed to schedule report");
      return false;
    }
  }, [scheduleReport]);
  
  // Optimized batch operation
  const handleScheduleAll = useCallback(() => {
    let scheduled = 0;
    const total = reportTypes.length;
    
    reportTypes.forEach(report => {
      const success = scheduleReport(report.id);
      if (success) scheduled++;
    });
    
    toast.success(`${scheduled}/${total} reports scheduled successfully`);
  }, [reportTypes, scheduleReport]);

  // Export report to CSV function
  const handleExportToCsv = useCallback(() => {
    if (!reportData.length) return;
    
    try {
      // Get headers from the first object
      const headers = Object.keys(reportData[0]);
      
      // Create CSV rows
      const csvRows = [
        headers.join(','), // Header row
        ...reportData.map(row => 
          headers.map(header => {
            // Handle values that might contain commas by wrapping in quotes
            const value = row[header as keyof typeof row];
            const cellValue = value !== null && value !== undefined ? value : '';
            return typeof cellValue === 'string' && cellValue.includes(',') ? 
              `"${cellValue}"` : cellValue;
          }).join(',')
        )
      ];
      
      // Create blob and download
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportTitle.replace(/\s+/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Report exported successfully');
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Failed to export report");
    }
  }, [reportData, reportTitle]);

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Reports"
          description="Generate and manage professional hotel management reports"
          actions={
            <div className="flex space-x-2">
              {isDialogOpen && reportData.length > 0 && (
                <Button variant="outline" onClick={handleExportToCsv}>
                  <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
              )}
              <Button variant="outline" onClick={handleScheduleAll}>
                <Calendar className="mr-2 h-4 w-4" /> Schedule All
              </Button>
            </div>
          }
        />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {reportTypes.map((report) => (
            <ReportCard
              key={report.id}
              id={report.id}
              title={report.title}
              description={report.description}
              icon={report.icon}
              onGenerate={handleGenerateReport}
              onSchedule={handleScheduleReport}
              isGenerating={loading}
              currentReportType={currentReportType}
            />
          ))}
        </div>
        
        <RecentReportsList 
          reports={recentReports} 
          onReportClick={handleGenerateReport} 
        />
        
        <ReportDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          reportType={currentReportType}
          reportTitle={reportTitle}
          reportId={reportId}
          reportContext={getReportContext(currentReportType)}
          data={reportData}
        />
      </div>
    </MainLayout>
  );
};

export default Reports;
