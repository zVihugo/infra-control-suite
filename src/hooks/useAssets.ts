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

  const updateComputador = async (id: string, data: any) => {
    try {
      const { error } = await supabase
        .from('computadores')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Computador atualizado com sucesso!"
      });
      
      fetchComputadores();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar computador.",
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
    updateComputador,
    deleteComputador, 
    refetch: fetchComputadores 
  };
};

export const useCelulares = () => {
  const [celulares, setCelulares] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCelulares = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('celulares')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCelulares(data || []);
    } catch (error) {
      console.error('Erro ao buscar celulares:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os celulares.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCelular = async (data: any) => {
    try {
      // Mapear os campos do formulário para os campos da tabela
      const celularData = {
        marca: data.marca,
        numero: data.numero,
        imei: data.imei,
        responsavel: data.responsavel,
        setor: data.setor,
        status: data.status,
        operadora: data.operadora || null,
        plano: data.plano || null,
        patrimonio: data.patrimonio || null,
        data_aquisicao: data.dataAquisicao || null,
        observacoes: data.observacoes || null,
        created_by: (await supabase.auth.getUser()).data.user?.id
      };

      const { error } = await supabase
        .from('celulares')
        .insert([celularData]);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Celular cadastrado com sucesso!"
      });
      
      fetchCelulares();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar celular.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const updateCelular = async (id: string, data: any) => {
    try {
      const celularData = {
        marca: data.marca,
        numero: data.numero,
        imei: data.imei,
        responsavel: data.responsavel,
        setor: data.setor,
        status: data.status,
        operadora: data.operadora || null,
        plano: data.plano || null,
        patrimonio: data.patrimonio || null,
        data_aquisicao: data.dataAquisicao || null,
        observacoes: data.observacoes || null
      };

      const { error } = await supabase
        .from('celulares')
        .update(celularData)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Celular atualizado com sucesso!"
      });
      
      fetchCelulares();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar celular.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const deleteCelular = async (id: string) => {
    try {
      const { error } = await supabase
        .from('celulares')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Celular removido com sucesso!"
      });
      
      fetchCelulares();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover celular.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchCelulares();
  }, []);

  return { 
    celulares, 
    isLoading, 
    createCelular, 
    updateCelular, 
    deleteCelular, 
    refetch: fetchCelulares 
  };
};

export const useSwitches = () => {
  const [switches, setSwitches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSwitches = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('switches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSwitches(data || []);
    } catch (error) {
      console.error('Erro ao buscar switches:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os switches.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createSwitch = async (data: any) => {
    try {
      const switchData = {
        ...data,
        created_by: (await supabase.auth.getUser()).data.user?.id
      };

      const { error } = await supabase
        .from('switches')
        .insert([switchData]);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Switch cadastrado com sucesso!"
      });
      
      fetchSwitches();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar switch.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const updateSwitch = async (id: string, data: any) => {
    try {
      const { error } = await supabase
        .from('switches')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Switch atualizado com sucesso!"
      });
      
      fetchSwitches();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar switch.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const deleteSwitch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('switches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Switch removido com sucesso!"
      });
      
      fetchSwitches();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover switch.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchSwitches();
  }, []);

  return { 
    switches, 
    isLoading, 
    createSwitch, 
    updateSwitch, 
    deleteSwitch, 
    refetch: fetchSwitches 
  };
};

export const useAccessPoints = () => {
  const [accessPoints, setAccessPoints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAccessPoints = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('access_points')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccessPoints(data || []);
    } catch (error) {
      console.error('Erro ao buscar access points:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os access points.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAccessPoint = async (data: any) => {
    try {
      const accessPointData = {
        ...data,
        created_by: (await supabase.auth.getUser()).data.user?.id
      };

      const { error } = await supabase
        .from('access_points')
        .insert([accessPointData]);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Access Point cadastrado com sucesso!"
      });
      
      fetchAccessPoints();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar access point.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const updateAccessPoint = async (id: string, data: any) => {
    try {
      const { error } = await supabase
        .from('access_points')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Access Point atualizado com sucesso!"
      });
      
      fetchAccessPoints();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar access point.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const deleteAccessPoint = async (id: string) => {
    try {
      const { error } = await supabase
        .from('access_points')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Access Point removido com sucesso!"
      });
      
      fetchAccessPoints();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover access point.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchAccessPoints();
  }, []);

  return { 
    accessPoints, 
    isLoading, 
    createAccessPoint, 
    updateAccessPoint, 
    deleteAccessPoint, 
    refetch: fetchAccessPoints 
  };
};

export const useColetores = () => {
  const [coletores, setColetores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchColetores = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('coletores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setColetores(data || []);
    } catch (error) {
      console.error('Erro ao buscar coletores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os coletores.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createColetor = async (data: any) => {
    try {
      const coletorData = {
        ...data,
        created_by: (await supabase.auth.getUser()).data.user?.id
      };

      const { error } = await supabase
        .from('coletores')
        .insert([coletorData]);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Coletor cadastrado com sucesso!"
      });
      
      fetchColetores();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar coletor.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const updateColetor = async (id: string, data: any) => {
    try {
      const { error } = await supabase
        .from('coletores')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Coletor atualizado com sucesso!"
      });
      
      fetchColetores();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar coletor.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const deleteColetor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('coletores')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Coletor removido com sucesso!"
      });
      
      fetchColetores();
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover coletor.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchColetores();
  }, []);

  return { 
    coletores, 
    isLoading, 
    createColetor, 
    updateColetor, 
    deleteColetor, 
    refetch: fetchColetores 
  };
};