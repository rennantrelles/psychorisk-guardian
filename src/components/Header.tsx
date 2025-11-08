import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">HSE-IT Risk</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#metodologia" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Metodologia
            </a>
            <a href="#dimensoes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Dimensões
            </a>
            <a href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#contato" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contato
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="/auth">Entrar</a>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <a href="/auth">Começar</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
