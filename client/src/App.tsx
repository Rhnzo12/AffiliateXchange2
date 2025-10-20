import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import BrowseOffers from "@/pages/browse-offers";
import OfferDetail from "@/pages/offer-detail";
import CreatorDashboard from "@/pages/creator/dashboard";
import CompanyDashboard from "@/pages/company/dashboard";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Creator Routes */}
      <Route path="/browse" component={BrowseOffers} />
      <Route path="/offers/:id" component={OfferDetail} />
      <Route path="/dashboard" component={CreatorDashboard} />
      
      {/* Company Routes */}
      <Route path="/company/dashboard" component={CompanyDashboard} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
