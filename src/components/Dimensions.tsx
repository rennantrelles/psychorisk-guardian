import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users2, Briefcase, Clock, MessageSquare, Target, TrendingUp } from "lucide-react";

export const Dimensions = () => {
  const dimensions = [
    {
      icon: Target,
      title: "Demandas",
      description: "Avalia a carga de trabalho, prazos e pressões relacionadas às tarefas.",
      color: "text-primary"
    },
    {
      icon: Users2,
      title: "Controle",
      description: "Mede o grau de autonomia e influência sobre o próprio trabalho.",
      color: "text-accent"
    },
    {
      icon: MessageSquare,
      title: "Apoio",
      description: "Analisa o suporte de gestores e colegas no ambiente de trabalho.",
      color: "text-primary"
    },
    {
      icon: Briefcase,
      title: "Relacionamentos",
      description: "Avalia a qualidade das interações e a gestão de conflitos.",
      color: "text-accent"
    },
    {
      icon: Brain,
      title: "Papel",
      description: "Verifica a clareza sobre responsabilidades e expectativas da função.",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "Mudança",
      description: "Examina como as mudanças organizacionais são comunicadas e gerenciadas.",
      color: "text-accent"
    },
    {
      icon: Clock,
      title: "Equilíbrio",
      description: "Avalia o balanceamento entre vida pessoal e profissional.",
      color: "text-primary"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            7 Dimensões Psicossociais
          </h2>
          <p className="text-xl text-muted-foreground">
            Avaliação abrangente dos principais fatores que impactam a saúde mental 
            e o bem-estar dos colaboradores.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dimensions.map((dimension, index) => (
            <Card key={index} className="border-border/50 shadow-subtle hover:shadow-medium transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4`}>
                  <dimension.icon className={`w-6 h-6 ${dimension.color}`} />
                </div>
                <CardTitle className="text-xl">{dimension.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{dimension.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
