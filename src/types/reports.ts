
export interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  actions: string[];
}

export interface RecentReport {
  type: string;
  title: string;
  date: string;
  icon: React.ReactNode;
}

export interface ReportData {
  name: string;
  value: number;
  detail: string;
}

export interface ReportContextType {
  title: string;
  description: string;
  valueLabel: string;
}
