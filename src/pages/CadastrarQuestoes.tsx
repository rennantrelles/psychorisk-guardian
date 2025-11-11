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

      toast.success("Questões cadastradas com sucesso!");
      setQuestoes([]);
      setMostrarForm(false);
    } catch (error: any) {
      toast.error("Erro ao salvar questões: " + error.message);
    }
  };

  if (loading) {
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Cadastrar Questões
          </h1>
          <p className="text-muted-foreground">
            Cadastre as questões que serão aplicadas no questionário
          </p>
        </div>

        {questoes.length === 0 && !mostrarForm ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhuma questão cadastrada</CardTitle>
              <CardDescription>
                Comece adicionando questões para o questionário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setMostrarForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Iniciar cadastro das questões
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {questoes.map((questao, index) => (
              <Card key={questao.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">Questão {index + 1}</CardTitle>
                      <CardDescription className="mt-2">{questao.pergunta}</CardDescription>
                      <div className="mt-4 flex gap-4 text-sm">
                        <span className="text-muted-foreground">
                          <strong>Sentido:</strong> {questao.sentido}
                        </span>
                        <span className="text-muted-foreground">
                          <strong>Dimensão:</strong> {questao.dimensao}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoverQuestao(questao.id!)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}

            {mostrarForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Nova Questão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              {!mostrarForm && (
                <Button onClick={() => setMostrarForm(true)} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar outra questão
                </Button>
              )}
              <Button onClick={handleSalvarQuestoes} className="ml-auto">
                Salvar alterações
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CadastrarQuestoes;
