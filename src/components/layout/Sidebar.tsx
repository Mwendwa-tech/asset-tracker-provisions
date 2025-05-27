
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  Briefcase, 
  FileText, 
  Users, 
  Settings, 
  ShoppingCart, 
  Menu, 
  X,
  ClipboardCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { companyInfo } from '@/config/systemConfig';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: BarChart3,
    },
    {
      title: 'Inventory',
      href: '/inventory',
      icon: Package,
    },
    {
      title: 'Assets',
      href: '/assets',
      icon: Briefcase,
    },
    {
      title: 'Requests',
      href: '/requests',
      icon: ClipboardCheck,
    },
    {
      title: 'Reports',
      href: '/reports',
      icon: FileText,
    },
    {
      title: 'Suppliers',
      href: '/suppliers',
      icon: ShoppingCart,
    },
    {
      title: 'Users',
      href: '/users',
      icon: Users,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white shadow-sm transition-all duration-300 ease-in-out dark:bg-gray-900',
        collapsed ? 'w-16' : 'w-60',
        isMobile && collapsed && '-translate-x-full'
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-3 py-4">
        {!collapsed && (
          <Link to="/" className="flex items-center">
            <h1 className="text-lg font-semibold tracking-tight">{companyInfo.name}</h1>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className={cn(
            'h-8 w-8 rounded-full',
            collapsed && !isMobile && 'ml-auto'
          )}
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </Button>
      </div>
      <nav className="flex flex-col gap-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'group flex h-10 items-center gap-2.5 rounded-md px-3 py-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800',
              location.pathname === item.href &&
                'bg-gray-100 font-medium text-primary dark:bg-gray-800'
            )}
          >
            <item.icon
              className={cn(
                'h-5 w-5 text-gray-500',
                location.pathname === item.href && 'text-primary'
              )}
            />
            {!collapsed && (
              <span
                className={cn(
                  'text-sm text-gray-600 dark:text-gray-400',
                  location.pathname === item.href && 'text-primary dark:text-primary'
                )}
              >
                {item.title}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
