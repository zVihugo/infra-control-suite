-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    'user'::app_role
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create computadores table
CREATE TABLE public.computadores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  patrimonio TEXT NOT NULL UNIQUE,
  mac_address TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  responsavel TEXT NOT NULL,
  setor TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ativo',
  marca TEXT,
  processador TEXT,
  memoria TEXT,
  armazenamento TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on computadores
ALTER TABLE public.computadores ENABLE ROW LEVEL SECURITY;

-- Create policies for computadores
CREATE POLICY "Anyone can view computadores" 
ON public.computadores 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admins can insert computadores" 
ON public.computadores 
FOR INSERT 
TO authenticated 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update computadores" 
ON public.computadores 
FOR UPDATE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete computadores" 
ON public.computadores 
FOR DELETE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

-- Create celulares table
CREATE TABLE public.celulares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  marca TEXT NOT NULL,
  numero TEXT NOT NULL,
  imei TEXT NOT NULL UNIQUE,
  responsavel TEXT NOT NULL,
  setor TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ativo',
  operadora TEXT,
  plano TEXT,
  patrimonio TEXT,
  data_aquisicao TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on celulares
ALTER TABLE public.celulares ENABLE ROW LEVEL SECURITY;

-- Create policies for celulares
CREATE POLICY "Anyone can view celulares" 
ON public.celulares 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admins can insert celulares" 
ON public.celulares 
FOR INSERT 
TO authenticated 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update celulares" 
ON public.celulares 
FOR UPDATE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete celulares" 
ON public.celulares 
FOR DELETE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

-- Create switches table
CREATE TABLE public.switches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  marca TEXT NOT NULL,
  numero_portas TEXT NOT NULL,
  mac_address TEXT NOT NULL UNIQUE,
  localizacao TEXT NOT NULL,
  ip_acesso TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ativo',
  patrimonio TEXT,
  versao_firmware TEXT,
  velocidade TEXT,
  protocolo TEXT,
  data_instalacao TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on switches
ALTER TABLE public.switches ENABLE ROW LEVEL SECURITY;

-- Create policies for switches
CREATE POLICY "Anyone can view switches" 
ON public.switches 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admins can insert switches" 
ON public.switches 
FOR INSERT 
TO authenticated 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update switches" 
ON public.switches 
FOR UPDATE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete switches" 
ON public.switches 
FOR DELETE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

-- Create access_points table
CREATE TABLE public.access_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  marca TEXT NOT NULL,
  mac_address TEXT NOT NULL UNIQUE,
  localizacao TEXT NOT NULL,
  ssid TEXT NOT NULL,
  ip_acesso TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ativo',
  patrimonio TEXT,
  banda TEXT,
  padrao TEXT,
  canal TEXT,
  potencia TEXT,
  data_instalacao TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on access_points
ALTER TABLE public.access_points ENABLE ROW LEVEL SECURITY;

-- Create policies for access_points
CREATE POLICY "Anyone can view access_points" 
ON public.access_points 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admins can insert access_points" 
ON public.access_points 
FOR INSERT 
TO authenticated 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update access_points" 
ON public.access_points 
FOR UPDATE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete access_points" 
ON public.access_points 
FOR DELETE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

-- Create coletores table
CREATE TABLE public.coletores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  marca TEXT NOT NULL,
  serie TEXT NOT NULL UNIQUE,
  responsavel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ativo',
  localizacao TEXT NOT NULL,
  patrimonio TEXT,
  tipo TEXT,
  conectividade TEXT,
  sistema_operacional TEXT,
  versao_software TEXT,
  data_aquisicao TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on coletores
ALTER TABLE public.coletores ENABLE ROW LEVEL SECURITY;

-- Create policies for coletores
CREATE POLICY "Anyone can view coletores" 
ON public.coletores 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admins can insert coletores" 
ON public.coletores 
FOR INSERT 
TO authenticated 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update coletores" 
ON public.coletores 
FOR UPDATE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete coletores" 
ON public.coletores 
FOR DELETE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_computadores_updated_at
  BEFORE UPDATE ON public.computadores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_celulares_updated_at
  BEFORE UPDATE ON public.celulares
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_switches_updated_at
  BEFORE UPDATE ON public.switches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_access_points_updated_at
  BEFORE UPDATE ON public.access_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coletores_updated_at
  BEFORE UPDATE ON public.coletores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();