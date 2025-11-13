-- Create respostas_questionario table
CREATE TABLE IF NOT EXISTS public.respostas_questionario (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_participante uuid NOT NULL,
  id_questao uuid NOT NULL,
  resposta_texto text NOT NULL,
  valor integer NOT NULL CHECK (valor >= 1 AND valor <= 5),
  sentido text NOT NULL,
  dimensao text NOT NULL,
  peso_invertido numeric,
  probabilidade numeric,
  risco_coluna text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.respostas_questionario ENABLE ROW LEVEL SECURITY;

-- Create policies for respostas_questionario
CREATE POLICY "Users can view their own responses"
ON public.respostas_questionario
FOR SELECT
USING (auth.uid() = id_participante);

CREATE POLICY "Users can insert their own responses"
ON public.respostas_questionario
FOR INSERT
WITH CHECK (auth.uid() = id_participante);

CREATE POLICY "Admins can view all responses"
ON public.respostas_questionario
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better query performance
CREATE INDEX idx_respostas_participante ON public.respostas_questionario(id_participante);
CREATE INDEX idx_respostas_questao ON public.respostas_questionario(id_questao);