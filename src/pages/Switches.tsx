import { useState } from "react";
import { AssetForm } from "@/components/AssetForm";
import { AssetTable } from "@/components/AssetTable";
import { Button } from "@/components/ui/button";
import { Plus, Network } from "lucide-react";
import { useSwitches } from "@/hooks/useAssets";
import { useAuth } from "@/contexts/AuthContext";

const switchFields = [
  { name: "marca", label: "Marca/Modelo", type: "text" as const, required: true, placeholder: "Ex: Cisco SG300-28" },
  { name: "numero_portas", label: "Número de Portas", type: "select" as const, required: true, options: ["8", "16", "24", "28", "48", "52"] },
  { name: "mac_address", label: "MAC Address", type: "text" as const, required: true, placeholder: "Ex: 00:1B:44:11:3A:B7" },
  { name: "localizacao", label: "Localização", type: "select" as const, required: true, options: ["Rack Principal", "Sala TI", "Andar 1", "Andar 2", "Andar 3", "Subsolo"] },
  { name: "ip_acesso", label: "IP de Acesso", type: "text" as const, required: true, placeholder: "Ex: 192.168.1.10" },
  { name: "status", label: "Status", type: "select" as const, required: true, options: ["Ativo", "Inativo", "Manutenção"] },
  { name: "patrimonio", label: "Patrimônio", type: "text" as const, placeholder: "Ex: SW001234" },
  { name: "versao_firmware", label: "Versão do Firmware", type: "text" as const, placeholder: "Ex: 1.4.8.05" },
  { name: "velocidade", label: "Velocidade das Portas", type: "select" as const, options: ["10/100 Mbps", "10/100/1000 Mbps", "1 Gbps", "10 Gbps"] },
  { name: "protocolo", label: "Protocolo de Gerência", type: "select" as const, options: ["SNMP", "SSH", "Telnet", "Web Interface"] },
  { name: "data_instalacao", label: "Data de Instalação", type: "text" as const, placeholder: "DD/MM/AAAA" },
  { name: "observacoes", label: "Observações", type: "textarea" as const, placeholder: "Configurações especiais, VLANs, etc..." }
];

const tableColumns = [
  { key: "marca", label: "Marca/Modelo" },
  { key: "numero_portas", label: "Portas" },
  { key: "ip_acesso", label: "IP de Acesso" },
  { key: "localizacao", label: "Localização" },
  { key: "status", label: "Status", type: "status" as const }
];

export default function Switches() {
  const [showForm, setShowForm] = useState(false);
  const [editingSwitch, setEditingSwitch] = useState<any>(null);
  const { switches, isLoading, createSwitch, updateSwitch, deleteSwitch } = useSwitches();
  const { isAdmin } = useAuth();

  const handleSubmit = async (data: Record<string, string>) => {
    if (editingSwitch) {
      // Atualizar switch existente
      const result = await updateSwitch(editingSwitch.id, data);
      if (result.success) {
        setShowForm(false);
        setEditingSwitch(null);
      }
    } else {
      // Criar novo switch
      const result = await createSwitch(data);
      if (result.success) {
        setShowForm(false);
      }
    }
  };

  const handleEdit = (switchItem: any) => {
    if (!isAdmin) {
      return; // Apenas admins podem editar
    }
    
    // Mapear os campos da tabela para o formato do formulário
    const formData = {
      marca: switchItem.marca,
      numero_portas: switchItem.numero_portas,
      mac_address: switchItem.mac_address,
      localizacao: switchItem.localizacao,
      ip_acesso: switchItem.ip_acesso,
      status: switchItem.status,
      patrimonio: switchItem.patrimonio || '',
      versao_firmware: switchItem.versao_firmware || '',
      velocidade: switchItem.velocidade || '',
      protocolo: switchItem.protocolo || '',
      data_instalacao: switchItem.data_instalacao || '',
      observacoes: switchItem.observacoes || ''
    };
    
    setEditingSwitch({ ...switchItem, ...formData });
    setShowForm(true);
  };

  const handleDelete = async (switchItem: any) => {
    if (!isAdmin) {
      return; // Apenas admins podem deletar
    }
    
    if (window.confirm(`Tem certeza que deseja remover o switch ${switchItem.marca}?`)) {
      await deleteSwitch(switchItem.id);
    }
  };

  const handleView = (switchItem: any) => {
    console.log("Visualizar:", switchItem);
  };

  const handleNewSwitch = () => {
    if (!isAdmin) {
      return; // Apenas admins podem criar
    }
    setEditingSwitch(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSwitch(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando switches...</div>
      </div>
    );
  }

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
        
        {isAdmin && (
          <Button 
            onClick={handleNewSwitch} 
            variant="tech"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Switch
          </Button>
        )}
      </div>

      {/* Formulário de Cadastro */}
      {showForm && (
        <AssetForm
          title={editingSwitch ? "Editar Switch" : "Cadastrar Novo Switch"}
          fields={switchFields}
          initialData={editingSwitch}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Tabela de Switches */}
      <AssetTable
        title="Lista de Switches"
        data={switches}
        columns={tableColumns}
        onEdit={isAdmin ? handleEdit : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
        onView={handleView}
      />
    </div>
  );
}