
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { ReportCard } from '@/components/reports/ReportCard';
import { RecentReportsList } from '@/components/reports/RecentReportsList';
import { ReportDialog } from '@/components/reports/ReportDialog';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { getReportTypes, getReportContext } from '@/components/reports/ReportUtils';
import { ReportData } from '@/types/reports';
import { useReports } from '@/hooks/useReports';

const Reports = () => {
  const { recentReports, loading, generateReport } = useReports();
  const reportTypes = getReportTypes();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentReportType, setCurrentReportType] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [reportId, setReportId] = useState("");
  
  const handleGenerateReport = (id: string, title: string) => {
    setCurrentReportType(id);
    
    // Generate the report data
    const { data, reportId } = generateReport(id, title);
    
    // Set the report data
    setReportData(data);
    setReportTitle(title);
    setReportId(reportId);
    
    // Open the dialog
    setIsDialogOpen(true);
  };
  
  const handleScheduleReport = (id: string) => {
    // This would be implemented in a real application
    console.log(`Scheduling report: ${id}`);
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Reports"
          description="Generate and schedule hostel management reports"
          actions={
            <Button variant="outline">
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
        
        <RecentReportsList reports={recentReports} onReportClick={handleGenerateReport} />
        
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
