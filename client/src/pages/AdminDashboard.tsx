import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { UserModal } from "@/components/UserModal";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { User, InsertUser, Application } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const { toast } = useToast();

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: applications, isLoading: isLoadingApplications } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  const createUser = useMutation({
    mutationFn: async (user: InsertUser) => {
      const res = await apiRequest("POST", "/api/users", user);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "User has been created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create user: ${error}`,
        variant: "destructive",
      });
    },
  });

  const updateUser = useMutation({
    mutationFn: async (user: User) => {
      const res = await apiRequest("PUT", `/api/users/${user.id}`, user);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "User has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update user: ${error}`,
        variant: "destructive",
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest("DELETE", `/api/users/${userId}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "User has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete user: ${error}`,
        variant: "destructive",
      });
    },
  });

  const handleOpenAddUserModal = () => {
    setSelectedUser(undefined);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUserModal = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleOpenDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = (userData: InsertUser & { id?: number }) => {
    if (userData.id) {
      updateUser.mutate(userData as User);
    } else {
      createUser.mutate(userData);
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUser.mutate(selectedUser.id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge variant="active">Active</Badge>;
      case "inactive":
        return <Badge variant="inactive">Inactive</Badge>;
      case "pending":
        return <Badge variant="pending">Pending</Badge>;
      case "approved":
        return <Badge variant="approved">Approved</Badge>;
      default:
        return <Badge variant="inactive">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
        <Button onClick={handleOpenAddUserModal}>
          Add User
        </Button>
      </div>
      
      {/* User Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoadingUsers ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">Loading users...</td>
              </tr>
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" className="text-primary hover:text-primary-dark mr-3" onClick={() => handleOpenEditUserModal(user)}>
                      Edit
                    </Button>
                    <Button variant="ghost" className="text-red-600 hover:text-red-900" onClick={() => handleOpenDeleteModal(user)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Applications</h2>
        
        {/* Application Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingApplications ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">Loading applications...</td>
                </tr>
              ) : applications && applications.length > 0 ? (
                applications.map((application) => (
                  <tr key={application.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {application.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" className="text-primary hover:text-primary-dark">
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">No applications found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modals */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />
      
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
      />
    </AdminLayout>
  );
}
