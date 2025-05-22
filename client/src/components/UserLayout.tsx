import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout.mutateAsync();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Application Portal</h1>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm">{user?.username}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-gray-200 hover:bg-primary-dark font-medium p-0"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
