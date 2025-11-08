import { Button } from "@/components/ui/button";
import { Shield, Users, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Metodologia HSE-IT Internacional</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Gestão de Riscos
              <span className="block text-primary mt-2">Psicossociais</span>
              nas Organizações
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Solução inovadora para análise e gerenciamento de riscos psicossociais, baseada na NR-01 e 
              na metodologia internacional HSE-IT. Promova ambientes de trabalho mais saudáveis e produtivos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <a href="/auth">Começar Agora</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#metodologia">Saiba Mais</a>
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Users className="w-5 h-5" />
                  <span className="text-2xl font-bold">7</span>
                </div>
                <p className="text-sm text-muted-foreground">Dimensões Avaliadas</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-accent">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-2xl font-bold">Real-time</span>
                </div>
                <p className="text-sm text-muted-foreground">Análise de Dados</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Shield className="w-5 h-5" />
                  <span className="text-2xl font-bold">NR-01</span>
                </div>
                <p className="text-sm text-muted-foreground">Compliance Legal</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-3xl blur-3xl"></div>
            <img 
              src={heroImage} 
              alt="Ambiente corporativo saudável" 
              className="relative rounded-3xl shadow-strong w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
