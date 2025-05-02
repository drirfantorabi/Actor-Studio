import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import TheaterRehearsalApp from "./pages/TheaterRehearsalApp";

function Router() {
  return (
    <Switch>
      <Route path="/" component={TheaterRehearsalApp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
