
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";

interface ReportCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onGenerate: (id: string, title: string) => void;
  onSchedule: (id: string) => void;
  isGenerating: boolean;
  currentReportType: string;
}

export const ReportCard = ({
  id,
  title,
  description,
  icon,
  onGenerate,
  onSchedule,
  isGenerating,
  currentReportType,
}: ReportCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          {icon}
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="mt-4 text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onSchedule(id)}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Schedule
        </Button>
        <Button 
          size="sm"
          onClick={() => onGenerate(id, title)}
          disabled={isGenerating}
        >
          {isGenerating && id === currentReportType ? (
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Generate
        </Button>
      </CardFooter>
    </Card>
  );
};
