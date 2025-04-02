
import { useState } from 'react';
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
import { toast } from 'sonner';

const Reports = () => {
  const { recentReports, loading, generateReport, reportTypes, scheduleReport } = useReports();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentReportType, setCurrentReportType] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [reportId, setReportId] = useState("");
  
  const handleGenerateReport = (reportType: string, title: string) => {
    setCurrentReportType(reportType);
    
    // Generate the report data
    const { data, reportId } = generateReport(reportType, title);
    
    // Set the report data
    setReportData(data);
    setReportTitle(title);
    setReportId(reportId);
    
    // Open the dialog
    setIsDialogOpen(true);
  };
  
  const handleScheduleReport = (id: string) => {
    scheduleReport(id);
    toast.success('Report scheduled successfully');
  };
  
  const handleScheduleAll = () => {
    reportTypes.forEach(report => {
      scheduleReport(report.id);
    });
    toast.success('All reports scheduled successfully');
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Reports"
          description="Generate and manage professional hotel management reports"
          actions={
            <Button variant="outline" onClick={handleScheduleAll}>
              <Calendar className="mr-2 h-4 w-4" /> Schedule All
            </Button>
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
