import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogOut, ArrowLeft, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DadosDemograficos {
  sexo: string;
  faixaEtaria: string;
  setor: string;
  tempoCasa: string;
}

interface Resposta {
  questaoId: string;
  pergunta: string;
  resposta: string;
  dimensao: string;
}

const IniciarQuestionario = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState<"demografico" | "questoes" | "revisao">("demografico");
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [questoes, setQuestoes] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [loadingQuestoes, setLoadingQuestoes] = useState(false);
  
  const [dadosDemograficos, setDadosDemograficos] = useState<DadosDemograficos>({
    sexo: "",
    faixaEtaria: "",
    setor: "",
    tempoCasa: ""
  });

  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [respostaAtual, setRespostaAtual] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const carregarDados = async () => {
      if (!user) return;
      
      setLoadingQuestoes(true);
      try {
        // Carregar questões
        const { data: questoesData, error: questoesError } = await supabase
          .from("questoes_cadastradas")
          .select("*")
          .order("created_at", { ascending: true });

        if (questoesError) throw questoesError;
        
        if (!questoesData || questoesData.length === 0) {
          toast.error("Nenhuma questão cadastrada ainda");
          navigate("/dashboard");
          return;
        }

        setQuestoes(questoesData);

        // Carregar áreas
        const { data: areasData, error: areasError } = await supabase
          .from("areas_cadastradas")
          .select("*")
          .order("nome_area", { ascending: true });

        if (areasError) throw areasError;
        setAreas(areasData || []);
      } catch (error: any) {
        toast.error("Erro ao carregar dados: " + error.message);
      } finally {
        setLoadingQuestoes(false);
      }
    };

    if (etapa === "questoes" && questoes.length === 0) {
      carregarDados();
    }
  }, [etapa, user, navigate, questoes.length]);

  const handleProximaEtapa = () => {
    if (etapa === "demografico") {
      if (!dadosDemograficos.sexo || !dadosDemograficos.faixaEtaria || 
          !dadosDemograficos.setor || !dadosDemograficos.tempoCasa) {
        toast.error("Por favor, preencha todos os campos");
        return;
      }
      setEtapa("questoes");
    }
  };

  const handleProximaQuestao = async () => {
    if (!respostaAtual) {
      toast.error("Por favor, selecione uma resposta");
      return;
    }

    const valorResposta = 
      respostaAtual === "Nunca" ? 1 :
      respostaAtual === "Raramente" ? 2 :
      respostaAtual === "Às vezes" ? 3 :
      respostaAtual === "Frequentemente" ? 4 : 5;

    const novaResposta: Resposta = {
      questaoId: questoes[questaoAtual].id,
      pergunta: questoes[questaoAtual].pergunta,
      resposta: respostaAtual,
      dimensao: questoes[questaoAtual].dimensao
    };

    // Salvar resposta no banco com dados demográficos
    try {
      const { error } = await (supabase as any)
        .from("respostas_questionario")
        .insert({
          id_participante: user!.id,
          id_questao: questoes[questaoAtual].id,
          resposta_texto: respostaAtual,
          valor: valorResposta,
          sentido: questoes[questaoAtual].sentido,
          dimensao: questoes[questaoAtual].dimensao,
          sexo: dadosDemograficos.sexo,
          faixa_etaria: dadosDemograficos.faixaEtaria,
          setor: dadosDemograficos.setor,
          tempo_empresa: dadosDemograficos.tempoCasa
        });

      if (error) throw error;
    } catch (error: any) {
      toast.error("Erro ao salvar resposta: " + error.message);
      return;
    }

    setRespostas([...respostas, novaResposta]);
    setRespostaAtual("");

    if (questaoAtual < questoes.length - 1) {
      setQuestaoAtual(questaoAtual + 1);
    } else {
      setEtapa("revisao");
    }
  };

  const handleVoltarQuestao = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(questaoAtual - 1);
      const respostaAnterior = respostas[respostas.length - 1];
      setRespostaAtual(respostaAnterior?.resposta || "");
      setRespostas(respostas.slice(0, -1));
    }
  };

  const handleConfirmarEnvio = () => {
    toast.success("Questionário finalizado! (Dados ainda não salvos no banco)");
    console.log("Dados Demográficos:", dadosDemograficos);
    console.log("Respostas:", respostas);
    navigate("/dashboard");
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

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {etapa === "demografico" && (
          <Card>
            <CardHeader>
              <CardTitle>Informações Demográficas</CardTitle>
              <CardDescription>
                Por favor, preencha suas informações antes de iniciar o questionário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Sexo</Label>
                <RadioGroup 
                  value={dadosDemograficos.sexo}
                  onValueChange={(value) => setDadosDemograficos({ ...dadosDemograficos, sexo: value })}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="Masculino" id="masculino" />
                    <Label htmlFor="masculino" className="cursor-pointer flex-1">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="Feminino" id="feminino" />
                    <Label htmlFor="feminino" className="cursor-pointer flex-1">Feminino</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="Outro" id="outro" />
                    <Label htmlFor="outro" className="cursor-pointer flex-1">Outro</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="Prefiro não informar" id="nao-informar" />
                    <Label htmlFor="nao-informar" className="cursor-pointer flex-1">Prefiro não informar</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Faixa Etária</Label>
                <RadioGroup 
                  value={dadosDemograficos.faixaEtaria}
                  onValueChange={(value) => setDadosDemograficos({ ...dadosDemograficos, faixaEtaria: value })}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="14-20" id="14-20" />
                    <Label htmlFor="14-20" className="cursor-pointer flex-1">14-20 anos</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="20-30" id="20-30" />
                    <Label htmlFor="20-30" className="cursor-pointer flex-1">20-30 anos</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="30-40" id="30-40" />
                    <Label htmlFor="30-40" className="cursor-pointer flex-1">30-40 anos</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="40-50" id="40-50" />
                    <Label htmlFor="40-50" className="cursor-pointer flex-1">40-50 anos</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="50-60" id="50-60" />
                    <Label htmlFor="50-60" className="cursor-pointer flex-1">50-60 anos</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="60+" id="60+" />
                    <Label htmlFor="60+" className="cursor-pointer flex-1">Mais de 60 anos</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Setor</Label>
                {areas.length > 0 ? (
                  <RadioGroup 
                    value={dadosDemograficos.setor}
                    onValueChange={(value) => setDadosDemograficos({ ...dadosDemograficos, setor: value })}
                    className="grid grid-cols-2 gap-3"
                  >
                    {areas.map((area) => (
                      <div key={area.id} className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                        <RadioGroupItem value={area.nome_area} id={area.id} />
                        <Label htmlFor={area.id} className="cursor-pointer flex-1">{area.nome_area}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma área cadastrada ainda</p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Tempo de Casa</Label>
                <RadioGroup 
                  value={dadosDemograficos.tempoCasa}
                  onValueChange={(value) => setDadosDemograficos({ ...dadosDemograficos, tempoCasa: value })}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="Menos de 1 ano" id="menos-1" />
                    <Label htmlFor="menos-1" className="cursor-pointer flex-1">Menos de 1 ano</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="1-3 anos" id="1-3" />
                    <Label htmlFor="1-3" className="cursor-pointer flex-1">1-3 anos</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="3-5 anos" id="3-5" />
                    <Label htmlFor="3-5" className="cursor-pointer flex-1">3-5 anos</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="5-10 anos" id="5-10" />
                    <Label htmlFor="5-10" className="cursor-pointer flex-1">5-10 anos</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="Mais de 10 anos" id="mais-10" />
                    <Label htmlFor="mais-10" className="cursor-pointer flex-1">Mais de 10 anos</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button onClick={handleProximaEtapa} className="w-full">
                Iniciar Questionário
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {etapa === "questoes" && questoes.length > 0 && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((questaoAtual + 1) / questoes.length) * 100}%` }}
              />
            </div>

            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {questaoAtual + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      {questoes[questaoAtual].pergunta}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Questão {questaoAtual + 1} de {questoes.length}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"].map((opcao) => (
                    <Button
                      key={opcao}
                      variant={respostaAtual === opcao ? "default" : "outline"}
                      className="w-full h-14 text-lg justify-start"
                      onClick={() => setRespostaAtual(opcao)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          respostaAtual === opcao ? 'border-primary-foreground bg-primary-foreground' : 'border-muted-foreground'
                        }`}>
                          {respostaAtual === opcao && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <span>{opcao}</span>
                      </div>
                    </Button>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  {questaoAtual > 0 && (
                    <Button variant="outline" onClick={handleVoltarQuestao}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                  )}
                  <Button onClick={handleProximaQuestao} className="ml-auto" disabled={!respostaAtual}>
                    {questaoAtual < questoes.length - 1 ? "Próxima" : "Finalizar"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {etapa === "revisao" && (
          <Card>
            <CardHeader>
              <CardTitle>Revisão das Respostas</CardTitle>
              <CardDescription>
                Revise suas respostas antes de confirmar o envio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Dados Demográficos</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Sexo:</span>{" "}
                    <span className="font-medium">{dadosDemograficos.sexo}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Faixa Etária:</span>{" "}
                    <span className="font-medium">{dadosDemograficos.faixaEtaria}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Setor:</span>{" "}
                    <span className="font-medium">{dadosDemograficos.setor}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tempo de Casa:</span>{" "}
                    <span className="font-medium">{dadosDemograficos.tempoCasa}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Respostas do Questionário</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {respostas.map((resposta, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <p className="text-sm font-medium">Questão {index + 1}</p>
                      <p className="text-sm text-muted-foreground">{resposta.pergunta}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{resposta.dimensao}</span>
                        <span className="text-sm font-semibold text-primary">{resposta.resposta}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => {
                  setEtapa("questoes");
                  setQuestaoAtual(0);
                  setRespostas([]);
                  setRespostaAtual("");
                }}>
                  Refazer Questionário
                </Button>
                <Button onClick={handleConfirmarEnvio} className="ml-auto">
                  Confirmar Envio
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default IniciarQuestionario;
