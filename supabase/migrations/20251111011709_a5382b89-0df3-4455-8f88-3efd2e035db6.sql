-- Create user_roles table (app_role enum already exists)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'participant',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create questoes_cadastradas table
CREATE TABLE IF NOT EXISTS public.questoes_cadastradas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizacao TEXT NOT NULL,
  cadastrado_por UUID REFERENCES auth.users(id) NOT NULL,
  cadastrado_por_nome TEXT NOT NULL,
  pergunta TEXT NOT NULL,
  sentido TEXT NOT NULL CHECK (sentido IN ('Positivo', 'Negativo')),
  dimensao TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.questoes_cadastradas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view questions from their organization" ON public.questoes_cadastradas;
DROP POLICY IF EXISTS "Admins can insert questions" ON public.questoes_cadastradas;
DROP POLICY IF EXISTS "Admins can update questions" ON public.questoes_cadastradas;
DROP POLICY IF EXISTS "Admins can delete questions" ON public.questoes_cadastradas;

-- RLS policies for questoes_cadastradas
CREATE POLICY "Users can view questions from their organization"
  ON public.questoes_cadastradas
  FOR SELECT
  USING (organizacao = (SELECT organization FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can insert questions"
  ON public.questoes_cadastradas
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update questions"
  ON public.questoes_cadastradas
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete questions"
  ON public.questoes_cadastradas
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Update handle_new_user to assign default participant role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_org TEXT;
  org_valid BOOLEAN;
BEGIN
  user_org := NEW.raw_user_meta_data->>'organization';
  
  IF user_org IS NULL OR user_org = '' THEN
    RAISE EXCEPTION 'Organização não informada';
  END IF;
  
  SELECT public.validate_and_increment_org(user_org) INTO org_valid;
  
  IF NOT org_valid THEN
    RAISE EXCEPTION 'Organização não autorizada. Entre em contato com o suporte.';
  END IF;
  
  INSERT INTO public.profiles (id, full_name, organization)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', user_org);
  
  -- Assign default participant role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'participant');
  
  RETURN NEW;
END;
$$;

-- Grant admin role to Rennan Trelles Leite
DO $$
DECLARE
  rennan_user_id UUID;
BEGIN
  SELECT id INTO rennan_user_id 
  FROM public.profiles 
  WHERE full_name = 'Rennan Trelles Leite' 
  LIMIT 1;
  
  IF rennan_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (rennan_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;