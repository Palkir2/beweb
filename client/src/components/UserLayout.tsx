import { Button } from "@/components/ui/button";

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  // Benutzername aus dem localStorage lesen
  const username = (() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return user.username;
      } catch (e) {
        return "Benutzer";
      }
    }
    return "Benutzer";
  })();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Bewerbungsportal</h1>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm">{username}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-gray-200 hover:bg-primary-dark font-medium p-0"
              onClick={handleLogout}
            >
              Abmelden
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
      
      <footer className="bg-white shadow-inner py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Bewerbungsportal
        </div>
      </footer>
    </div>
  );
}
