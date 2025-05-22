import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { UserModal } from "@/components/UserModal";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Typdefinitionen für die lokale Speicherung
interface User {
  id: number;
  username: string;
  email: string | null;
  role: string;
  status: string;
}

interface InsertUser {
  username: string;
  password: string;
  email?: string | null;
  role?: string;
  status?: string;
}

interface Application {
  id: number;
  username: string;
  userId: number;
  content: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const { toast } = useToast();

  // Beispiel-Benutzer und -Bewerbungen laden
  useEffect(() => {
    // Beispiel-Benutzer für die Demo
    setUsers([
      { id: 1, username: "Admin", email: "admin@example.com", role: "admin", status: "active" },
      { id: 2, username: "MaxMustermann", email: "max@example.com", role: "user", status: "active" },
      { id: 3, username: "EvaSchmidt", email: "eva@example.com", role: "user", status: "active" }
    ]);

    // Beispiel-Bewerbungen für die Demo
    setApplications([
      { 
        id: 1, 
        userId: 2, 
        username: "MaxMustermann", 
        content: "Ich bewerbe mich für die Position als Web-Entwickler.", 
        status: "pending", 
        createdAt: new Date().toISOString() 
      },
      { 
        id: 2, 
        userId: 3, 
        username: "EvaSchmidt", 
        content: "Bewerbung als UX Designer mit 3 Jahren Erfahrung.", 
        status: "approved", 
        createdAt: new Date().toISOString() 
      }
    ]);
  }, []);

  // Logout-Funktion
  const handleLogout = () => {
    if (window.logout) {
      (window as any).logout();
    } else {
      localStorage.removeItem('currentUser');
      window.location.href = '/';
    }
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
    });
  };

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
      // Benutzer aktualisieren
      const updatedUsers = users.map(u => 
        u.id === userData.id ? { ...u, ...userData } as User : u
      );
      setUsers(updatedUsers);
      toast({
        title: "Erfolg",
        description: "Benutzer wurde erfolgreich aktualisiert",
      });
    } else {
      // Neuen Benutzer erstellen
      const newUser: User = {
        id: Math.max(0, ...users.map(u => u.id)) + 1,
        username: userData.username,
        email: userData.email || null,
        role: userData.role || "user",
        status: userData.status || "active"
      };
      setUsers([...users, newUser]);
      toast({
        title: "Erfolg",
        description: "Benutzer wurde erfolgreich erstellt",
      });
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      toast({
        title: "Erfolg",
        description: "Benutzer wurde erfolgreich gelöscht",
      });
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
