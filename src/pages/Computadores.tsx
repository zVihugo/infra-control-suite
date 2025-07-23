import { useState } from "react";
import { AssetForm } from "@/components/AssetForm";
import { AssetTable } from "@/components/AssetTable";
import { Button } from "@/components/ui/button";
import { Plus, Monitor } from "lucide-react";

const computadorFields = [
  { name: "nome", label: "Nome do Equipamento", type: "text" as const, required: true, placeholder: "Ex: Notebook Dell Latitude" },
  { name: "patrimonio", label: "Número do Patrimônio", type: "text" as const, required: true, placeholder: "Ex: PAT001234" },
  { name: "macAddress", label: "MAC Address", type: "text" as const, required: true, placeholder: "Ex: 00:1B:44:11:3A:B7" },
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

const mockData = [
  {
    nome: "Notebook Dell Latitude 5520",
    patrimonio: "PAT001234",
    macAddress: "00:1B:44:11:3A:B7",
    localizacao: "Matriz",
    responsavel: "João Silva",
    setor: "TI",
    status: "Ativo",
    marca: "Dell Latitude 5520",
    processador: "Intel Core i5-1135G7",
    memoria: "8GB DDR4",
    armazenamento: "SSD 256GB"
  },
  {
    nome: "Desktop HP ProDesk 400",
    patrimonio: "PAT001235",
    macAddress: "00:1B:44:11:3A:B8",
    localizacao: "Filial 1",
    responsavel: "Maria Santos",
    setor: "Administrativo",
    status: "Ativo",
    marca: "HP ProDesk 400",
    processador: "Intel Core i3-10100",
    memoria: "4GB DDR4",
    armazenamento: "HDD 500GB"
  }
];

export default function Computadores() {
  const [showForm, setShowForm] = useState(false);
  const [computadores, setComputadores] = useState(mockData);

  const handleSubmit = (data: Record<string, string>) => {
    const novoComputador = data as any;
    setComputadores(prev => [...prev, novoComputador]);
    setShowForm(false);
  };

  const handleEdit = (computador: any) => {
    console.log("Editar:", computador);
  };

  const handleDelete = (computador: any) => {
    setComputadores(prev => prev.filter(c => c.patrimonio !== computador.patrimonio));
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
        
        <Button 
          onClick={() => setShowForm(!showForm)} 
          variant="tech"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Computador
        </Button>
      </div>

      {/* Formulário de Cadastro */}
      {showForm && (
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
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  );
}