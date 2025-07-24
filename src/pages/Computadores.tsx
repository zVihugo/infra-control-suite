import { useState } from "react";
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
  const { computadores, isLoading, createComputador, deleteComputador } = useComputadores();
  const { isAdmin } = useAuth();

  const handleSubmit = async (data: Record<string, string>) => {
    const result = await createComputador(data);
    if (result.success) {
      setShowForm(false);
    }
  };

  const handleEdit = (computador: any) => {
    console.log("Editar:", computador);
  };

  const handleDelete = async (computador: any) => {
    await deleteComputador(computador.id);
  };

  const handleView = (computador: any) => {
    console.log("Visualizar:", computador);
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
            onClick={() => setShowForm(!showForm)} 
            variant="tech"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Computador
          </Button>
        )}
      </div>

      {/* Formulário de Cadastro */}
      {showForm && isAdmin && (
        <AssetForm
          title="Cadastrar Novo Computador"
          fields={computadorFields}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Tabela de Computadores */}
      <AssetTable
        title="Lista de Computadores"
        data={computadores}
        columns={tableColumns}
        onEdit={isAdmin ? handleEdit : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
        onView={handleView}
      />
    </div>
  );
}