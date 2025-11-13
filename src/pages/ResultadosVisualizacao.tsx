import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogOut, FileText, Users, Briefcase, Clock, AlertTriangle, MessageSquare, UserX, HelpCircle, Moon, PersonStanding } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

const ResultadosVisualizacao = () => {
  const { user, signOut, loading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Redirecionar não-admins
    if (!roleLoading && !isAdmin) {
      navigate("/welcome");
    }
  }, [isAdmin, roleLoading, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const firstName = user.user_metadata?.full_name?.split(" ")[0] || "Usuário";

  const tools = [
    {
      id: "hse-it",
      name: "HSE-IT",
      description: "Avalia demandas, controle, apoio, relacionamentos, papéis e mudanças organizacionais",
      icon: Shield,
      color: "from-primary to-primary-glow"
    },
    {
      id: "copsoq",
      name: "COPSOQ",
      description: "Avaliação ampla de demandas, controle, apoio e clima organizacional",
      icon: FileText,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "insat",
      name: "INSAT",
      description: "Liga condições de trabalho à saúde física e mental",
      icon: Users,
      color: "from-green-500 to-green-600"
    },
    {
      id: "jcq",
      name: "JCQ",
      description: "Mede demanda, controle e apoio (modelo Karasek)",
      icon: Briefcase,
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "wdq",
      name: "WDQ",
      description: "Analisa o desenho das tarefas e sua influência no bem-estar",
      icon: Clock,
      color: "from-orange-500 to-orange-600"
    },
    {
      id: "ew",
      name: "EW",
      description: "Mede esforço emocional exigido no trabalho",
      icon: AlertTriangle,
      color: "from-red-500 to-red-600"
    },
    {
      id: "ica",
      name: "ICA",
      description: "Avalia conflitos interpessoais em equipes",
      icon: MessageSquare,
      color: "from-pink-500 to-pink-600"
    },
    {
      id: "ji",
      name: "JI",
      description: "Mede insegurança no emprego",
      icon: UserX,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      id: "spoq",
      name: "SPOQ",
      description: "Avalia percepção de superqualificação",
      icon: HelpCircle,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      id: "wfc",
      name: "WFC",
      description: "Mede conflito entre trabalho e vida pessoal",
      icon: Moon,
      color: "from-teal-500 to-teal-600"
    },
    {
      id: "lipt",
      name: "LIPT",
      description: "Detecta assédio moral (mobbing)",
      icon: AlertTriangle,
      color: "from-rose-500 to-rose-600"
    },
    {
      id: "cvq",
      name: "CVQ",
      description: "Mede violência ou agressões de clientes/pacientes",
      icon: Shield,
      color: "from-amber-500 to-amber-600"
    },
    {
      id: "ssi",
      name: "SSI",
      description: "Avalia efeitos do trabalho em turnos (sono, fadiga, saúde, vida social)",
      icon: PersonStanding,
      color: "from-cyan-500 to-cyan-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Visualizar Resultados
          </h1>
          <p className="text-muted-foreground">
            Selecione a ferramenta para visualizar os resultados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="hero" 
                    className="w-full"
                    onClick={() => {
                      // Funcionalidade a ser implementada
                      console.log(`Visualizar resultados de ${tool.name}`);
                    }}
                  >
                    Ver Resultados
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ResultadosVisualizacao;
