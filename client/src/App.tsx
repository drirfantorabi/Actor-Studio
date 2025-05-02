import { Switch, Route, Link, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import TheaterRehearsalApp from "./pages/TheaterRehearsalApp";
import ScriptsList from "./pages/ScriptsList";
import NewScript from "./pages/NewScript";
import ScriptDetail from "./pages/ScriptDetail";
import ScriptRehearsalPage from "./pages/ScriptRehearsalPage";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Plus } from "lucide-react";

function Navigation() {
  const [location] = useLocation();
  
  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-30 w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-primary mr-8">
            Theater Rehearsal
          </Link>
          
          <div className="hidden md:flex space-x-1">
            <Button 
              asChild 
              variant={location === "/" ? "default" : "ghost"} 
              size="sm"
            >
              <Link href="/" className="gap-2">
                <Home size={16} />
                Home
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant={location === "/scripts" || location.startsWith("/scripts/") ? "default" : "ghost"} 
              size="sm"
            >
              <Link href="/scripts" className="gap-2">
                <BookOpen size={16} />
                Scripts
              </Link>
            </Button>
          </div>
        </div>
        
        <div>
          <Button 
            asChild 
            variant="outline" 
            size="sm"
          >
            <Link href="/scripts/new" className="gap-2">
              <Plus size={16} />
              New Script
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={TheaterRehearsalApp} />
      <Route path="/scripts" component={ScriptsList} />
      <Route path="/scripts/new" component={NewScript} />
      <Route path="/scripts/:id" component={ScriptDetail} />
      <Route path="/rehearse/:id" component={ScriptRehearsalPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navigation />
        <main className="flex-grow py-6">
          <Router />
        </main>
        <footer className="py-4 text-center text-muted-foreground border-t text-sm">
          <p>Theater Rehearsal Tool &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
