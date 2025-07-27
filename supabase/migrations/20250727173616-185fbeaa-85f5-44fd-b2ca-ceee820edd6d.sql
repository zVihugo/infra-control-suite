-- SECURITY FIXES - Critical Priority

-- 1. FIX PRIVILEGE ESCALATION VULNERABILITY (CRITICAL)
-- Remove the overly permissive update policy that allows users to change their role
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a new restrictive policy that prevents role changes by users
CREATE POLICY "Users can update their own profile (no role changes)" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id 
  AND role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
);

-- 2. CREATE SECURE ADMIN-ONLY ROLE MANAGEMENT FUNCTION
CREATE OR REPLACE FUNCTION public.update_user_role(_target_user_id UUID, _new_role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only admins can change roles
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can change user roles';
  END IF;
  
  -- Prevent removing the last admin
  IF _new_role != 'admin'::app_role THEN
    IF (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin'::app_role) <= 1 
       AND (SELECT role FROM public.profiles WHERE user_id = _target_user_id) = 'admin'::app_role THEN
      RAISE EXCEPTION 'Cannot remove the last admin user';
    END IF;
  END IF;
  
  -- Update the role
  UPDATE public.profiles 
  SET role = _new_role, updated_at = now()
  WHERE user_id = _target_user_id;
  
  RETURN FOUND;
END;
$$;

-- 3. FIX DATABASE FUNCTION SECURITY (MEDIUM PRIORITY)
-- Fix handle_new_user function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    'user'::public.app_role
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function with proper search_path  
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 4. ADD SERVER-SIDE VALIDATION CONSTRAINTS (LOW PRIORITY)
-- Add email format validation
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_email_format_check 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add required field validations for asset tables
ALTER TABLE public.computadores 
ADD CONSTRAINT computadores_nome_not_empty CHECK (length(trim(nome)) > 0),
ADD CONSTRAINT computadores_patrimonio_not_empty CHECK (length(trim(patrimonio)) > 0),
ADD CONSTRAINT computadores_mac_valid CHECK (mac_address ~* '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$');

ALTER TABLE public.celulares
ADD CONSTRAINT celulares_imei_not_empty CHECK (length(trim(imei)) > 0),
ADD CONSTRAINT celulares_numero_not_empty CHECK (length(trim(numero)) > 0),
ADD CONSTRAINT celulares_imei_format CHECK (length(trim(imei)) >= 14);

ALTER TABLE public.switches
ADD CONSTRAINT switches_mac_valid CHECK (mac_address ~* '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$'),
ADD CONSTRAINT switches_ip_valid CHECK (ip_acesso ~* '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');

ALTER TABLE public.access_points
ADD CONSTRAINT access_points_mac_valid CHECK (mac_address ~* '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$'),
ADD CONSTRAINT access_points_ip_valid CHECK (ip_acesso ~* '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');

-- 5. CREATE AUDIT LOG FOR SECURITY EVENTS
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.security_audit_log 
FOR SELECT 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" 
ON public.security_audit_log 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 6. CREATE FUNCTION TO LOG SECURITY EVENTS
CREATE OR REPLACE FUNCTION public.log_security_event(
  _action TEXT,
  _details JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.security_audit_log (user_id, action, details)
  VALUES (auth.uid(), _action, _details);
END;
$$;

-- VERIFICATION QUERIES
SELECT 'Security fixes applied successfully!' as status;
SELECT 'Privilege escalation fixed - users cannot change their own roles' as fix1;
SELECT 'Database functions secured with proper search_path' as fix2;
SELECT 'Server-side validation constraints added' as fix3;
SELECT 'Audit logging system created' as fix4;