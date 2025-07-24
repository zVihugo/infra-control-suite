import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AssetCounts {
  computadores: number;
  celulares: number;
  switches: number;
  accessPoints: number;
  coletores: number;
}

export const useAssetCounts = () => {
  const [counts, setCounts] = useState<AssetCounts>({
    computadores: 0,
    celulares: 0,
    switches: 0,
    accessPoints: 0,
    coletores: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCounts = async () => {
    try {
      setIsLoading(true);
      
      const [
        { count: computadoresCount },
        { count: celularesCount },
        { count: switchesCount },
        { count: accessPointsCount },
        { count: coletoresCount }
      ] = await Promise.all([
        supabase.from('computadores').select('*', { count: 'exact', head: true }),
        supabase.from('celulares').select('*', { count: 'exact', head: true }),
        supabase.from('switches').select('*', { count: 'exact', head: true }),
        supabase.from('access_points').select('*', { count: 'exact', head: true }),
        supabase.from('coletores').select('*', { count: 'exact', head: true })
      ]);

      setCounts({
        computadores: computadoresCount || 0,
        celulares: celularesCount || 0,
        switches: switchesCount || 0,
        accessPoints: accessPointsCount || 0,
        coletores: coletoresCount || 0
      });
    } catch (error) {
      console.error('Erro ao buscar contadores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados dos ativos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return { counts, isLoading, refetch: fetchCounts };
};

export const useComputadores = () => {
  const [computadores, setComputadores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchComputadores = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('computadores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComputadores(data || []);
    } catch (error) {
      console.error('Erro ao buscar computadores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os computadores.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createComputador = async (data: any) => {
    try {
      const { error } = await supabase
        .from('computadores')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }]);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Computador cadastrado com sucesso!"
      });
      
      fetchComputadores();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar computador.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const deleteComputador = async (id: string) => {
    try {
      const { error } = await supabase
        .from('computadores')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Computador removido com sucesso!"
      });
      
      fetchComputadores();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover computador.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchComputadores();
  }, []);

  return { 
    computadores, 
    isLoading, 
    createComputador, 
    deleteComputador, 
    refetch: fetchComputadores 
  };
};