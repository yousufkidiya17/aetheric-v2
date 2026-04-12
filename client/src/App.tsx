import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import BecomeWorker from "./pages/BecomeWorker";
import SplashScreen from "./components/SplashScreen";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/become-worker"} component={BecomeWorker} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          {showSplash && (
            <SplashScreen onComplete={() => setShowSplash(false)} />
          )}
          {/* Dashboard hidden behind splash, rendered but invisible until splash fades */}
          <div className={showSplash ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
