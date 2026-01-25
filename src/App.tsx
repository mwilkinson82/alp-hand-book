import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import SalesPage from "./pages/SalesPage";
import PreviewExperience from "./pages/PreviewExperience";
import Handbook from "./pages/Handbook";
import Auth from "./pages/Auth";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<SalesPage />} />
            <Route path="/preview" element={<PreviewExperience />} />
            <Route path="/read" element={<Handbook />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/purchase-success" element={<PurchaseSuccess />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
