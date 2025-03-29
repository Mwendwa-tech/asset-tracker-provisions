
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Notification as NotificationType } from '@/types';
import { Bell, Check, Trash, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';

// Mock notifications
const mockNotifications: NotificationType[] = [
  {
    id: 'notif-1',
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'Rice is running low and needs to be restocked',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    relatedItemType: 'inventory'
  },
  {
    id: 'notif-2',
    type: 'info',
    title: 'New Request Submitted',
    message: 'John Doe has requested 5 cleaning supplies',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
    relatedItemType: 'request'
  },
  {
    id: 'notif-3',
    type: 'success',
    title: 'Request Approved',
    message: 'Your request for office supplies has been approved',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
    relatedItemType: 'request'
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationType[]>(() => {
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : mockNotifications;
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  
  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== id)
    );
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffMins < 24 * 60) {
      return `${Math.round(diffMins / 60)} hours ago`;
    } else {
      return `${Math.round(diffMins / (60 * 24))} days ago`;
    }
  };
  
  const getNotificationIcon = (type: NotificationType['type']) => {
    switch (type) {
      case 'warning':
        return <div className="h-2 w-2 rounded-full bg-yellow-500" />;
      case 'error':
        return <div className="h-2 w-2 rounded-full bg-red-500" />;
      case 'success':
        return <div className="h-2 w-2 rounded-full bg-green-500" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-blue-500" />;
    }
  };

  // Function to add a new notification (can be called from elsewhere)
  const addNotification = (notification: Omit<NotificationType, 'id' | 'date' | 'read'>) => {
    const newNotification: NotificationType = {
      ...notification,
      id: `notif-${Date.now()}`,
      date: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Here you could also trigger email/SMS notifications
    console.log('New notification:', newNotification);
    console.log('Would send email/SMS in a real implementation');
    
    // Return the notification ID
    return newNotification.id;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] text-xs bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 text-xs"
                onClick={markAllAsRead}
              >
                <Check className="h-3 w-3 mr-1" /> 
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-red-500 hover:text-red-600"
                onClick={clearAllNotifications}
              >
                <Trash className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            {notifications.map((notification) => (
              <div key={notification.id} className="relative">
                <DropdownMenuItem
                  className={`flex flex-col items-start p-3 ${
                    !notification.read ? 'bg-muted/30' : ''
                  }`}
                >
                  <div className="flex justify-between w-full">
                    <div className="flex items-center gap-2 font-medium">
                      {getNotificationIcon(notification.type)}
                      {notification.title}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(notification.date)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <div className="absolute top-1 right-1 flex gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Export a context to allow adding notifications from anywhere
export const NotificationContext = React.createContext<{
  addNotification: (notification: Omit<NotificationType, 'id' | 'date' | 'read'>) => string;
}>({
  addNotification: () => '',
});

export const useNotifications = () => React.useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Implementation to be added to App.tsx
  const [notifications, setNotifications] = useState<NotificationType[]>(() => {
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : mockNotifications;
  });
  
  const addNotification = (notification: Omit<NotificationType, 'id' | 'date' | 'read'>) => {
    const newNotification: NotificationType = {
      ...notification,
      id: `notif-${Date.now()}`,
      date: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    localStorage.setItem('notifications', JSON.stringify([newNotification, ...notifications]));
    
    // Here you could also trigger email/SMS notifications
    console.log('New notification:', newNotification);
    console.log('Would send email/SMS in a real implementation');
    
    return newNotification.id;
  };
  
  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
