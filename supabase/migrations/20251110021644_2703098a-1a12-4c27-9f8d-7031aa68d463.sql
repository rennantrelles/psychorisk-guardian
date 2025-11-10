-- Create authorized organizations table
CREATE TABLE public.organizacoes_autorizadas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_organizacao TEXT NOT NULL UNIQUE,
  qtd_cadastros INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.organizacoes_autorizadas ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read organizations (needed for signup validation)
CREATE POLICY "Anyone can view organizations"
ON public.organizacoes_autorizadas
FOR SELECT
USING (true);

-- Only admins can manage organizations
CREATE POLICY "Admins can manage organizations"
ON public.organizacoes_autorizadas
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Insert Gidion as the first authorized organization
INSERT INTO public.organizacoes_autorizadas (nome_organizacao) 
VALUES ('Gidion');

-- Function to validate organization and increment counter
CREATE OR REPLACE FUNCTION public.validate_and_increment_org(org_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_exists BOOLEAN;
BEGIN
  -- Check if organization exists
  SELECT EXISTS (
    SELECT 1 FROM public.organizacoes_autorizadas 
    WHERE LOWER(nome_organizacao) = LOWER(org_name)
  ) INTO org_exists;
  
  -- If exists, increment counter
  IF org_exists THEN
    UPDATE public.organizacoes_autorizadas 
    SET qtd_cadastros = qtd_cadastros + 1
    WHERE LOWER(nome_organizacao) = LOWER(org_name);
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Update handle_new_user to validate organization
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
  -- Get organization from metadata
  user_org := NEW.raw_user_meta_data->>'organization';
  
  -- Validate organization
  IF user_org IS NULL OR user_org = '' THEN
    RAISE EXCEPTION 'Organização não informada';
  END IF;
  
  -- Check if organization is authorized
  SELECT public.validate_and_increment_org(user_org) INTO org_valid;
  
  IF NOT org_valid THEN
    RAISE EXCEPTION 'Organização não autorizada';
  END IF;
  
  -- Create profile
  INSERT INTO public.profiles (id, full_name, organization)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', user_org);
  
  -- Assign default participant role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'participant');
  
  RETURN NEW;
END;
$$;