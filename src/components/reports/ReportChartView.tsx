
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { ReportData, ReportContextType } from "@/types/reports";

interface ReportChartViewProps {
  data: ReportData[];
  reportType: string;
  reportContext: ReportContextType;
  color: string;
}

export const ReportChartView = ({
  data,
  reportType,
  reportContext,
  color
}: ReportChartViewProps) => {
  // Custom tooltip for better readability
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            {reportContext.valueLabel}: <span className="font-medium">{payload[0].value}</span>
          </p>
          <p className="text-xs text-gray-500">{payload[0].payload.detail}</p>
        </div>
      );
    }
    return null;
  };

  // Value formatter for charts
  const formatYAxisTick = (value: number | string) => {
    if (typeof value === 'string') return value;
    
    // Special formatting for days
    if (reportType === 'expiry-tracking') {
      return value === 0 ? '0' : `${value}d`;
    }
    // Special formatting for binary values (available/unavailable)
    if (reportType === 'asset-status') {
      return value === 1 ? 'Yes' : 'No'; 
    }
    // Special formatting for percentages
    if (reportType === 'asset-utilization') {
      return `${value}%`;
    }
    return value.toString();
  };

  // Filter out any data items with string values for the chart
  const chartData = data.filter(item => typeof item.value === 'number');

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData.length > 0 ? chartData : data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis 
          label={{ 
            value: reportContext.valueLabel, 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }} 
          tickFormatter={formatYAxisTick}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
};
