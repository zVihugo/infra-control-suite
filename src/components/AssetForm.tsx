import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormField {
  name: string;
  label: string;
  type: "text" | "select" | "textarea";
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface AssetFormProps {
  title: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  onCancel?: () => void;
  initialData?: Record<string, string> | null;
}

export function AssetForm({ title, fields, onSubmit, onCancel, initialData }: AssetFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validação básica
    const requiredFields = fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.name]);

    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: `Por favor, preencha: ${missingFields.map(f => f.label).join(", ")}`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
      toast({
        title: "Sucesso!",
        description: `${title} salvo com sucesso.`,
      });
      // Reset form
      setFormData({});
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="tech-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center">
            <Plus className="w-5 h-5 mr-2 text-primary" />
            {title}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            Preencha os campos abaixo para cadastrar um novo item
          </p>
        </div>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-sm font-medium text-foreground flex items-center">
                {field.label}
                {field.required && <Badge variant="destructive" className="ml-2 text-xs">Obrigatório</Badge>}
              </Label>
              
              {field.type === "select" ? (
                <Select 
                  value={formData[field.name] || ""} 
                  onValueChange={(value) => handleInputChange(field.name, value)}
                >
                  <SelectTrigger className="tech-input">
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="tech-input min-h-[100px]"
                />
              ) : (
                <Input
                  id={field.name}
                  type="text"
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="tech-input"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-border">
          {onCancel && (
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            variant="tech"
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Card>
  );
}