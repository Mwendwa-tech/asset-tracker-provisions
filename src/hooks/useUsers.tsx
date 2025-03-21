
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/utils/mockData';
import { generateId } from '@/utils/formatters';
import { toast } from '@/components/ui/use-toast';

export function useUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);

  // Add new user
  const addUser = (newUser: Omit<User, 'id'>) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        const userToAdd: User = {
          ...newUser,
          id: generateId()
        };
        
        setUsers(currentUsers => [...currentUsers, userToAdd]);
        
        toast({
          title: 'User added',
          description: `${userToAdd.name} has been added to your users.`,
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: 'Error',
        description: 'Failed to add user. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Update existing user
  const updateUser = (id: string, updatedData: Partial<User>) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        setUsers(currentUsers => 
          currentUsers.map(user => 
            user.id === id 
              ? { ...user, ...updatedData } 
              : user
          )
        );
        
        toast({
          title: 'User updated',
          description: 'User has been updated successfully.',
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = (id: string) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        const userToDelete = users.find(user => user.id === id);
        
        setUsers(currentUsers => currentUsers.filter(user => user.id !== id));
        
        if (userToDelete) {
          toast({
            title: 'User deleted',
            description: `${userToDelete.name} has been removed from your users.`,
          });
        }
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser
  };
}
