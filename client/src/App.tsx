import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import ApplicationForm from "@/pages/ApplicationForm";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Switch>
      {!user ? (
        <Route path="*" component={Login} />
      ) : (
        <>
          {user.role === "admin" ? (
            <Route path="/" component={AdminDashboard} />
          ) : (
            <Route path="/" component={ApplicationForm} />
          )}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Router />
    </TooltipProvider>
  );
}

export default App;
