import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogOut, PlusCircle, Settings, FileText } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const { isAdmin, role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Redirecionar participantes para tela de boas-vindas
    if (!roleLoading && !isAdmin && role === "participant") {
      navigate("/welcome");
    }
  }, [isAdmin, role, roleLoading, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const firstName = user.user_metadata?.full_name?.split(" ")[0] || "Usuário";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Olá {firstName}, bem vindo
          </h1>
          <p className="text-muted-foreground">
            Gerencie o sistema e visualize os resultados
          </p>
        </div>

        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-primary" />
                  Cadastrar Questões
                </CardTitle>
                <CardDescription>
                  Cadastre as questões que serão aplicadas no questionário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={() => navigate("/cadastrar-questoes")}
                >
                  Acessar
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Definir Parâmetros das Dimensões
                </CardTitle>
                <CardDescription>
                  Configure os parâmetros para análise das dimensões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={() => alert("Em desenvolvimento")}
                >
                  Acessar
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Visualizar Resultados
                </CardTitle>
                <CardDescription>
                  Visualize e analise os resultados dos questionários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={() => navigate("/resultados")}
                >
                  Acessar
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
