import { useState } from "react";
import { AssetForm } from "@/components/AssetForm";
import { AssetTable } from "@/components/AssetTable";
import { Button } from "@/components/ui/button";
import { Plus, Smartphone } from "lucide-react";

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

const mockData = [
  {
    marca: "iPhone 13 Pro",
    numero: "(11) 99999-1234",
    imei: "123456789012345",
    responsavel: "Carlos Silva",
    setor: "Vendas",
    status: "Ativo",
    operadora: "Vivo",
    plano: "Controle 15GB",
    patrimonio: "CEL001234"
  },
  {
    marca: "Samsung Galaxy S21",
    numero: "(11) 99999-5678",
    imei: "123456789012346",
    responsavel: "Ana Costa",
    setor: "Marketing",
    status: "Ativo",
    operadora: "Claro",
    plano: "Pós 20GB",
    patrimonio: "CEL001235"
  }
];

export default function Celulares() {
  const [showForm, setShowForm] = useState(false);
  const [celulares, setCelulares] = useState(mockData);

  const handleSubmit = (data: Record<string, string>) => {
    const novoCelular = data as any;
    setCelulares(prev => [...prev, novoCelular]);
    setShowForm(false);
  };

  const handleEdit = (celular: any) => {
    console.log("Editar:", celular);
  };

  const handleDelete = (celular: any) => {
    setCelulares(prev => prev.filter(c => c.imei !== celular.imei));
  };

  const handleView = (celular: any) => {
    console.log("Visualizar:", celular);
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
        
        <Button 
          onClick={() => setShowForm(!showForm)} 
          variant="tech"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Celular
        </Button>
      </div>

      {/* Formulário de Cadastro */}
      {showForm && (
        <AssetForm
          title="Cadastrar Novo Celular"
          fields={celularFields}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Tabela de Celulares */}
      <AssetTable
        title="Lista de Celulares"
        data={celulares}
        columns={tableColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  );
}