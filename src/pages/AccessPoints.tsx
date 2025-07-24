import { useState } from "react";
import { AssetForm } from "@/components/AssetForm";
import { AssetTable } from "@/components/AssetTable";
import { Button } from "@/components/ui/button";
import { Plus, Wifi } from "lucide-react";
import { useAccessPoints } from "@/hooks/useAssets";
import { useAuth } from "@/contexts/AuthContext";

const accessPointFields = [
  { name: "marca", label: "Marca/Modelo", type: "text" as const, required: true, placeholder: "Ex: Ubiquiti UniFi AP-AC-PRO" },
  { name: "mac_address", label: "MAC Address", type: "text" as const, required: true, placeholder: "Ex: 00:1B:44:11:3A:B7" },
  { name: "localizacao", label: "Localização", type: "select" as const, required: true, options: ["Recepção", "Sala de Reunião", "Andar 1", "Andar 2", "Andar 3", "Área Externa", "Auditório"] },
  { name: "ssid", label: "SSID Principal", type: "text" as const, required: true, placeholder: "Ex: EmpresaWiFi" },
  { name: "ip_acesso", label: "IP de Acesso", type: "text" as const, required: true, placeholder: "Ex: 192.168.1.50" },
  { name: "status", label: "Status", type: "select" as const, required: true, options: ["Ativo", "Inativo", "Manutenção"] },
  { name: "patrimonio", label: "Patrimônio", type: "text" as const, placeholder: "Ex: AP001234" },
  { name: "banda", label: "Banda de Frequência", type: "select" as const, options: ["2.4 GHz", "5 GHz", "Dual Band"] },
  { name: "padrao", label: "Padrão Wi-Fi", type: "select" as const, options: ["802.11n", "802.11ac", "802.11ax (Wi-Fi 6)"] },
  { name: "canal", label: "Canal", type: "text" as const, placeholder: "Ex: Auto / 6 / 36" },
  { name: "potencia", label: "Potência de Transmissão", type: "select" as const, options: ["Baixa", "Média", "Alta", "Auto"] },
  { name: "data_instalacao", label: "Data de Instalação", type: "text" as const, placeholder: "DD/MM/AAAA" },
  { name: "observacoes", label: "Observações", type: "textarea" as const, placeholder: "SSIDs adicionais, configurações especiais..." }
];

const tableColumns = [
  { key: "marca", label: "Marca/Modelo" },
  { key: "ssid", label: "SSID Principal" },
  { key: "localizacao", label: "Localização" },
  { key: "ip_acesso", label: "IP de Acesso" },
  { key: "status", label: "Status", type: "status" as const }
];

export default function AccessPoints() {
  const [showForm, setShowForm] = useState(false);
  const [editingAccessPoint, setEditingAccessPoint] = useState<any>(null);
  const { accessPoints, isLoading, createAccessPoint, updateAccessPoint, deleteAccessPoint } = useAccessPoints();
  const { isAdmin } = useAuth();

  const handleSubmit = async (data: Record<string, string>) => {
    if (editingAccessPoint) {
      // Atualizar access point existente
      const result = await updateAccessPoint(editingAccessPoint.id, data);
      if (result.success) {
        setShowForm(false);
        setEditingAccessPoint(null);
      }
    } else {
      // Criar novo access point
      const result = await createAccessPoint(data);
      if (result.success) {
        setShowForm(false);
      }
    }
  };

  const handleEdit = (accessPoint: any) => {
    if (!isAdmin) {
      return; // Apenas admins podem editar
    }
    
    // Mapear os campos da tabela para o formato do formulário
    const formData = {
      marca: accessPoint.marca,
      mac_address: accessPoint.mac_address,
      localizacao: accessPoint.localizacao,
      ssid: accessPoint.ssid,
      ip_acesso: accessPoint.ip_acesso,
      status: accessPoint.status,
      patrimonio: accessPoint.patrimonio || '',
      banda: accessPoint.banda || '',
      padrao: accessPoint.padrao || '',
      canal: accessPoint.canal || '',
      potencia: accessPoint.potencia || '',
      data_instalacao: accessPoint.data_instalacao || '',
      observacoes: accessPoint.observacoes || ''
    };
    
    setEditingAccessPoint({ ...accessPoint, ...formData });
    setShowForm(true);
  };

  const handleDelete = async (accessPoint: any) => {
    if (!isAdmin) {
      return; // Apenas admins podem deletar
    }
    
    if (window.confirm(`Tem certeza que deseja remover o access point ${accessPoint.marca}?`)) {
      await deleteAccessPoint(accessPoint.id);
    }
  };

  const handleView = (accessPoint: any) => {
    console.log("Visualizar:", accessPoint);
  };

  const handleNewAccessPoint = () => {
    if (!isAdmin) {
      return; // Apenas admins podem criar
    }
    setEditingAccessPoint(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAccessPoint(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando access points...</div>
      </div>
    );
  }

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
        
        {isAdmin && (
          <Button 
            onClick={handleNewAccessPoint} 
            variant="tech"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Access Point
          </Button>
        )}
      </div>

      {/* Formulário de Cadastro */}
      {showForm && (
        <AssetForm
          title={editingAccessPoint ? "Editar Access Point" : "Cadastrar Novo Access Point"}
          fields={accessPointFields}
          initialData={editingAccessPoint}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Tabela de Access Points */}
      <AssetTable
        title="Lista de Access Points"
        data={accessPoints}
        columns={tableColumns}
        onEdit={isAdmin ? handleEdit : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
        onView={handleView}
      />
    </div>
  );
}