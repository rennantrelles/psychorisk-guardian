import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogOut, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";

interface Area {
  id: string;
  nome_area: string;
  organizacao: string;
  cadastrado_por_nome: string;
  created_at: string;
}

const CadastrarAreas = () => {
  const { user, signOut, loading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [nomeArea, setNomeArea] = useState("");
  const [areas, setAreas] = useState<Area[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    carregarAreas();
  }, [user]);

  const carregarAreas = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("areas_cadastradas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAreas(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar áreas: " + error.message);
    } finally {
      setLoadingAreas(false);
    }
  };

  const handleSalvar = async () => {
    if (!nomeArea.trim()) {
      toast.error("Por favor, digite o nome da área");
      return;
    }

    if (!user) return;

    setSalvando(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization, full_name")
        .eq("id", user.id)
        .single();

      const { error } = await supabase
        .from("areas_cadastradas")
        .insert({
          nome_area: nomeArea.trim(),
          organizacao: profile?.organization || "",
          cadastrado_por: user.id,
          cadastrado_por_nome: profile?.full_name || user.email || "Usuário",
        });

      if (error) throw error;

      toast.success("Área cadastrada com sucesso!");
      setNomeArea("");
      carregarAreas();
    } catch (error: any) {
      toast.error("Erro ao cadastrar área: " + error.message);
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = async (id: string) => {
    try {
      const { error } = await supabase
        .from("areas_cadastradas")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Área excluída com sucesso!");
      carregarAreas();
    } catch (error: any) {
      toast.error("Erro ao excluir área: " + error.message);
    }
  };

  if (loading || roleLoading || loadingAreas) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Cadastrar Áreas
          </h1>
          <p className="text-muted-foreground">
            Cadastre as áreas que aparecerão no questionário para os participantes
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Nova Área</CardTitle>
              <CardDescription>
                Adicione uma nova área/setor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeArea">Nome da Área</Label>
                  <Input
                    id="nomeArea"
                    placeholder="Ex: Recursos Humanos, TI, Financeiro..."
                    value={nomeArea}
                    onChange={(e) => setNomeArea(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSalvar()}
                  />
                </div>
                <Button 
                  onClick={handleSalvar}
                  disabled={salvando}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {salvando ? "Salvando..." : "Adicionar Área"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Áreas Cadastradas</CardTitle>
              <CardDescription>
                {areas.length} área(s) cadastrada(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {areas.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma área cadastrada ainda
                </p>
              ) : (
                <div className="space-y-3">
                  {areas.map((area) => (
                    <div
                      key={area.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-foreground">{area.nome_area}</p>
                        <p className="text-sm text-muted-foreground">
                          Cadastrado por: {area.cadastrado_por_nome}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExcluir(area.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CadastrarAreas;
