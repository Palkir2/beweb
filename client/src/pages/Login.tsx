import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin-Anmeldung prüfen
    if (formData.username === "Admin" && formData.password === "123456") {
      const adminUser = { username: formData.username, role: "admin" };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      window.location.href = '/';
      return;
    }
    
    // Standard-Benutzer-Anmeldung
    if (formData.password.length >= 5) {
      const regularUser = { username: formData.username, role: "user" };
      localStorage.setItem('currentUser', JSON.stringify(regularUser));
      window.location.href = '/';
      return;
    }
    
    // Fehlerfall
    toast({
      title: "Anmeldung fehlgeschlagen",
      description: "Ungültiger Benutzername oder Passwort. Bitte versuchen Sie es erneut.",
      variant: "destructive",
    });
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center p-4 interface-scanline">
      <div className="futuristic-card p-8 max-w-md w-full backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {/* Futuristisches Logo/Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center pulse-element">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 0 18" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300 mb-1">RAUMSCHIFF-TERMINAL</h1>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent my-2"></div>
          <p className="text-blue-300 text-sm">ZUGANGSBESTÄTIGUNG ERFORDERLICH</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="futuristic-panel p-1">
            <Label htmlFor="username" className="block text-sm font-medium text-blue-300 mb-1 ml-1">
              BESATZUNGSMITGLIED-ID
            </Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full bg-[#0a1628] text-blue-100 border-blue-900 hover-glow"
              placeholder="ID eingeben"
            />
          </div>

          <div className="futuristic-panel p-1">
            <Label htmlFor="password" className="block text-sm font-medium text-blue-300 mb-1 ml-1">
              SICHERHEITSCODE
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-[#0a1628] text-blue-100 border-blue-900 hover-glow"
              placeholder="Code eingeben"
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full futuristic-btn pulse-element bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
            >
              ZUGANG ANFORDERN
            </Button>
          </div>
        </form>
        
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-900"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-blue-300 bg-[#0c1a2e]">ADMIN-ZUGANGSINFORMATIONEN</span>
            </div>
          </div>
          
          <div className="mt-4 text-center text-xs text-blue-200 p-3 border border-blue-900 bg-[#0a1628] rounded-md">
            <p>BESATZUNGSMITGLIED-ID: <span className="font-mono text-cyan-300">Admin</span></p>
            <p>SICHERHEITSCODE: <span className="font-mono text-cyan-300">123456</span></p>
          </div>
        </div>
        
        {/* Dekorativer Scanner-Effekt */}
        <div className="mt-6 flex justify-center">
          <div className="w-24 h-1 bg-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[pulse_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
