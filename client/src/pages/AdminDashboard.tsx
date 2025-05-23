import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { UserModal } from "@/components/UserModal";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";

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

// Neue Anwendungsschnittstelle entsprechend dem Benutzerformular
interface Application {
  id: number;
  title: string;
  fullName: string;
  email: string;
  birthDate: string | null; // ISO-Datumstring
  coverLetter: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string; // ISO-Datumstring
  userId?: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [selectedApplication, setSelectedApplication] = useState<Application | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
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
        fullName: "Max Mustermann",
        email: "max@example.com",
        title: "Bewerbung als Software-Entwickler",
        birthDate: "1990-05-15",
        coverLetter: "Sehr geehrte Damen und Herren,\n\nIch bewerbe mich für die ausgeschriebene Position als Software-Entwickler. Mit meiner 5-jährigen Erfahrung in der Webentwicklung bin ich überzeugt, einen wertvollen Beitrag zu Ihrem Team leisten zu können.\n\nMit freundlichen Grüßen,\nMax Mustermann", 
        status: "pending", 
        submittedAt: new Date().toISOString() 
      },
      { 
        id: 2, 
        userId: 3,
        fullName: "Eva Schmidt",
        email: "eva@example.com",
        title: "Bewerbung als UX Designer",
        birthDate: "1992-08-23",
        coverLetter: "Sehr geehrte Damen und Herren,\n\nMit großem Interesse bewerbe ich mich auf die Position als UX Designer in Ihrem Unternehmen. Durch meine 3-jährige Erfahrung in der Gestaltung benutzerfreundlicher Oberflächen kann ich Ihr Team optimal unterstützen.\n\nMit freundlichen Grüßen,\nEva Schmidt", 
        status: "approved", 
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 Tage zurück
      }
    ]);
    
    // Prüfe, ob es bereits gespeicherte Anwendungen im localStorage gibt
    const storedApp = localStorage.getItem('userApplication');
    if (storedApp) {
      try {
        const app = JSON.parse(storedApp);
        // Prüfen, ob die Anwendung bereits in unserer Liste ist
        if (!applications.some(a => a.id === app.id)) {
          setApplications(prev => [...prev, app]);
        }
      } catch (e) {
        console.error("Fehler beim Laden der gespeicherten Bewerbung", e);
      }
    }
  }, []);

  const handleOpenAddUserModal = () => {
    setSelectedUser(undefined);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUserModal = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleOpenDeleteModal = (user: User) => {
    // Prüfen, ob es sich um den Admin-Account handelt
    if (user.username === "Admin") {
      toast({
        title: "Operation nicht erlaubt",
        description: "Der Admin-Account kann nicht gelöscht werden.",
        variant: "destructive"
      });
      return;
    }
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsApplicationModalOpen(true);
  };

  const handleUpdateApplicationStatus = (applicationId: number, newStatus: "pending" | "approved" | "rejected") => {
    // Aktualisiere den Status der Bewerbung
    const updatedApplications = applications.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);
    
    // Falls es sich um die Bewerbung handelt, die im localStorage gespeichert ist, aktualisiere auch diese
    const storedApp = localStorage.getItem('userApplication');
    if (storedApp) {
      try {
        const app = JSON.parse(storedApp);
        if (app.id === applicationId) {
          app.status = newStatus;
          localStorage.setItem('userApplication', JSON.stringify(app));
        }
      } catch (e) {
        console.error("Fehler beim Aktualisieren der gespeicherten Bewerbung", e);
      }
    }
    
    toast({
      title: "Status aktualisiert",
      description: `Der Status der Bewerbung wurde auf "${
        newStatus === "pending" ? "In Bearbeitung" : 
        newStatus === "approved" ? "Angenommen" : 
        "Abgelehnt"
      }" gesetzt.`
    });
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
      // Prüfen, ob es sich um den Admin-Account handelt (als zusätzliche Sicherheit)
      if (selectedUser.username === "Admin") {
        toast({
          title: "Operation nicht erlaubt",
          description: "Der Admin-Account kann nicht gelöscht werden.",
          variant: "destructive"
        });
        setIsDeleteModalOpen(false);
        return;
      }
      
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
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Aktiv</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inaktiv</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">In Bearbeitung</Badge>;
      case "approved":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Angenommen</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Abgelehnt</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
    }
  };

  // Format-Funktion für Datum
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd.MM.yyyy", { locale: de });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Seitenleiste mit Tabs im Raumschiff-Design */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="futuristic-panel">
            <Tabs 
              defaultValue="users" 
              orientation="vertical" 
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full flex flex-row lg:flex-col space-tabs">
                <TabsTrigger value="users" className="flex-1 lg:justify-start text-left space-tab">
                  Benutzerverwaltung
                </TabsTrigger>
                <TabsTrigger value="applications" className="flex-1 lg:justify-start text-left space-tab">
                  Aktuelle Bewerbungen
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Hauptinhalt */}
        <div className="flex-1">
          {activeTab === "users" ? (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#48b1d9]">Benutzerverwaltung</h2>
                <Button 
                  onClick={handleOpenAddUserModal} 
                  className="futuristic-btn text-white"
                >
                  Benutzer hinzufügen
                </Button>
              </div>
              
              {/* User Table im Raumschiff-Design */}
              <div className="futuristic-panel p-4 relative overflow-hidden mb-8">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.5)] to-transparent"></div>
                <table className="space-table">
                  <thead>
                    <tr>
                      <th>Benutzername</th>
                      <th>E-Mail</th>
                      <th>Rolle</th>
                      <th>Status</th>
                      <th>Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            {user.role === "admin" ? "Administrator" : "Benutzer"}
                          </td>
                          <td>
                            {getStatusBadge(user.status)}
                          </td>
                          <td>
                            <Button 
                              variant="ghost" 
                              className="text-[#00d2ff] hover:text-[#c4f6ff] mr-3" 
                              onClick={() => handleOpenEditUserModal(user)}
                            >
                              Bearbeiten
                            </Button>
                            {user.username !== "Admin" && (
                              <Button 
                                variant="ghost" 
                                className="text-red-400 hover:text-red-300" 
                                onClick={() => handleOpenDeleteModal(user)}
                              >
                                Löschen
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">Keine Benutzer gefunden</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.3)] to-transparent"></div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Aktuelle Bewerbungen</h2>
              </div>
              
              {/* Application Table */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bewerber</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Betreff</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eingereicht am</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications && applications.length > 0 ? (
                      applications.map((application) => (
                        <tr key={application.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {application.fullName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {application.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(application.submittedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Select
                              defaultValue={application.status}
                              onValueChange={(value: "pending" | "approved" | "rejected") => 
                                handleUpdateApplicationStatus(application.id, value)
                              }
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">In Bearbeitung</SelectItem>
                                <SelectItem value="approved">Angenommen</SelectItem>
                                <SelectItem value="rejected">Abgelehnt</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button 
                              variant="ghost" 
                              className="text-primary hover:text-primary-dark"
                              onClick={() => handleViewApplication(application)}
                            >
                              Ansehen
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center">Keine Bewerbungen gefunden</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
      
      {/* Bewerbungs-Detail-Modal */}
      <Dialog open={isApplicationModalOpen} onOpenChange={setIsApplicationModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedApplication?.title}</DialogTitle>
            <DialogDescription>
              Eingereicht am {selectedApplication && formatDate(selectedApplication.submittedAt)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p>{selectedApplication.fullName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">E-Mail</h3>
                  <p>{selectedApplication.email}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Geburtsdatum</h3>
                <p>{selectedApplication.birthDate ? formatDate(selectedApplication.birthDate) : 'Nicht angegeben'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <div className="mt-1">
                  <Select
                    defaultValue={selectedApplication.status}
                    onValueChange={(value: "pending" | "approved" | "rejected") => {
                      handleUpdateApplicationStatus(selectedApplication.id, value);
                      // Status auch im Modal aktualisieren
                      setSelectedApplication({
                        ...selectedApplication,
                        status: value
                      });
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">In Bearbeitung</SelectItem>
                      <SelectItem value="approved">Angenommen</SelectItem>
                      <SelectItem value="rejected">Abgelehnt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Anschreiben</h3>
                <div className="mt-2 p-4 bg-gray-50 rounded-md whitespace-pre-line">
                  {selectedApplication.coverLetter}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Schließen</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
