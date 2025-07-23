import { useState } from "react";
import { AssetForm } from "@/components/AssetForm";
import { AssetTable } from "@/components/AssetTable";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";

const coletorFields = [
  { name: "marca", label: "Marca/Modelo", type: "text" as const, required: true, placeholder: "Ex: Zebra MC3300" },
  { name: "serie", label: "Número de Série", type: "text" as const, required: true, placeholder: "Ex: 12345678901" },
  { name: "responsavel", label: "Responsável", type: "text" as const, required: true, placeholder: "Nome do usuário responsável" },
  { name: "status", label: "Status", type: "select" as const, required: true, options: ["Ativo", "Inativo", "Manutenção"] },
  { name: "localizacao", label: "Localização", type: "select" as const, required: true, options: ["Almoxarifado", "Expedição", "Recebimento", "Estoque", "Produção", "Vendas"] },
  { name: "patrimonio", label: "Patrimônio", type: "text" as const, placeholder: "Ex: COL001234" },
  { name: "tipo", label: "Tipo de Coletor", type: "select" as const, options: ["Código de Barras", "RFID", "Híbrido"] },
  { name: "conectividade", label: "Conectividade", type: "select" as const, options: ["Wi-Fi", "Bluetooth", "4G", "Wi-Fi + Bluetooth", "Wi-Fi + 4G"] },
  { name: "sistemaOperacional", label: "Sistema Operacional", type: "select" as const, options: ["Android", "Windows CE", "Windows Mobile", "Proprietário"] },
  { name: "versaoSoftware", label: "Versão do Software", type: "text" as const, placeholder: "Ex: v2.1.5" },
  { name: "dataAquisicao", label: "Data de Aquisição", type: "text" as const, placeholder: "DD/MM/AAAA" },
  { name: "observacoes", label: "Observações", type: "textarea" as const, placeholder: "Configurações especiais, aplicativos instalados..." }
];

const tableColumns = [
  { key: "marca", label: "Marca/Modelo" },
  { key: "serie", label: "Número de Série" },
  { key: "responsavel", label: "Responsável" },
  { key: "localizacao", label: "Localização" },
  { key: "status", label: "Status", type: "status" as const }
];

const mockData = [
  {
    marca: "Zebra MC3300",
    serie: "12345678901",
    responsavel: "José Santos",
    status: "Ativo",
    localizacao: "Almoxarifado",
    patrimonio: "COL001234",
    tipo: "Código de Barras",
    conectividade: "Wi-Fi + Bluetooth",
    sistemaOperacional: "Android",
    versaoSoftware: "v2.1.5"
  },
  {
    marca: "Honeywell CT60",
    serie: "12345678902",
    responsavel: "Maria Oliveira",
    status: "Ativo",
    localizacao: "Expedição",
    patrimonio: "COL001235",
    tipo: "RFID",
    conectividade: "Wi-Fi + 4G",
    sistemaOperacional: "Android",
    versaoSoftware: "v1.8.2"
  }
];

export default function Coletores() {
  const [showForm, setShowForm] = useState(false);
  const [coletores, setColetores] = useState(mockData);

  const handleSubmit = (data: Record<string, string>) => {
    const novoColetor = data as any;
    setColetores(prev => [...prev, novoColetor]);
    setShowForm(false);
  };

  const handleEdit = (coletor: any) => {
    console.log("Editar:", coletor);
  };

  const handleDelete = (coletor: any) => {
    setColetores(prev => prev.filter(c => c.serie !== coletor.serie));
  };

  const handleView = (coletor: any) => {
    console.log("Visualizar:", coletor);
  };

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
        
        <Button 
          onClick={() => setShowForm(!showForm)} 
          variant="tech"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Coletor
        </Button>
      </div>

      {/* Formulário de Cadastro */}
      {showForm && (
        <AssetForm
          title="Cadastrar Novo Coletor"
          fields={coletorFields}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Tabela de Coletores */}
      <AssetTable
        title="Lista de Coletores"
        data={coletores}
        columns={tableColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  );
}