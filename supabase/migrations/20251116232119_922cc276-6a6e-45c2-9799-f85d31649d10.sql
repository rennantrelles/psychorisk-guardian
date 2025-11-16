-- Criar tabela para áreas/setores cadastrados pelo admin
CREATE TABLE public.areas_cadastradas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_area TEXT NOT NULL,
  organizacao TEXT NOT NULL,
  cadastrado_por UUID NOT NULL,
  cadastrado_por_nome TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.areas_cadastradas ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Admins can insert areas"
ON public.areas_cadastradas
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update areas"
ON public.areas_cadastradas
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete areas"
ON public.areas_cadastradas
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view areas from their organization"
ON public.areas_cadastradas
FOR SELECT
USING (organizacao = (SELECT organization FROM profiles WHERE id = auth.uid()));

-- Adicionar trigger para atualizar updated_at
CREATE TRIGGER update_areas_cadastradas_updated_at
BEFORE UPDATE ON public.areas_cadastradas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Adicionar colunas demográficas na tabela de respostas
ALTER TABLE public.respostas_questionario
ADD COLUMN sexo TEXT,
ADD COLUMN faixa_etaria TEXT,
ADD COLUMN setor TEXT,
ADD COLUMN tempo_empresa TEXT;