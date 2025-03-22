
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/hooks/use-toast';
import { useInventory } from '@/hooks/useInventory';
import { useAssets } from '@/hooks/useAssets';
import { ReportCard } from '@/components/reports/ReportCard';
import { RecentReportsList } from '@/components/reports/RecentReportsList';
import { ReportDialog } from '@/components/reports/ReportDialog';
import { 
  getReportTypes, 
  getRecentReports, 
  getReportContext, 
  getReportData,
  getReportColor
} from '@/components/reports/ReportUtils';

const Reports = () => {
  const { toast } = useToast();
  const { items = [] } = useInventory();
  const { assets = [] } = useAssets();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [currentReportType, setCurrentReportType] = useState('');
  
  const reportTypes = getReportTypes();
  const recentReports = getRecentReports();

  const handleGenerateReport = (reportId: string, reportTitle: string) => {
    setIsGenerating(true);
    setCurrentReportType(reportId);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setShowReportDialog(true);
      toast({
        title: "Report Generated Successfully",
        description: `${reportTitle} has been generated and is ready to view`,
        variant: "default",
      });
    }, 1000);
  };

  const handleScheduleReport = (reportId: string) => {
    toast({
      title: "Report Scheduled",
      description: "This report will be automatically generated every Monday at 9:00 AM",
      variant: "default",
    });
  };

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "Report Downloaded",
      description: "Your report has been downloaded as a PDF file",
      variant: "default",
    });
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Reports"
          description="Generate and schedule inventory and asset reports"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report, index) => (
            <ReportCard 
              key={index}
              id={report.id}
              title={report.title}
              description={report.description}
              icon={report.icon}
              onGenerate={handleGenerateReport}
              onSchedule={handleScheduleReport}
              isGenerating={isGenerating}
              currentReportType={currentReportType}
            />
          ))}
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Recent Reports</h2>
          <RecentReportsList 
            reports={recentReports}
            onDownload={handleDownloadReport}
          />
        </div>
      </div>

      <ReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        reportType={currentReportType}
        reportData={getReportData(currentReportType, items, assets)}
        reportContext={getReportContext(currentReportType)}
        onDownload={handleDownloadReport}
        reportColor={getReportColor(currentReportType)}
      />
    </MainLayout>
  );
};

export default Reports;
