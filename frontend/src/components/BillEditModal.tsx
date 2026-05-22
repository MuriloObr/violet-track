import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { api, Bill, Category } from '../services/api';

interface BillEditModalProps {
  bill: Bill | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const BillEditModal: React.FC<BillEditModalProps> = ({
  bill,
  isOpen,
  onClose,
  onSave,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getCategories().then(setCategories).catch(console.error);
      setSelectedCategory(bill?.category || '');
    }
  }, [isOpen, bill]);

  const handleSave = async () => {
    if (!bill) return;
    setIsSaving(true);
    try {
      await api.updateBill(bill.id, { category: selectedCategory });
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to update bill:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Descrição</p>
            <p className="text-sm text-muted-foreground">{bill?.description}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Categoria</p>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
