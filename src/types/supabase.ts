
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      inventory_items: {
        Row: {
          id: string;
          name: string;
          category: string;
          quantity: number;
          unit: string;
          min_stock_level: number;
          current_value: number;
          location: string;
          last_updated: string;
          expiry_date?: string;
          supplier_id?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          quantity: number;
          unit: string;
          min_stock_level: number;
          current_value: number;
          location: string;
          last_updated?: string;
          expiry_date?: string;
          supplier_id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          quantity?: number;
          unit?: string;
          min_stock_level?: number;
          current_value?: number;
          location?: string;
          last_updated?: string;
          expiry_date?: string;
          supplier_id?: string;
          created_at?: string;
        };
      };
      assets: {
        Row: {
          id: string;
          name: string;
          category: string;
          status: 'available' | 'checked-out' | 'maintenance' | 'retired';
          location: string;
          assigned_to?: string;
          checkout_date?: string;
          expected_return_date?: string;
          purchase_date: string;
          purchase_value: number;
          current_value: number;
          condition: 'excellent' | 'good' | 'fair' | 'poor';
          last_maintenance?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          status: 'available' | 'checked-out' | 'maintenance' | 'retired';
          location: string;
          assigned_to?: string;
          checkout_date?: string;
          expected_return_date?: string;
          purchase_date: string;
          purchase_value: number;
          current_value: number;
          condition: 'excellent' | 'good' | 'fair' | 'poor';
          last_maintenance?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          status?: 'available' | 'checked-out' | 'maintenance' | 'retired';
          location?: string;
          assigned_to?: string;
          checkout_date?: string;
          expected_return_date?: string;
          purchase_date?: string;
          purchase_value?: number;
          current_value?: number;
          condition?: 'excellent' | 'good' | 'fair' | 'poor';
          last_maintenance?: string;
          created_at?: string;
        };
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          contact_person: string;
          email: string;
          phone: string;
          address: string;
          categories: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact_person: string;
          email: string;
          phone: string;
          address: string;
          categories: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact_person?: string;
          email?: string;
          phone?: string;
          address?: string;
          categories?: string[];
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          role: 'admin' | 'manager' | 'staff';
          department: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: 'admin' | 'manager' | 'staff';
          department: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: 'admin' | 'manager' | 'staff';
          department?: string;
          email?: string;
          created_at?: string;
        };
      };
      stock_transactions: {
        Row: {
          id: string;
          item_id: string;
          item_name: string;
          type: 'received' | 'used' | 'adjusted' | 'expired';
          quantity: number;
          date: string;
          performed_by: string;
          notes?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          item_name: string;
          type: 'received' | 'used' | 'adjusted' | 'expired';
          quantity: number;
          date?: string;
          performed_by: string;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          item_name?: string;
          type?: 'received' | 'used' | 'adjusted' | 'expired';
          quantity?: number;
          date?: string;
          performed_by?: string;
          notes?: string;
          created_at?: string;
        };
      };
      checkout_history: {
        Row: {
          id: string;
          asset_id: string;
          asset_name: string;
          checked_out_by: string;
          checked_out_date: string;
          returned_date?: string;
          notes?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          asset_name: string;
          checked_out_by: string;
          checked_out_date?: string;
          returned_date?: string;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          asset_id?: string;
          asset_name?: string;
          checked_out_by?: string;
          checked_out_date?: string;
          returned_date?: string;
          notes?: string;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          type: string;
          title: string;
          date: string;
          data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          title: string;
          date?: string;
          data: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          title?: string;
          date?: string;
          data?: Json;
          created_at?: string;
        };
      };
    };
  };
}
