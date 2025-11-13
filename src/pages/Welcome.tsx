import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";
import welcomeHero from "@/assets/welcome-hero.jpg";

const Welcome = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">HSE-IT Risk</span>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${welcomeHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Content */}
      <main className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Welcome Message */}
          <h1 className="text-5xl md:text-7xl font-bold text-primary animate-fade-in leading-tight">
            Mostre-nos como você se sente
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Sua voz importa. Responda ao questionário e ajude a construir um ambiente de trabalho melhor para todos.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button 
              size="lg" 
              className="min-w-[200px] text-lg h-14"
              onClick={() => navigate("/iniciar-questionario")}
            >
              Iniciar Questionário
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="min-w-[200px] text-lg h-14"
              onClick={() => {
                toast.info("Funcionalidade 'Saiba Mais' será implementada em breve");
              }}
            >
              <Info className="w-5 h-5 mr-2" />
              Saiba Mais
            </Button>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-background/60 backdrop-blur-sm border border-border rounded-lg p-6 space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Confidencial</h3>
              <p className="text-sm text-muted-foreground">
                Suas respostas são totalmente confidenciais e anônimas
              </p>
            </div>

            <div className="bg-background/60 backdrop-blur-sm border border-border rounded-lg p-6 space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Simples</h3>
              <p className="text-sm text-muted-foreground">
                Perguntas diretas e fáceis de responder
              </p>
            </div>

            <div className="bg-background/60 backdrop-blur-sm border border-border rounded-lg p-6 space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Rápido</h3>
              <p className="text-sm text-muted-foreground">
                Aproximadamente 15 minutos para concluir
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
