import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function TeacherHome(_props: any) {
  return <Home teacherOnly />;
}

function EvidenceHome(_props: any) {
  return <Home teacherOnly evidenceOnly />;
}

function PublicHome(_props: any) {
  return <Home />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={PublicHome} />
      <Route path="/guru" component={TeacherHome} />
      <Route path="/guru/bukti" component={EvidenceHome} />
      <Route path="/dashboard" component={PublicHome} />
      <Route path="/izin" component={PublicHome} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
