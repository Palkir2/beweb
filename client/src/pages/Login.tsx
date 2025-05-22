import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { login } = useAuth();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync(formData);
      toast({
        title: "Anmeldung erfolgreich",
        description: "Sie sind jetzt eingeloggt.",
      });
    } catch (error) {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: "Ungültiger Benutzername oder Passwort. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-primary-dark mb-2">Bewerbungsportal</h1>
          <p className="text-gray-500 text-sm">Bitte melden Sie sich an, um fortzufahren</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Benutzername
            </Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Passwort
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={login.isPending}
            >
              {login.isPending ? "Anmeldung..." : "Anmelden"}
            </Button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Oder weiter mit</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div>
              <button type="button" 
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => window.location.href = "/api/google-auth"} 
                disabled>
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545, 10.239v3.821h5.445c-0.712, 2.315-2.647, 3.972-5.445, 3.972-3.332, 0-6.033-2.701-6.033-6.032s2.701-6.032, 6.033-6.032c1.498, 0, 2.866, 0.549, 3.921, 1.453l2.814-2.814C17.503, 2.988, 15.139, 2, 12.545, 2 7.021, 2, 2.543, 6.477, 2.543, 12s4.478, 10, 10.002, 10c8.396, 0, 10.249-7.85, 9.426-11.748l-9.426-0.013z"></path>
                </svg>
                Google
              </button>
            </div>
            
            <div>
              <button type="button" 
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => window.location.href = "/api/discord-auth"}
                disabled>
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317, 4.3698a19.7913, 19.7913, 0, 0, 0-4.8851-1.5152.0741.0741, 0, 0, 0-.0785.0371c-.211.3753-.4447.8648-.6083, 1.2495-1.8447-.2762-3.68-.2762-5.4868, 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077, 0, 0, 0-.0785-.037,19.7363, 19.7363, 0, 0, 0-4.8852, 1.515.0699.0699, 0, 0, 0-.0321.0277C.5334, 9.0458-.319, 13.5799.0992, 18.0578a.0824.0824, 0, 0, 0, .0312.0561c2.0528, 1.5076, 4.0413, 2.4228, 5.9929, 3.0294a.0777.0777, 0, 0, 0, .0842-.0276c.4616-.6304.8731-1.2952, 1.226-1.9942a.076.076, 0, 0, 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077, 0, 0, 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743, 0, 0, 1, .0776-.0105c3.9278, 1.7933, 8.18, 1.7933, 12.0614, 0a.0739.0739, 0, 0, 1, .0785.0095c.1202.099.246.1981.375.2924a.077.077, 0, 0, 1-.0066.1276 12.2986, 12.2986, 0, 0, 1-1.873.8914.0742.0742, 0, 0, 0-.0407.1067c.3604.698.7719, 1.3628, 1.225, 1.9932a.076.076, 0, 0, 0, .0842.0286c1.961-.6067, 3.9495-1.5219, 6.0023-3.0294a.077.077, 0, 0, 0, .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061, 0, 0, 0-.0312-.0286zM8.02, 15.3312c-1.1825, 0-2.1569-1.0857-2.1569-2.419, 0-1.3332.9555-2.4189, 2.157-2.4189, 1.2108, 0, 2.1757, 1.0952, 2.1568, 2.419, 0, 1.3332-.9555, 2.4189-2.1569, 2.4189zm7.9748, 0c-1.1825, 0-2.1569-1.0857-2.1569-2.419, 0-1.3332.9554-2.4189, 2.1569-2.4189, 1.2108, 0, 2.1757, 1.0952, 2.1568, 2.419, 0, 1.3332-.946, 2.4189-2.1568, 2.4189Z"></path>
                </svg>
                Discord
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
