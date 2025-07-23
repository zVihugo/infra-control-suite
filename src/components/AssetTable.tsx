import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Download 
} from "lucide-react";

interface AssetTableProps {
  title: string;
  data: Record<string, any>[];
  columns: { key: string; label: string; type?: "status" | "text" | "date" }[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onView?: (item: any) => void;
}

export function AssetTable({ title, data, columns, onEdit, onDelete, onView }: AssetTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "ativo":
        return "bg-accent text-accent-foreground";
      case "inativo":
        return "bg-destructive text-destructive-foreground";
      case "manutenção":
        return "bg-yellow-500 text-yellow-50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const renderCellContent = (item: any, column: any) => {
    const value = item[column.key];
    
    if (column.type === "status") {
      return (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      );
    }
    
    if (column.type === "date" && value) {
      return new Date(value).toLocaleDateString("pt-BR");
    }
    
    return value || "-";
  };

  return (
    <Card className="tech-card">
      {/* Header da Tabela */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <p className="text-muted-foreground text-sm mt-1">
            {filteredData.length} {filteredData.length === 1 ? "item encontrado" : "itens encontrados"}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="tech-input pl-10 w-64"
            />
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead key={column.key} className="font-semibold text-foreground">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + 1} 
                  className="h-24 text-center text-muted-foreground"
                >
                  {searchTerm ? "Nenhum resultado encontrado" : "Nenhum item cadastrado"}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow 
                  key={index} 
                  className="hover:bg-muted/30 transition-colors duration-200"
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className="font-medium">
                      {renderCellContent(item, column)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onView && (
                          <DropdownMenuItem onClick={() => onView(item)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem 
                            onClick={() => onDelete(item)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}