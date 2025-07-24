export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      access_points: {
        Row: {
          banda: string | null
          canal: string | null
          created_at: string
          created_by: string | null
          data_instalacao: string | null
          id: string
          ip_acesso: string
          localizacao: string
          mac_address: string
          marca: string
          observacoes: string | null
          padrao: string | null
          patrimonio: string | null
          potencia: string | null
          ssid: string
          status: string
          updated_at: string
        }
        Insert: {
          banda?: string | null
          canal?: string | null
          created_at?: string
          created_by?: string | null
          data_instalacao?: string | null
          id?: string
          ip_acesso: string
          localizacao: string
          mac_address: string
          marca: string
          observacoes?: string | null
          padrao?: string | null
          patrimonio?: string | null
          potencia?: string | null
          ssid: string
          status?: string
          updated_at?: string
        }
        Update: {
          banda?: string | null
          canal?: string | null
          created_at?: string
          created_by?: string | null
          data_instalacao?: string | null
          id?: string
          ip_acesso?: string
          localizacao?: string
          mac_address?: string
          marca?: string
          observacoes?: string | null
          padrao?: string | null
          patrimonio?: string | null
          potencia?: string | null
          ssid?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      celulares: {
        Row: {
          created_at: string
          created_by: string | null
          data_aquisicao: string | null
          id: string
          imei: string
          marca: string
          numero: string
          observacoes: string | null
          operadora: string | null
          patrimonio: string | null
          plano: string | null
          responsavel: string
          setor: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data_aquisicao?: string | null
          id?: string
          imei: string
          marca: string
          numero: string
          observacoes?: string | null
          operadora?: string | null
          patrimonio?: string | null
          plano?: string | null
          responsavel: string
          setor: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data_aquisicao?: string | null
          id?: string
          imei?: string
          marca?: string
          numero?: string
          observacoes?: string | null
          operadora?: string | null
          patrimonio?: string | null
          plano?: string | null
          responsavel?: string
          setor?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      coletores: {
        Row: {
          conectividade: string | null
          created_at: string
          created_by: string | null
          data_aquisicao: string | null
          id: string
          localizacao: string
          marca: string
          observacoes: string | null
          patrimonio: string | null
          responsavel: string
          serie: string
          sistema_operacional: string | null
          status: string
          tipo: string | null
          updated_at: string
          versao_software: string | null
        }
        Insert: {
          conectividade?: string | null
          created_at?: string
          created_by?: string | null
          data_aquisicao?: string | null
          id?: string
          localizacao: string
          marca: string
          observacoes?: string | null
          patrimonio?: string | null
          responsavel: string
          serie: string
          sistema_operacional?: string | null
          status?: string
          tipo?: string | null
          updated_at?: string
          versao_software?: string | null
        }
        Update: {
          conectividade?: string | null
          created_at?: string
          created_by?: string | null
          data_aquisicao?: string | null
          id?: string
          localizacao?: string
          marca?: string
          observacoes?: string | null
          patrimonio?: string | null
          responsavel?: string
          serie?: string
          sistema_operacional?: string | null
          status?: string
          tipo?: string | null
          updated_at?: string
          versao_software?: string | null
        }
        Relationships: []
      }
      computadores: {
        Row: {
          armazenamento: string | null
          created_at: string
          created_by: string | null
          id: string
          localizacao: string
          mac_address: string
          marca: string | null
          memoria: string | null
          nome: string
          observacoes: string | null
          patrimonio: string
          processador: string | null
          responsavel: string
          setor: string
          status: string
          updated_at: string
        }
        Insert: {
          armazenamento?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          localizacao: string
          mac_address: string
          marca?: string | null
          memoria?: string | null
          nome: string
          observacoes?: string | null
          patrimonio: string
          processador?: string | null
          responsavel: string
          setor: string
          status?: string
          updated_at?: string
        }
        Update: {
          armazenamento?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          localizacao?: string
          mac_address?: string
          marca?: string | null
          memoria?: string | null
          nome?: string
          observacoes?: string | null
          patrimonio?: string
          processador?: string | null
          responsavel?: string
          setor?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      switches: {
        Row: {
          created_at: string
          created_by: string | null
          data_instalacao: string | null
          id: string
          ip_acesso: string
          localizacao: string
          mac_address: string
          marca: string
          numero_portas: string
          observacoes: string | null
          patrimonio: string | null
          protocolo: string | null
          status: string
          updated_at: string
          velocidade: string | null
          versao_firmware: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data_instalacao?: string | null
          id?: string
          ip_acesso: string
          localizacao: string
          mac_address: string
          marca: string
          numero_portas: string
          observacoes?: string | null
          patrimonio?: string | null
          protocolo?: string | null
          status?: string
          updated_at?: string
          velocidade?: string | null
          versao_firmware?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data_instalacao?: string | null
          id?: string
          ip_acesso?: string
          localizacao?: string
          mac_address?: string
          marca?: string
          numero_portas?: string
          observacoes?: string | null
          patrimonio?: string | null
          protocolo?: string | null
          status?: string
          updated_at?: string
          velocidade?: string | null
          versao_firmware?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
