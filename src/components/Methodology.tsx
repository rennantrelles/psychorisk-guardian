import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Target, FileCheck } from "lucide-react";

export const Methodology = () => {
  const features = [
    {
      icon: FileCheck,
      title: "Base Legal Sólida",
      description: "Fundamentado na NR-01 e Portaria SEPRT nº 6.730/2020, garantindo conformidade total com a legislação brasileira."
    },
    {
      icon: Target,
      title: "Metodologia HSE-IT",
      description: "Utiliza o Health and Safety Executive Indicator Tool, reconhecido internacionalmente para avaliação de riscos psicossociais."
    },
    {
      icon: TrendingUp,
      title: "Escala Likert",
      description: "Questionários com escala de 5 pontos para avaliação precisa e nuançada das dimensões psicossociais."
    },
    {
      icon: CheckCircle2,
      title: "Matriz de Risco",
      description: "Cruzamento inteligente de probabilidade e severidade, gerando classificação clara dos riscos identificados."
    }
  ];

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Metodologia Comprovada
          </h2>
          <p className="text-xl text-muted-foreground">
            Nossa solução combina rigor científico, conformidade legal e tecnologia de ponta para 
            oferecer a análise mais completa de riscos psicossociais.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 shadow-subtle hover:shadow-medium transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
