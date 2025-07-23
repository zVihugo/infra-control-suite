import { useState } from "react";
import { AssetForm } from "@/components/AssetForm";
import { AssetTable } from "@/components/AssetTable";
import { Button } from "@/components/ui/button";
import { Plus, Wifi } from "lucide-react";

const accessPointFields = [
  { name: "marca", label: "Marca/Modelo", type: "text" as const, required: true, placeholder: "Ex: Ubiquiti UniFi AP-AC-PRO" },
  { name: "macAddress", label: "MAC Address", type: "text" as const, required: true, placeholder: "Ex: 00:1B:44:11:3A:B7" },
  { name: "localizacao", label: "Localização", type: "select" as const, required: true, options: ["Recepção", "Sala de Reunião", "Andar 1", "Andar 2", "Andar 3", "Área Externa", "Auditório"] },
  { name: "ssid", label: "SSID Principal", type: "text" as const, required: true, placeholder: "Ex: EmpresaWiFi" },
  { name: "ipAcesso", label: "IP de Acesso", type: "text" as const, required: true, placeholder: "Ex: 192.168.1.50" },
  { name: "status", label: "Status", type: "select" as const, required: true, options: ["Ativo", "Inativo", "Manutenção"] },
  { name: "patrimonio", label: "Patrimônio", type: "text" as const, placeholder: "Ex: AP001234" },
  { name: "banda", label: "Banda de Frequência", type: "select" as const, options: ["2.4 GHz", "5 GHz", "Dual Band"] },
  { name: "padrao", label: "Padrão Wi-Fi", type: "select" as const, options: ["802.11n", "802.11ac", "802.11ax (Wi-Fi 6)"] },
  { name: "canal", label: "Canal", type: "text" as const, placeholder: "Ex: Auto / 6 / 36" },
  { name: "potencia", label: "Potência de Transmissão", type: "select" as const, options: ["Baixa", "Média", "Alta", "Auto"] },
  { name: "dataInstalacao", label: "Data de Instalação", type: "text" as const, placeholder: "DD/MM/AAAA" },
  { name: "observacoes", label: "Observações", type: "textarea" as const, placeholder: "SSIDs adicionais, configurações especiais..." }
];

const tableColumns = [
  { key: "marca", label: "Marca/Modelo" },
  { key: "ssid", label: "SSID Principal" },
  { key: "localizacao", label: "Localização" },
  { key: "ipAcesso", label: "IP de Acesso" },
  { key: "status", label: "Status", type: "status" as const }
];

const mockData = [
  {
    marca: "Ubiquiti UniFi AP-AC-PRO",
    macAddress: "00:1B:44:11:3A:B7",
    localizacao: "Recepção",
    ssid: "EmpresaWiFi",
    ipAcesso: "192.168.1.50",
    status: "Ativo",
    patrimonio: "AP001234",
    banda: "Dual Band",
    padrao: "802.11ac",
    canal: "Auto",
    potencia: "Alta"
  },
  {
    marca: "TP-Link EAP225",
    macAddress: "00:1B:44:11:3A:B8",
    localizacao: "Sala de Reunião",
    ssid: "EmpresaWiFi",
    ipAcesso: "192.168.1.51",
    status: "Ativo",
    patrimonio: "AP001235",
    banda: "Dual Band",
    padrao: "802.11ac",
    canal: "6",
    potencia: "Média"
  }
];

export default function AccessPoints() {
  const [showForm, setShowForm] = useState(false);
  const [accessPoints, setAccessPoints] = useState(mockData);

  const handleSubmit = (data: Record<string, string>) => {
    const novoAP = data as any;
    setAccessPoints(prev => [...prev, novoAP]);
    setShowForm(false);
  };

  const handleEdit = (ap: any) => {
    console.log("Editar:", ap);
  };

  const handleDelete = (ap: any) => {
    setAccessPoints(prev => prev.filter(a => a.macAddress !== ap.macAddress));
  };

  const handleView = (ap: any) => {
    console.log("Visualizar:", ap);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Wifi className="w-8 h-8 mr-3 text-primary" />
            Gestão de Access Points
          </h1>
          <p className="text-muted-foreground mt-2">
            Controle de pontos de acesso Wi-Fi e infraestrutura wireless
          </p>
        </div>
        
        <Button 
          onClick={() => setShowForm(!showForm)} 
          variant="tech"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Access Point
        </Button>
      </div>

      {/* Formulário de Cadastro */}
      {showForm && (
        <AssetForm
          title="Cadastrar Novo Access Point"
          fields={accessPointFields}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Tabela de Access Points */}
      <AssetTable
        title="Lista de Access Points"
        data={accessPoints}
        columns={tableColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  );
}