-- SCRIPT FORÇA BRUTA - Execute no SQL Editor do Supabase Dashboard
-- Este script vai forçar a criação correta do tipo e estruturas

-- 1. REMOVER TUDO E RECRIAR (força bruta)
-- Remove tipo se existir (CASCADE remove tudo que depende dele)
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Remove trigger se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remove função se existir
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.has_role(UUID, app_role);

-- 2. CRIAR TIPO app_role
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 3. VERIFICAR SE FOI CRIADO
SELECT 'Tipo app_role criado:' as status, 
       EXISTS(SELECT 1 FROM pg_type WHERE typname = 'app_role') as created;

-- 4. CRIAR OU ALTERAR TABELA PROFILES
-- Se a tabela já existir, vamos alterar a coluna role
DO $$ 
BEGIN
    -- Se a tabela não existir, criar
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        CREATE TABLE public.profiles (
          id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT NOT NULL,
          full_name TEXT,
          role app_role NOT NULL DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Tabela profiles criada';
    ELSE
        -- Se a tabela existir, vamos garantir que a coluna role tem o tipo correto
        -- Primeiro, remove a coluna role se existir
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role' AND table_schema = 'public') THEN
            ALTER TABLE public.profiles DROP COLUMN role;
        END IF;
        
        -- Adiciona a coluna role com o tipo correto
        ALTER TABLE public.profiles ADD COLUMN role app_role NOT NULL DEFAULT 'user';
        RAISE NOTICE 'Coluna role recriada na tabela profiles';
    END IF;
END $$;

-- 5. CRIAR POLÍTICAS RLS
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view all profiles" 
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 6. CRIAR FUNÇÃO has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 7. CRIAR FUNÇÃO handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    'user'::public.app_role
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
  
  RETURN NEW;
END;
$$;

-- 8. CRIAR TRIGGER
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. VERIFICAÇÃO FINAL
SELECT 'VERIFICAÇÃO FINAL:' as final_check;

SELECT 'Tipo app_role existe:' as check1, 
       EXISTS(SELECT 1 FROM pg_type WHERE typname = 'app_role') as result;

SELECT 'Tabela profiles existe:' as check2,
       EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') as result;

SELECT 'Coluna role existe com tipo correto:' as check3,
       EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role' AND udt_name = 'app_role') as result;

SELECT 'Função handle_new_user existe:' as check4,
       EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'handle_new_user' AND routine_schema = 'public') as result;

SELECT 'Trigger existe:' as check5,
       EXISTS(SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') as result;
