import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogOut, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Questao {
  id?: string;
  pergunta: string;
  sentido: "Positivo" | "Negativo";
  dimensao: string;
}

const dimensoes = [
  "DEMANDAS DE TRABALHO",
  "CONTROLE SOBRE O TRABALHO",
  "APOIO DA CHEFIA",
  "APOIO DOS COLEGAS",
  "RELACIONAMENTOS NO TRABALHO",
  "CLAREZA DO CARGO E OBJETIVOS",
  "COMUNICAÇÃO E MUDANÇAS ORGANIZACIONAIS"
];

const CadastrarQuestoes = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [questoesCadastradas, setQuestoesCadastradas] = useState<any[]>([]);
  const [loadingQuestoes, setLoadingQuestoes] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [novaQuestao, setNovaQuestao] = useState<Questao>({
    pergunta: "",
    sentido: "Positivo",
    dimensao: dimensoes[0]
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const carregarQuestoesCadastradas = async () => {
      if (!user) return;
      
      setLoadingQuestoes(true);
      try {
        const profileData = await supabase
          .from("profiles")
          .select("organization")
          .eq("id", user.id)
          .single();

        if (profileData.error) throw profileData.error;

        const { data, error } = await supabase
          .from("questoes_cadastradas")
          .select("*")
          .eq("organizacao", profileData.data.organization)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setQuestoesCadastradas(data || []);
      } catch (error: any) {
        toast.error("Erro ao carregar questões: " + error.message);
      } finally {
        setLoadingQuestoes(false);
      }
    };

    carregarQuestoesCadastradas();
  }, [user]);

  const handleAdicionarQuestao = () => {
    if (!novaQuestao.pergunta.trim()) {
      toast.error("Por favor, preencha a pergunta");
      return;
    }

    setQuestoes([...questoes, { ...novaQuestao, id: crypto.randomUUID() }]);
    setNovaQuestao({
      pergunta: "",
      sentido: "Positivo",
      dimensao: dimensoes[0]
    });
  };

  const handleRemoverQuestao = (id: string) => {
    setQuestoes(questoes.filter(q => q.id !== id));
  };

  const handleSalvarQuestoes = async () => {
    if (questoes.length === 0) {
      toast.error("Adicione pelo menos uma questão antes de salvar");
      return;
    }

    try {
      const profile = await supabase
        .from("profiles")
        .select("organization, full_name")
        .eq("id", user?.id)
        .single();

      if (profile.error) throw profile.error;

      const questoesParaSalvar = questoes.map(q => ({
        organizacao: profile.data.organization,
        cadastrado_por: user?.id,
        cadastrado_por_nome: profile.data.full_name,
        pergunta: q.pergunta,
        sentido: q.sentido,
        dimensao: q.dimensao
      }));

      const { error } = await supabase
        .from("questoes_cadastradas")
        .insert(questoesParaSalvar);

      if (error) throw error;

      // Recarregar questões cadastradas
      const { data } = await supabase
        .from("questoes_cadastradas")
        .select("*")
        .eq("organizacao", profile.data.organization)
        .order("created_at", { ascending: false });
      
      setQuestoesCadastradas(data || []);
      setQuestoes([]);
      setMostrarForm(false);
      toast.success("Questões salvas com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao salvar questões: " + error.message);
    }
  };

  if (loading || loadingQuestoes) {
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

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Questões já cadastradas */}
        {questoesCadastradas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Questões Cadastradas</CardTitle>
              <CardDescription>
                {questoesCadastradas.length} questão(ões) cadastrada(s) para sua organização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {questoesCadastradas.map((questao, index) => (
                  <div key={questao.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-sm">Questão {index + 1}</p>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                          {questao.sentido}
                        </span>
                        <span className="px-2 py-1 bg-secondary/10 text-secondary-foreground rounded">
                          {questao.dimensao}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{questao.pergunta}</p>
                    <p className="text-xs text-muted-foreground">
                      Cadastrada por {questao.cadastrado_por_nome} em{" "}
                      {new Date(questao.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulário de cadastro */}
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Novas Questões</CardTitle>
            <CardDescription>
              Cadastre as questões que serão aplicadas no questionário da sua organização
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!mostrarForm ? (
              <Button onClick={() => setMostrarForm(true)} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Iniciar Cadastro das Questões
              </Button>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="pergunta">Pergunta a ser feita</Label>
                    <Input
                      id="pergunta"
                      placeholder="Digite a pergunta"
                      value={novaQuestao.pergunta}
                      onChange={(e) => setNovaQuestao({ ...novaQuestao, pergunta: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sentido">Sentido da questão</Label>
                    <Select
                      value={novaQuestao.sentido}
                      onValueChange={(value: "Positivo" | "Negativo") => 
                        setNovaQuestao({ ...novaQuestao, sentido: value })
                      }
                    >
                      <SelectTrigger id="sentido">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Positivo">Positivo</SelectItem>
                        <SelectItem value="Negativo">Negativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dimensao">Dimensão da questão</Label>
                    <Select
                      value={novaQuestao.dimensao}
                      onValueChange={(value) => setNovaQuestao({ ...novaQuestao, dimensao: value })}
                    >
                      <SelectTrigger id="dimensao">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dimensoes.map((dim) => (
                          <SelectItem key={dim} value={dim}>
                            {dim}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleAdicionarQuestao} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Questão
                  </Button>
                </div>

                {questoes.length > 0 && (
                  <div className="space-y-4">
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-3">Questões a serem salvas ({questoes.length})</h3>
                      <div className="space-y-2">
                        {questoes.map((q) => (
                          <div key={q.id} className="flex items-start gap-2 p-3 bg-secondary/10 rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{q.pergunta}</p>
                              <div className="flex gap-2 mt-1">
                                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                                  {q.sentido}
                                </span>
                                <span className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary-foreground rounded">
                                  {q.dimensao}
                                </span>
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemoverQuestao(q.id!)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleSalvarQuestoes} className="w-full" size="lg">
                      Salvar Todas as Questões
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CadastrarQuestoes;
