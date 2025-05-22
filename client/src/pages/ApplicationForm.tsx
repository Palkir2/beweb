import { useState } from "react";
import { UserLayout } from "@/components/UserLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    position: "",
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    cvLink: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, position: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuliere API-Anfrage
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Bewerbung eingereicht",
        description: "Ihre Bewerbung wurde erfolgreich übermittelt. Wir werden uns in Kürze bei Ihnen melden.",
      });
    }, 1500);
  };

  if (isSuccess) {
    return (
      <UserLayout>
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-green-600 mb-4">Bewerbung eingereicht!</h2>
              <p className="text-gray-700 mb-8">
                Vielen Dank für Ihre Bewerbung. Wir werden Ihre Unterlagen sorgfältig prüfen und uns in Kürze bei Ihnen melden.
              </p>
              <div className="border-t border-gray-200 pt-6">
                <Button 
                  onClick={() => setIsSuccess(false)}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Neue Bewerbung erstellen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Bewerbungsformular</CardTitle>
          <CardDescription className="text-center">
            Bitte füllen Sie alle Felder aus, um Ihre Bewerbung einzureichen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select onValueChange={handleSelectChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Stelle auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software-developer">Software-Entwickler</SelectItem>
                  <SelectItem value="ux-designer">UX Designer</SelectItem>
                  <SelectItem value="project-manager">Projektmanager</SelectItem>
                  <SelectItem value="marketing-specialist">Marketing-Spezialist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Vollständiger Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Max Mustermann"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+49 123 456789"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Anschreiben</Label>
              <Textarea
                id="coverLetter"
                name="coverLetter"
                placeholder="Bitte beschreiben Sie, warum Sie sich für diese Position interessieren..."
                value={formData.coverLetter}
                onChange={handleChange}
                className="min-h-[150px]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvLink">Link zum Lebenslauf (optional)</Label>
              <Input
                id="cvLink"
                name="cvLink"
                placeholder="https://meine-website.de/lebenslauf.pdf"
                value={formData.cvLink}
                onChange={handleChange}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Wird eingereicht..." : "Bewerbung einreichen"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-gray-500 text-center">
          Ihre Daten werden gemäß unserer Datenschutzerklärung verarbeitet
        </CardFooter>
      </Card>
    </UserLayout>
  );
}
