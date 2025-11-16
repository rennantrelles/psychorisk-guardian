import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import CadastrarQuestoes from "./pages/CadastrarQuestoes";
import CadastrarAreas from "./pages/CadastrarAreas";
import IniciarQuestionario from "./pages/IniciarQuestionario";
import ResultadosVisualizacao from "./pages/ResultadosVisualizacao";
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
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/cadastrar-questoes" element={<CadastrarQuestoes />} />
            <Route path="/cadastrar-areas" element={<CadastrarAreas />} />
            <Route path="/iniciar-questionario" element={<IniciarQuestionario />} />
            <Route path="/resultados" element={<ResultadosVisualizacao />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
