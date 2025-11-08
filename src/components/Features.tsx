import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Smartphone, Lock, BarChart3, Users, Zap } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Monitor,
      title: "Multiplataforma",
      description: "Acesso via desktop e mobile com design responsivo e intuitivo."
    },
    {
      icon: Users,
      title: "Gestão de Perfis",
      description: "Sistema com 3 níveis de acesso: Participante, Admin e Visualizador."
    },
    {
      icon: Zap,
      title: "Coleta Eficiente",
      description: "Interface fluida com uma pergunta por tela para melhor experiência."
    },
    {
      icon: Lock,
      title: "Dados Seguros",
      description: "ID único para cada participante com armazenamento seguro e confidencial."
    },
    {
      icon: BarChart3,
      title: "Power BI Integrado",
      description: "Visualização de resultados em tempo real com dashboards interativos."
    },
    {
      icon: Smartphone,
      title: "Experiência Mobile",
      description: "Aplicação otimizada para preenchimento em smartphones e tablets."
    }
  ];

  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Recursos e Funcionalidades
          </h2>
          <p className="text-xl text-muted-foreground">
            Uma plataforma completa, desenvolvida para facilitar a aplicação de questionários 
            e a análise de riscos psicossociais.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 shadow-subtle hover:shadow-medium transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
