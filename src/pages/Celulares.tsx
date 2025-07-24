import { useState } from "react";
import { AssetForm } from "@/components/AssetForm";
import { AssetTable } from "@/components/AssetTable";
import { Button } from "@/components/ui/button";
import { Plus, Smartphone } from "lucide-react";
import { useCelulares } from "@/hooks/useAssets";
import { useAuth } from "@/contexts/AuthContext";

const celularFields = [
  { name: "marca", label: "Marca/Modelo", type: "text" as const, required: true, placeholder: "Ex: iPhone 13 Pro" },
  { name: "numero", label: "Número de Telefone", type: "text" as const, required: true, placeholder: "Ex: (11) 99999-9999" },
  { name: "imei", label: "IMEI", type: "text" as const, required: true, placeholder: "Ex: 123456789012345" },
  { name: "responsavel", label: "Responsável", type: "text" as const, required: true, placeholder: "Nome do usuário responsável" },
  { name: "setor", label: "Setor", type: "select" as const, required: true, options: ["TI", "Administrativo", "Vendas", "Marketing", "RH", "Financeiro", "Diretoria"] },
  { name: "status", label: "Status", type: "select" as const, required: true, options: ["Ativo", "Inativo", "Manutenção"] },
  { name: "operadora", label: "Operadora", type: "select" as const, options: ["Vivo", "Claro", "TIM", "Oi", "Algar"] },
  { name: "plano", label: "Plano", type: "text" as const, placeholder: "Ex: Controle 10GB" },
  { name: "patrimonio", label: "Patrimônio", type: "text" as const, placeholder: "Ex: CEL001234" },
  { name: "dataAquisicao", label: "Data de Aquisição", type: "text" as const, placeholder: "DD/MM/AAAA" },
  { name: "observacoes", label: "Observações", type: "textarea" as const, placeholder: "Informações adicionais..." }
];

const tableColumns = [
  { key: "marca", label: "Marca/Modelo" },
  { key: "numero", label: "Número" },
  { key: "responsavel", label: "Responsável" },
  { key: "setor", label: "Setor" },
  { key: "status", label: "Status", type: "status" as const }
];

export default function Celulares() {
  const [showForm, setShowForm] = useState(false);
  const [editingCelular, setEditingCelular] = useState<any>(null);
  const { celulares, isLoading, createCelular, updateCelular, deleteCelular } = useCelulares();
  const { isAdmin } = useAuth();

  const handleSubmit = async (data: Record<string, string>) => {
    if (editingCelular) {
      // Atualizar celular existente
      const result = await updateCelular(editingCelular.id, data);
      if (result.success) {
        setShowForm(false);
        setEditingCelular(null);
      }
    } else {
      // Criar novo celular
      const result = await createCelular(data);
      if (result.success) {
        setShowForm(false);
      }
    }
  };

  const handleEdit = (celular: any) => {
    if (!isAdmin) {
      return; // Apenas admins podem editar
    }
    
    // Mapear os campos da tabela para o formato do formulário
    const formData = {
      marca: celular.marca,
      numero: celular.numero,
      imei: celular.imei,
      responsavel: celular.responsavel,
      setor: celular.setor,
      status: celular.status,
      operadora: celular.operadora || '',
      plano: celular.plano || '',
      patrimonio: celular.patrimonio || '',
      dataAquisicao: celular.data_aquisicao || '',
      observacoes: celular.observacoes || ''
    };
    
    setEditingCelular({ ...celular, ...formData });
    setShowForm(true);
  };

  const handleDelete = async (celular: any) => {
    if (!isAdmin) {
      return; // Apenas admins podem deletar
    }
    
    if (window.confirm(`Tem certeza que deseja remover o celular ${celular.marca}?`)) {
      await deleteCelular(celular.id);
    }
  };

  const handleView = (celular: any) => {
    console.log("Visualizar:", celular);
  };

  const handleNewCelular = () => {
    if (!isAdmin) {
      return; // Apenas admins podem criar
    }
    setEditingCelular(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCelular(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Smartphone className="w-8 h-8 mr-3 text-primary" />
            Gestão de Celulares
          </h1>
          <p className="text-muted-foreground mt-2">
            Controle de smartphones corporativos e planos de telefonia
          </p>
        </div>
        
        {isAdmin && (
          <Button 
            onClick={handleNewCelular} 
            variant="tech"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Celular
          </Button>
        )}
      </div>

      {/* Formulário de Cadastro */}
      {showForm && isAdmin && (
        <AssetForm
          title={editingCelular ? "Editar Celular" : "Cadastrar Novo Celular"}
          fields={celularFields}
          initialData={editingCelular}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Tabela de Celulares */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AssetTable
          title="Lista de Celulares"
          data={celulares}
          columns={tableColumns}
          onEdit={isAdmin ? handleEdit : undefined}
          onDelete={isAdmin ? handleDelete : undefined}
          onView={handleView}
        />
      )}
    </div>
  );
}