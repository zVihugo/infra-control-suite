import { useState, useEffect } from "react";
import { AssetForm } from "@/components/AssetForm";
import { AssetTable } from "@/components/AssetTable";
import { Button } from "@/components/ui/button";
import { Plus, Monitor } from "lucide-react";

import { useComputadores } from "@/hooks/useAssets";
import { useAuth } from "@/contexts/AuthContext";

const computadorFields = [
  { name: "nome", label: "Nome do Equipamento", type: "text" as const, required: true, placeholder: "Ex: Notebook Dell Latitude" },
  { name: "patrimonio", label: "Número do Patrimônio", type: "text" as const, required: true, placeholder: "Ex: PAT001234" },
  { name: "mac_address", label: "MAC Address", type: "text" as const, required: true, placeholder: "Ex: 00:1B:44:11:3A:B7" },
  { name: "localizacao", label: "Localização", type: "select" as const, required: true, options: ["Matriz", "Filial 1", "Filial 2", "Home Office", "Almoxarifado"] },
  { name: "responsavel", label: "Responsável", type: "text" as const, required: true, placeholder: "Nome do usuário responsável" },
  { name: "setor", label: "Setor", type: "select" as const, required: true, options: ["TI", "Administrativo", "Vendas", "Marketing", "RH", "Financeiro"] },
  { name: "status", label: "Status", type: "select" as const, required: true, options: ["Ativo", "Inativo", "Manutenção"] },
  { name: "marca", label: "Marca/Modelo", type: "text" as const, placeholder: "Ex: Dell Latitude 5520" },
  { name: "processador", label: "Processador", type: "text" as const, placeholder: "Ex: Intel Core i5-1135G7" },
  { name: "memoria", label: "Memória RAM", type: "text" as const, placeholder: "Ex: 8GB DDR4" },
  { name: "armazenamento", label: "Armazenamento", type: "text" as const, placeholder: "Ex: SSD 256GB" },
  { name: "observacoes", label: "Observações", type: "textarea" as const, placeholder: "Informações adicionais..." }
];

const tableColumns = [
  { key: "nome", label: "Nome do Equipamento" },
  { key: "patrimonio", label: "Patrimônio" },
  { key: "responsavel", label: "Responsável" },
  { key: "localizacao", label: "Localização" },
  { key: "status", label: "Status", type: "status" as const }
];

export default function Computadores() {
  const [showForm, setShowForm] = useState(false);
  const [editingComputador, setEditingComputador] = useState<any>(null);
  const { computadores, isLoading, createComputador, updateComputador, deleteComputador, refetch } = useComputadores();
  const { isAdmin } = useAuth();

  const handleSubmit = async (data: Record<string, string>) => {
    if (editingComputador) {
      // Atualizar computador existente
      const result = await updateComputador(editingComputador.id, data);
      if (result.success) {
        setShowForm(false);
        setEditingComputador(null);
      }
    } else {
      // Criar novo computador
      const result = await createComputador(data);
      if (result.success) {
        setShowForm(false);
      }
    }
  };

  const handleEdit = (computador: any) => {
    if (!isAdmin) return;
    
    // Mapear os dados para o formato do formulário
    const formData = {
      nome: computador.nome,
      patrimonio: computador.patrimonio,
      mac_address: computador.mac_address,
      localizacao: computador.localizacao,
      responsavel: computador.responsavel,
      setor: computador.setor,
      status: computador.status,
      marca: computador.marca || '',
      processador: computador.processador || '',
      memoria: computador.memoria || '',
      armazenamento: computador.armazenamento || '',
      observacoes: computador.observacoes || ''
    };
    
    setEditingComputador({ ...computador, ...formData });
    setShowForm(true);
  };

  const handleDelete = async (computador: any) => {
    if (!isAdmin) return;
    
    if (window.confirm(`Tem certeza que deseja remover o computador ${computador.nome}?`)) {
      await deleteComputador(computador.id);
    }
  };

  const handleView = (computador: any) => {
    console.log("Visualizar:", computador);
  };

  const handleNewComputador = () => {
    if (!isAdmin) return;
    setEditingComputador(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingComputador(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Monitor className="w-8 h-8 mr-3 text-primary" />
            Gestão de Computadores
          </h1>
          <p className="text-muted-foreground mt-2">
            Controle e gerenciamento de desktops, notebooks e estações de trabalho
          </p>
        </div>
        
        {isAdmin && (
          <Button 
            onClick={handleNewComputador} 
            variant="tech"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Computador
          </Button>
        )}
      </div>

      
      {showForm && isAdmin && (
        <AssetForm
          title={editingComputador ? "Editar Computador" : "Cadastrar Novo Computador"}
          fields={computadorFields}
          initialData={editingComputador}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Tabela de Computadores */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AssetTable
          title="Lista de Computadores"
          data={computadores}
          columns={tableColumns}
          onEdit={isAdmin ? handleEdit : undefined}
          onDelete={isAdmin ? handleDelete : undefined}
          onView={handleView}
        />
      )}
    </div>
  );
}