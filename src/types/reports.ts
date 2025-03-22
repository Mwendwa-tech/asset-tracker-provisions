
import { ReactNode } from "react";

export interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  actions: string[];
}

export interface RecentReport {
  type: string;
  title: string;
  date: string;
  icon?: ReactNode;
}

export interface ReportData {
  name: string;
  value: number;
  detail: string;
  color?: string;
}

export interface ReportContextType {
  title: string;
  description: string;
  valueLabel: string;
  colorMapping?: Record<string, string>;
}
