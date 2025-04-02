
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
  value: number | string;  // Changed to allow both number and string values
  detail: string;
  color?: string;
  secondary?: string | number; // Added to fix TypeScript errors
  status?: string; // Added to fix TypeScript errors
}

export interface ReportContextType {
  title: string;
  description: string;
  valueLabel: string;
  colorMapping?: Record<string, string>;
  dataFormatting?: (value: number) => string;
}
