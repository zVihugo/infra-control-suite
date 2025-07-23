import { useState } from "react";
import { AssetForm } from "@/components/AssetForm";
import { AssetTable } from "@/components/AssetTable";
import { Button } from "@/components/ui/button";
import { Plus, Network } from "lucide-react";

const switchFields = [
  { name: "marca", label: "Marca/Modelo", type: "text" as const, required: true, placeholder: "Ex: Cisco SG300-28" },
  { name: "numeroPortas", label: "Número de Portas", type: "select" as const, required: true, options: ["8", "16", "24", "28", "48", "52"] },
  { name: "macAddress", label: "MAC Address", type: "text" as const, required: true, placeholder: "Ex: 00:1B:44:11:3A:B7" },
  { name: "localizacao", label: "Localização", type: "select" as const, required: true, options: ["Rack Principal", "Sala TI", "Andar 1", "Andar 2", "Andar 3", "Subsolo"] },
  { name: "ipAcesso", label: "IP de Acesso", type: "text" as const, required: true, placeholder: "Ex: 192.168.1.10" },
  { name: "status", label: "Status", type: "select" as const, required: true, options: ["Ativo", "Inativo", "Manutenção"] },
  { name: "patrimonio", label: "Patrimônio", type: "text" as const, placeholder: "Ex: SW001234" },
  { name: "versaoFirmware", label: "Versão do Firmware", type: "text" as const, placeholder: "Ex: 1.4.8.05" },
  { name: "velocidade", label: "Velocidade das Portas", type: "select" as const, options: ["10/100 Mbps", "10/100/1000 Mbps", "1 Gbps", "10 Gbps"] },
  { name: "protocolo", label: "Protocolo de Gerência", type: "select" as const, options: ["SNMP", "SSH", "Telnet", "Web Interface"] },
  { name: "dataInstalacao", label: "Data de Instalação", type: "text" as const, placeholder: "DD/MM/AAAA" },
  { name: "observacoes", label: "Observações", type: "textarea" as const, placeholder: "Configurações especiais, VLANs, etc..." }
];

const tableColumns = [
  { key: "marca", label: "Marca/Modelo" },
  { key: "numeroPortas", label: "Portas" },
  { key: "ipAcesso", label: "IP de Acesso" },
  { key: "localizacao", label: "Localização" },
  { key: "status", label: "Status", type: "status" as const }
];

const mockData = [
  {
    marca: "Cisco SG300-28",
    numeroPortas: "28",
    macAddress: "00:1B:44:11:3A:B7",
    localizacao: "Rack Principal",
    ipAcesso: "192.168.1.10",
    status: "Ativo",
    patrimonio: "SW001234",
    versaoFirmware: "1.4.8.05",
    velocidade: "10/100/1000 Mbps",
    protocolo: "SNMP"
  },
  {
    marca: "TP-Link TL-SG1024D",
    numeroPortas: "24",
    macAddress: "00:1B:44:11:3A:B8",
    localizacao: "Andar 2",
    ipAcesso: "192.168.1.11",
    status: "Ativo",
    patrimonio: "SW001235",
    versaoFirmware: "2.0.1",
    velocidade: "10/100/1000 Mbps",
    protocolo: "Web Interface"
  }
];

export default function Switches() {
  const [showForm, setShowForm] = useState(false);
  const [switches, setSwitches] = useState(mockData);

  const handleSubmit = (data: Record<string, string>) => {
    const novoSwitch = data as any;
    setSwitches(prev => [...prev, novoSwitch]);
    setShowForm(false);
  };

  const handleEdit = (switchItem: any) => {
    console.log("Editar:", switchItem);
  };

  const handleDelete = (switchItem: any) => {
    setSwitches(prev => prev.filter(s => s.macAddress !== switchItem.macAddress));
  };

  const handleView = (switchItem: any) => {
    console.log("Visualizar:", switchItem);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Network className="w-8 h-8 mr-3 text-primary" />
            Gestão de Switches
          </h1>
          <p className="text-muted-foreground mt-2">
            Controle de switches de rede e equipamentos de conectividade
          </p>
        </div>
        
        <Button 
          onClick={() => setShowForm(!showForm)} 
          variant="tech"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Switch
        </Button>
      </div>

      {/* Formulário de Cadastro */}
      {showForm && (
        <AssetForm
          title="Cadastrar Novo Switch"
          fields={switchFields}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Tabela de Switches */}
      <AssetTable
        title="Lista de Switches"
        data={switches}
        columns={tableColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  );
}