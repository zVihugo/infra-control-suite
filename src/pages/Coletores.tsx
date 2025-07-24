import { useState } from "react";
import { AssetForm } from "@/components/AssetForm";
import { AssetTable } from "@/components/AssetTable";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { useColetores } from "@/hooks/useAssets";
import { useAuth } from "@/contexts/AuthContext";

const coletorFields = [
  { name: "marca", label: "Marca/Modelo", type: "text" as const, required: true, placeholder: "Ex: Zebra MC3300" },
  { name: "serie", label: "Número de Série", type: "text" as const, required: true, placeholder: "Ex: 12345678901" },
  { name: "responsavel", label: "Responsável", type: "text" as const, required: true, placeholder: "Nome do usuário responsável" },
  { name: "status", label: "Status", type: "select" as const, required: true, options: ["Ativo", "Inativo", "Manutenção"] },
  { name: "localizacao", label: "Localização", type: "select" as const, required: true, options: ["Almoxarifado", "Expedição", "Recebimento", "Estoque", "Produção", "Vendas"] },
  { name: "patrimonio", label: "Patrimônio", type: "text" as const, placeholder: "Ex: COL001234" },
  { name: "tipo", label: "Tipo de Coletor", type: "select" as const, options: ["Código de Barras", "RFID", "Híbrido"] },
  { name: "conectividade", label: "Conectividade", type: "select" as const, options: ["Wi-Fi", "Bluetooth", "4G", "Wi-Fi + Bluetooth", "Wi-Fi + 4G"] },
  { name: "sistema_operacional", label: "Sistema Operacional", type: "select" as const, options: ["Android", "Windows CE", "Windows Mobile", "Proprietário"] },
  { name: "versao_software", label: "Versão do Software", type: "text" as const, placeholder: "Ex: v2.1.5" },
  { name: "data_aquisicao", label: "Data de Aquisição", type: "text" as const, placeholder: "DD/MM/AAAA" },
  { name: "observacoes", label: "Observações", type: "textarea" as const, placeholder: "Configurações especiais, aplicativos instalados..." }
];

const tableColumns = [
  { key: "marca", label: "Marca/Modelo" },
  { key: "serie", label: "Número de Série" },
  { key: "responsavel", label: "Responsável" },
  { key: "localizacao", label: "Localização" },
  { key: "status", label: "Status", type: "status" as const }
];

export default function Coletores() {
  const [showForm, setShowForm] = useState(false);
  const [editingColetor, setEditingColetor] = useState<any>(null);
  const { coletores, isLoading, createColetor, updateColetor, deleteColetor } = useColetores();
  const { isAdmin } = useAuth();

  const handleSubmit = async (data: Record<string, string>) => {
    if (editingColetor) {
      // Atualizar coletor existente
      const result = await updateColetor(editingColetor.id, data);
      if (result.success) {
        setShowForm(false);
        setEditingColetor(null);
      }
    } else {
      // Criar novo coletor
      const result = await createColetor(data);
      if (result.success) {
        setShowForm(false);
      }
    }
  };

  const handleEdit = (coletor: any) => {
    if (!isAdmin) {
      return; // Apenas admins podem editar
    }
    
    // Mapear os campos da tabela para o formato do formulário
    const formData = {
      marca: coletor.marca,
      serie: coletor.serie,
      responsavel: coletor.responsavel,
      status: coletor.status,
      localizacao: coletor.localizacao,
      patrimonio: coletor.patrimonio || '',
      tipo: coletor.tipo || '',
      conectividade: coletor.conectividade || '',
      sistema_operacional: coletor.sistema_operacional || '',
      versao_software: coletor.versao_software || '',
      data_aquisicao: coletor.data_aquisicao || '',
      observacoes: coletor.observacoes || ''
    };
    
    setEditingColetor({ ...coletor, ...formData });
    setShowForm(true);
  };

  const handleDelete = async (coletor: any) => {
    if (!isAdmin) {
      return; // Apenas admins podem deletar
    }
    
    if (window.confirm(`Tem certeza que deseja remover o coletor ${coletor.marca}?`)) {
      await deleteColetor(coletor.id);
    }
  };

  const handleView = (coletor: any) => {
    console.log("Visualizar:", coletor);
  };

  const handleNewColetor = () => {
    if (!isAdmin) {
      return; // Apenas admins podem criar
    }
    setEditingColetor(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingColetor(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando coletores...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Package className="w-8 h-8 mr-3 text-primary" />
            Gestão de Coletores
          </h1>
          <p className="text-muted-foreground mt-2">
            Controle de coletores de dados e dispositivos de captura
          </p>
        </div>
        
        {isAdmin && (
          <Button 
            onClick={handleNewColetor} 
            variant="tech"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Coletor
          </Button>
        )}
      </div>

      {/* Formulário de Cadastro */}
      {showForm && (
        <AssetForm
          title={editingColetor ? "Editar Coletor" : "Cadastrar Novo Coletor"}
          fields={coletorFields}
          initialData={editingColetor}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Tabela de Coletores */}
      <AssetTable
        title="Lista de Coletores"
        data={coletores}
        columns={tableColumns}
        onEdit={isAdmin ? handleEdit : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
        onView={handleView}
      />
    </div>
  );
}