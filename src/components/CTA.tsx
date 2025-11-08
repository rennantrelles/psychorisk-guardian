import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-primary opacity-90"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Pronto para Transformar a Saúde Organizacional?
          </h2>
          <p className="text-xl opacity-90 leading-relaxed">
            Junte-se às organizações que já estão promovendo ambientes de trabalho mais saudáveis 
            e produtivos com nossa solução baseada na metodologia HSE-IT.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-medium hover:shadow-strong transition-all duration-300"
            >
              Solicitar Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              className="text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/10"
            >
              Falar com Especialista
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
