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
      {/* Äußere Begrenzung wie im Bild */}
      <div className="relative max-w-3xl w-full p-1 flex flex-col items-center cockpit-border">
        {/* Leuchtender Rahmen oben */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.8)] to-transparent"></div>
        
        {/* Hexagonale Form für die Seitenwände */}
        <div className="absolute top-6 left-0 h-[calc(100%-12px)] w-[2px] bg-gradient-to-b from-transparent via-[rgba(0,210,255,0.4)] to-transparent"></div>
        <div className="absolute top-6 right-0 h-[calc(100%-12px)] w-[2px] bg-gradient-to-b from-transparent via-[rgba(0,210,255,0.4)] to-transparent"></div>
        
        {/* Hauptcontainer in Cockpit-Form */}
        <div className="futuristic-card py-10 px-8 w-full backdrop-blur-sm">
          <div className="futuristic-card-inner">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {/* Futuristisches Logo/Icon */}
                <div className="hexagon-shape w-16 h-16 flex items-center justify-center pulse-element">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#00d2ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 0 18" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#48b1d9] mb-1">RAUMSCHIFF-TERMINAL</h1>
              <div className="h-px bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent my-2"></div>
              <p className="text-[#48b1d9] text-sm">ZUGANGSBESTÄTIGUNG ERFORDERLICH</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="futuristic-panel p-3">
                <Label htmlFor="username" className="block text-sm font-medium text-[#00d2ff] mb-1 ml-1">
                  BESATZUNGSMITGLIED-ID
                </Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#081018] text-[#c4f6ff] border-[#00669c] hover-glow"
                  placeholder="ID eingeben"
                />
              </div>

              <div className="futuristic-panel p-3">
                <Label htmlFor="password" className="block text-sm font-medium text-[#00d2ff] mb-1 ml-1">
                  SICHERHEITSCODE
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#081018] text-[#c4f6ff] border-[#00669c] hover-glow"
                  placeholder="Code eingeben"
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full futuristic-btn pulse-element text-white font-semibold"
                >
                  ZUGANG ANFORDERN
                </Button>
              </div>
            </form>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#00669c]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-[#48b1d9] bg-[#081018]">ADMIN-ZUGANGSINFORMATIONEN</span>
                </div>
              </div>
              
              <div className="mt-4 text-center text-xs text-[#c4f6ff] p-3 border glow-border bg-[#081018] rounded-sm">
                <p>BESATZUNGSMITGLIED-ID: <span className="font-mono text-[#00d2ff]">Admin</span></p>
                <p>SICHERHEITSCODE: <span className="font-mono text-[#00d2ff]">123456</span></p>
              </div>
            </div>
            
            {/* Dekorative Elemente wie im Cockpit-Bild */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              <div className="h-1 bg-[#00d2ff]/20 relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent animate-[pulse_2s_ease-in-out_infinite]"></div>
              </div>
              <div className="h-1 bg-[#00d2ff]/20 relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent animate-[pulse_1.5s_ease-in-out_infinite]"></div>
              </div>
              <div className="h-1 bg-[#00d2ff]/20 relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent animate-[pulse_2.5s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Leuchtender Rahmen unten */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.5)] to-transparent"></div>
      </div>
    </div>
  );
}
